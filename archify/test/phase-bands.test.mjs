import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

// A phase band is a range of the value the document derives. The column a stop
// stands in is where that number falls, not a number the author typed first.
// These cases lock both directions: a declared band places, a declared column
// keeps behaving exactly as it always did, and a number no band covers is named
// instead of being pushed into the nearest one.

const here = path.dirname(fileURLToPath(import.meta.url));
const skillRoot = path.resolve(here, '..');
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'archify-phase-bands-'));

const BANDS = [
  { id: 'b1', label: 'band-1', from: '05:00', to: '11:59' },
  { id: 'b2', label: 'band-2', from: '12:00', to: '16:59' },
  { id: 'b3', label: 'band-3', from: '17:00', to: '22:59' },
  { id: 'b4', label: 'band-4', from: '23:00', to: '04:59' },
];

const LANES = [{ id: 'l1', label: 'Lane' }];

function document({ phases, nodes, edges, lanes, base = '09:00', rules } = {}) {
  const spec = {
    schema_version: 2,
    diagram_type: 'workflow',
    meta: {
      title: 'Phase fixture',
      quality_profile: 'showcase',
      rules: rules || [{
        id: 'clock',
        kind: 'accumulate',
        seeds: { l1: { start: 'a', base } },
        add: { node: 'stay', edge: 'ride' },
        render: { edge: '{value} ' },
      }],
    },
    lanes: lanes || LANES,
    nodes: nodes || [
      { id: 'a', lane: 'l1', col: 0, type: 'frontend', label: 'A', width: 120, facts: { stay: 60 } },
      { id: 'b', lane: 'l1', col: 1, type: 'backend', label: 'B', width: 120, facts: { stay: 60 } },
      { id: 'c', lane: 'l1', col: 2, type: 'frontend', label: 'C', width: 120, facts: { stay: 60 } },
    ],
    edges: edges || [
      { id: 'ab', from: 'a', to: 'b', label: 'go', facts: { ride: 120 } },
      { id: 'bc', from: 'b', to: 'c', label: 'go', facts: { ride: 300 } },
    ],
    cards: [],
  };
  if (phases) spec.phases = phases;
  return spec;
}

function write(spec, name) {
  const file = path.join(tmp, name + '.workflow.json');
  fs.writeFileSync(file, JSON.stringify(spec, null, 2));
  return file;
}

function codes(spec, name) {
  const result = spawnSync(process.execPath, [
    path.join(skillRoot, 'bin', 'archify.mjs'), 'validate', 'workflow', write(spec, name), '--json',
  ], { cwd: skillRoot, encoding: 'utf8' });
  return [...(result.stdout + result.stderr).matchAll(/"code": "([^"]+)"/g)].map((match) => match[1]);
}

function render(spec, name) {
  const output = path.join(tmp, name + '.html');
  const result = spawnSync(process.execPath, [
    path.join(skillRoot, 'renderers', 'workflow', 'render-workflow.mjs'), write(spec, name), output,
  ], { cwd: skillRoot, encoding: 'utf8' });
  return {
    status: result.status,
    output: result.stdout + result.stderr,
    html: fs.existsSync(output) ? fs.readFileSync(output, 'utf8') : '',
  };
}

function nodeX(html) {
  const columns = {};
  for (const group of html.matchAll(/<g[^>]*data-node-id="([^"]+)"[^>]*>([\s\S]*?)<\/g>/g)) {
    const rect = /<rect x="(-?[\d.]+)"/.exec(group[2]);
    if (rect) columns[group[1]] = Number(rect[1]);
  }
  return columns;
}

