# Cyclic workflow acceptance follow-up

Candidate: `915980766764689fcc9a231fc29f4a42e764c68a`; reviewed parent: `522999d6d72a7dbb1c4dc6ff68c1ba8ecc99f710`; comparison base: `824db3ad62bae7f7acde02c65f3c236d41e60b5c`.

## Reproduced failure

[Codex finding](https://github.com/tt-a1i/archify/pull/997#discussion_r4306710810): an eight-node workflow ring with three extra returns can become invalid after expansion and wrapping into lanes. The reproduced input declares nodes in reverse order and includes `n1 > n0`, `n1 > n3` and `n4 > n2` alongside the ring. Base preparation passes; the reviewed parent fails showcase with an ambiguous corridor. Forward declaration order passes, which is why the earlier same-topology forward sample did not expose it.

Investigation also found a long-label ring that base could deliver but expansion could not fit into the supported wrapped columns. Both cases now pass real native preparation under standard and showcase. The CLI regression starts with standard metadata and overrides delivery to showcase; strict provenance succeeds and source bytes remain unchanged. Exact inputs/results are retained in [the workflow audit](workflow-audit.json), samples 0 and 16.

## Small change

The existing workflow model construction, including phase/lane choices and wrapping, is now a reusable local function. The cyclic placement filter checks the completed model with the existing native `compileWorkflow` function under both profiles. Invalid native output or a candidate exceeding the shorthand column budget falls back to the legacy placement. Checking both profiles keeps later CLI overrides safe without changing parsing/preparation/cache contracts. Discarded diagnostics are isolated. Acyclic placement skips this work. No alternate workflow router, new authoring requirement or native validator change was introduced.

An older topology test also asserted mandatory expansion for a mixed self-loop/parallel-edge specimen that the native workflow compiler rejects even at the parent. That assertion is now exercised on a deliverable retry/exit fixture, while the complex specimen retains checks for every node, parallel return, self-loop and deterministic compilation. This preserves useful optimization coverage without requiring expansion of an invalid candidate.

## Checks and limits

| Check | Result |
| --- | --- |
| Final fourteen Node-only Explainer files | 130/130 passed; no skips/cancellations |
| Chrome Explainer | 8/8 passed |
| Edge Explainer | 8/8 passed |
| Isolated packaged Explainer smoke | Passed without dependencies |
| Canonical ZIP rebuilt twice | Byte-identical, 200 files |
| Additional workflow corpus | 68 inputs: all 53 base-accepted and all 54 parent-accepted inputs remain accepted |
| Authored graph contents | Zero topology differences; six automatic node-array ordering changes |
| Fixed-seed acyclic comparison | 400 exact comparisons, no differences |
| Ten source-backed compact models | All unchanged from the reviewed parent |

The workflow corpus covers rings with chords, labels, reverse declaration order, explicit phases and long labels under both profiles. Automatic node-array ordering is compared separately from node identities/labels/types/icons and full edge contents. The report retains exact rows, profile, base/parent/candidate outcomes and comparison method. This is finite compatibility evidence, not an arbitrary-input correctness claim.

The native renderer, Viewer, schema and generated inputs are unchanged by this follow-up. Their previous generated/golden results and original visual evidence remain attributed to the parent. The final Explainer checks, both browser suites, package smoke, ZIP and acyclic replay above are fresh. Original Chrome cleanup failures remain disclosed at their earlier revision; they are not relabeled as final-head failures or clean passes. New-head remote CI will run separately. The three known base Skill wording assertion failures are not modified.

ZIP SHA-256: `d05bf1fc682a95a896f6dbefa3e9b1fd7728d0e3a33d7b6994d3f80836fbed8a`. [Structured results](workflow-followup.json). Maintainer scope agreement and the independent Agent-generation pilot remain unresolved; fixed-input replays do not replace that decision or evidence. No merge is performed.

## Local cost

Five unchanged real-source workflow inputs were delivered from isolated packaged parent and candidate sources with canonical Node 22.23.2 and standard quality. One warmup pair and three measured alternating pairs were used per input; all deliveries succeeded. Tests/browser jobs finished before these samples.

| Input | Parent median | Candidate median | Ratio |
| --- | --- | --- | --- |
| openpi-workflow | 1.162s | 1.342s | 1.155× |
| hive-workflow | 1.232s | 1.885s | 1.530× |
| mco-workflow | 1.131s | 1.421s | 1.257× |
| squad-workflow | 1.134s | 1.685s | 1.485× |
| skillroster-workflow | 1.255s | 1.371s | 1.093× |

The additional compiler checks cost roughly 0.12–0.65s in this small sample (about 9–53% higher per-input medians), with candidate deliveries around 1.34–1.89s. This fix protects deliverability and does not claim a speed improvement. [All samples and input hashes](workflow-timing.json). Earlier architecture and baseline benchmark timings retain their own revisions and are not fresh timings for this commit.
