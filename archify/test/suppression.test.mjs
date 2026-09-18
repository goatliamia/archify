import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

import { compileWorkflow } from '../renderers/workflow/workflow-compiler.mjs';

// Suppression used to hide chrome that the viewer still built. It now means the
// effect is never created, and the id belongs to the chrome that owns it. The
// point of this file is the other half: an unstated document is not a second
// case — the same code path runs with a condition that is simply false.

const here = path.dirname(fileURLToPath(import.meta.url));
const skillRoot = path.resolve(here, '..');
const template = fs.readFileSync(path.join(skillRoot, 'assets', 'template.html'), 'utf8');

function document(reader) {
  return {
    schema_version: 2,
    diagram_type: 'workflow',
    meta: {
      title: 'Suppression fixture',
      quality_profile: 'showcase',
      views: [
        { id: 'one', label: 'One', focus: ['a'] },
        { id: 'two', label: 'Two', focus: ['b'] },
      ],
      ...(reader ? { reader } : {}),
    },
    lanes: [{ id: 'l1', label: 'Lane' }],
    nodes: [
      { id: 'a', lane: 'l1', col: 0, type: 'frontend', label: 'A', width: 120 },
      { id: 'b', lane: 'l1', col: 1, type: 'backend', label: 'B', width: 120 },
    ],
    edges: [{ id: 'ab', from: 'a', to: 'b', label: 'go' }],
    cards: [],
  };
}

test('an unstated document carries no suppression and is left alone', () => {
  const result = compileWorkflow({ workflow: document(), qualityProfile: 'showcase' });
  assert.equal(result.ok, true);
  assert.doesNotMatch(result.svg, /data-suppressed/);
  assert.equal(result.receipt.suppressed, undefined);
  assert.doesNotMatch(result.svg, /guided-view-chapter-delta\s*\{[^}]*display:\s*none/);
});

test('a declared effect leaves the drawing and is recorded in the receipt', () => {
  const result = compileWorkflow({
    workflow: document({ suppress: ['chapter_delta'] }),
    qualityProfile: 'showcase',
  });
  assert.equal(result.ok, true);
  assert.match(result.svg, /data-suppressed="chapter_delta"/);
  assert.deepEqual(result.receipt.suppressed, ['chapter_delta']);
  // Hiding was the old lie: the stylesheet no longer mentions the effect.
  assert.doesNotMatch(result.svg, /guided-view-chapter-delta\s*\{[^}]*display:\s*none/);
});

test('the chrome that owns the effect is the one that reads the declaration', () => {
  // One creation site, one consumer, both guarded: an unstated document builds
  // the chrome exactly as before, and a declared one builds everything else.
  assert.equal((template.match(/effectSuppressed\('chapter_delta'\)/g) || []).length, 1);
  assert.match(template, /if \(!effectSuppressed\('chapter_delta'\)\) \{/);
  assert.match(template, /if \(delta\) button\.appendChild\(delta\);/);
  assert.match(template, /if \(deltaLabel\) \{/);
  assert.equal((template.match(/var suppressedEffects = /g) || []).length, 1);
});

test('the delivery receipt says what the delivered file left out', () => {
  const spec = path.join(os.tmpdir(), 'suppression-' + Math.random().toString(36).slice(2) + '.workflow.json');
  const output = path.join(os.tmpdir(), 'suppression-' + Math.random().toString(36).slice(2) + '.html');
  fs.writeFileSync(spec, JSON.stringify(document({ suppress: ['chapter_delta'] }), null, 2));
  const delivered = spawnSync(process.execPath, [
    path.join(skillRoot, 'bin', 'archify.mjs'), 'deliver', 'workflow', spec, output, '--quality', 'showcase', '--json',
  ], { cwd: skillRoot, encoding: 'utf8' });
  assert.equal(delivered.status, 0, delivered.stdout + delivered.stderr);
  const receipt = JSON.parse(delivered.stdout.slice(delivered.stdout.indexOf('{')));
  assert.deepEqual(receipt.suppressed, ['chapter_delta']);

  const quiet = path.join(os.tmpdir(), 'suppression-' + Math.random().toString(36).slice(2) + '.workflow.json');
  const quietOut = path.join(os.tmpdir(), 'suppression-' + Math.random().toString(36).slice(2) + '.html');
  fs.writeFileSync(quiet, JSON.stringify(document(), null, 2));
  const quietDelivered = spawnSync(process.execPath, [
    path.join(skillRoot, 'bin', 'archify.mjs'), 'deliver', 'workflow', quiet, quietOut, '--quality', 'showcase', '--json',
  ], { cwd: skillRoot, encoding: 'utf8' });
  assert.equal(quietDelivered.status, 0, quietDelivered.stdout + quietDelivered.stderr);
  const quietReceipt = JSON.parse(quietDelivered.stdout.slice(quietDelivered.stdout.indexOf('{')));
  assert.equal(quietReceipt.suppressed, undefined);
  fs.rmSync(spec, { force: true });
  fs.rmSync(output, { force: true });
  fs.rmSync(quiet, { force: true });
  fs.rmSync(quietOut, { force: true });
});