test('a declared band places each stop where its own number falls', () => {
  const placed = render(document({ phases: BANDS }), 'placed');
  assert.equal(placed.status, 0, placed.output);
  assert.deepEqual(codes(document({ phases: BANDS }), 'placed-codes'), []);
  const columns = render(document({
    phases: BANDS.map((band, index) => ({ id: band.id, label: band.label, fromCol: index, toCol: index })),
  }), 'placed-columns');
  assert.equal(columns.status, 0, columns.output);
  // The value form resolves into the columns the pipeline already speaks, so a
  // document that declares the same axis either way draws the same geometry.
  assert.deepEqual(nodeX(placed.html), nodeX(columns.html));
  const x = nodeX(placed.html);
  assert.deepEqual(Object.keys(x).sort(), ['a', 'b', 'c']);
  assert.ok(x.a < x.b && x.b < x.c, 'stops follow the clock: 09:00, 12:00, 18:00');
  for (const band of BANDS) assert.match(placed.html, new RegExp('>' + band.label + '<'));
});

test('a number no band covers is reported, never pushed into the nearest band', () => {
  const spec = document({ phases: BANDS.slice(0, 2) });
  assert.ok(codes(spec, 'out-of-band').includes('workflow/phase-out-of-range'));
  const rendered = render(spec, 'out-of-band');
  assert.notEqual(rendered.status, 0, 'an unplaceable stop must not be delivered');
});

test('a stop the rule never reaches keeps its authored column and is not reported', () => {
  const nodes = [
    { id: 'a', lane: 'l1', col: 0, type: 'frontend', label: 'A', width: 120, facts: { stay: 60 } },
    { id: 'b', lane: 'l1', col: 1, type: 'backend', label: 'B', width: 120, facts: { stay: 60 } },
    { id: 'c', lane: 'l1', col: 2, type: 'frontend', label: 'C', width: 120, facts: { stay: 60 } },
    { id: 'd', lane: 'l2', col: 3, type: 'frontend', label: 'D', width: 120 },
  ];
  const spec = document({ phases: BANDS, nodes, lanes: [...LANES, { id: 'l2', label: 'Second lane' }] });
  assert.deepEqual(codes(spec, 'unreached'), []);
  const rendered = render(spec, 'unreached');
  assert.equal(rendered.status, 0, rendered.output);
  const x = nodeX(rendered.html);
  assert.ok(x.d > x.c, 'a stop with no derived value stays in the column its author wrote');
});

test('an authored column that contradicts the derived value is reported', () => {
  const nodes = [
    { id: 'a', lane: 'l1', col: 0, type: 'frontend', label: 'A', width: 120, facts: { stay: 60 } },
    { id: 'b', lane: 'l1', col: 1, type: 'backend', label: 'B', width: 120, facts: { stay: 60 } },
    { id: 'c', lane: 'l1', col: 1, type: 'frontend', label: 'C', width: 120, facts: { stay: 60 } },
  ];
  assert.ok(codes(document({ phases: BANDS, nodes }), 'col-conflict').includes('workflow/phase-col-conflict'));
});

test('a band that crosses midnight holds the stop that reaches next day', () => {
  const phases = [
    { id: 'day', label: 'band-day', from: '05:00', to: '21:59' },
    { id: 'late', label: 'band-late', from: '22:00', to: '22:59' },
    { id: 'night', label: 'band-night', from: '23:00', to: '04:59' },
  ];
  const nodes = [
    { id: 'a', lane: 'l1', col: 1, type: 'frontend', label: 'A', width: 120, facts: { stay: 60 } },
    { id: 'b', lane: 'l1', col: 2, type: 'backend', label: 'B', width: 120, facts: { stay: 60 } },
  ];
  const edges = [{ id: 'ab', from: 'a', to: 'b', label: 'go', facts: { ride: 60 } }];
  const spec = document({ phases, nodes, edges, base: '22:00' });
  assert.deepEqual(codes(spec, 'wrap'), []);
  const rendered = render(spec, 'wrap');
  assert.equal(rendered.status, 0, rendered.output);
  const x = nodeX(rendered.html);
  assert.ok(x.a < x.b, '00:00 next day stands in the band that crosses midnight, after 22:00');
  assert.match(rendered.html, />band-day</, 'a band with no stop in it is still drawn');
});

test('a document that declares its axis in columns keeps every authored column', () => {
  const phases = BANDS.map((band, index) => ({ id: band.id, label: band.label, fromCol: index, toCol: index }));
  const nodes = [
    { id: 'a', lane: 'l1', col: 2, type: 'frontend', label: 'A', width: 120, facts: { stay: 60 } },
    { id: 'b', lane: 'l1', col: 1, type: 'backend', label: 'B', width: 120, facts: { stay: 60 } },
    { id: 'c', lane: 'l1', col: 0, type: 'frontend', label: 'C', width: 120, facts: { stay: 60 } },
  ];
  const spec = document({ phases, nodes });
  assert.deepEqual(codes(spec, 'column-form'), [], 'a column axis has nothing to contradict');
  const rendered = render(spec, 'column-form');
  assert.equal(rendered.status, 0, rendered.output);
  const x = nodeX(rendered.html);
  // The clock reaches them at 09:00, 12:00 and 18:00, and they still stand in
  // the columns their author wrote: the value places nothing while no band
  // declares a clock range.
  assert.ok(x.a > x.b && x.b > x.c);
});

test('phases that declare their extent two different ways are reported', () => {
  const phases = [
    { id: 'b1', label: 'band-1', from: '05:00', to: '11:59' },
    { id: 'b2', label: 'band-2', fromCol: 1, toCol: 1 },
  ];
  assert.ok(codes(document({ phases }), 'extent-mixed').includes('workflow/phase-extent-mixed'));
});

test('a phase that declares no extent at all is reported', () => {
  const phases = [{ id: 'b1', label: 'band-1' }];
  assert.ok(codes(document({ phases }), 'extent-missing').includes('workflow/phase-extent-missing'));
});

test('a clock band without a clock rule is reported', () => {
  const spec = document({
    phases: BANDS,
    rules: [{ id: 'tally', kind: 'sum', field: 'stay', on: 'node', expect: 180 }],
  });
  assert.ok(codes(spec, 'band-source').includes('workflow/phase-band-source'));
});

test('a band that starts before the previous one ends is reported', () => {
  const phases = [
    { id: 'b1', label: 'band-1', from: '12:00', to: '16:59' },
    { id: 'b2', label: 'band-2', from: '05:00', to: '11:59' },
  ];
  assert.ok(codes(document({ phases }), 'band-order').includes('workflow/phase-band-order'));
});

test('a stop a clock rule reaches needs no authored column', () => {
  const nodes = [
    { id: 'a', lane: 'l1', type: 'frontend', label: 'A', width: 120, facts: { stay: 60 } },
    { id: 'b', lane: 'l1', type: 'backend', label: 'B', width: 120, facts: { stay: 60 } },
    { id: 'c', lane: 'l1', type: 'frontend', label: 'C', width: 120, facts: { stay: 60 } },
  ];
  const spec = document({ phases: BANDS, nodes });
  assert.deepEqual(codes(spec, 'no-col'), []);
  const rendered = render(spec, 'no-col');
  assert.equal(rendered.status, 0, rendered.output);
  const x = nodeX(rendered.html);
  assert.ok(x.a < x.b && x.b < x.c, 'the value alone puts each stop in its band');
});

test('a stop nothing places is named instead of leaving the canvas quietly', () => {
  const nodes = [
    { id: 'a', lane: 'l1', type: 'frontend', label: 'A', width: 120, facts: { stay: 60 } },
    { id: 'b', lane: 'l1', type: 'backend', label: 'B', width: 120, facts: { stay: 60 } },
    { id: 'c', lane: 'l1', type: 'frontend', label: 'C', width: 120, facts: { stay: 60 } },
    { id: 'd', lane: 'l2', type: 'frontend', label: 'D', width: 120 },
  ];
  const spec = document({ phases: BANDS, nodes, lanes: [...LANES, { id: 'l2', label: 'Second lane' }] });
  assert.ok(codes(spec, 'no-place').includes('workflow/node-col-missing'));
});

process.on('exit', () => fs.rmSync(tmp, { recursive: true, force: true }));
