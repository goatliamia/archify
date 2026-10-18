# Native route acceptance follow-up

Candidate: `522999d6d72a7dbb1c4dc6ff68c1ba8ecc99f710`; reviewed parent: `58967708f77cc961b5f698be7a26bd268962f90f`; base: `824db3ad62bae7f7acde02c65f3c236d41e60b5c`.

[Codex finding](https://github.com/tt-a1i/archify/pull/997#discussion_r4306628431): a five-node compact architecture graph passed on base but failed after unfolding, even though it met the width budget. Its long connection crossed two unrelated nodes; showcase also reported an ambiguous corridor and a short turn. This was reproduced in both standard and showcase. The same workflow input had no standard regression and improved showcase acceptance.

A broader follow-up probe also found a six-node labeled cycle whose default label covered a node in standard. The regression test covers both inputs and both profiles, preserved graph counts, a successful real native render/check, and unchanged compiled input. [Exact input rows and before/after diagnostics](route-reproductions.json).

## Change and impact

Compact architecture expansion now measures the final centered node boxes and uses the existing native architecture router to check node crossings, distinct corridors, turn lengths, arrowhead spacing and default-label clearance before accepting a cyclic placement. A rejected expansion uses the existing legacy placement; final output still goes through the complete native validation and artifact check. This is a conservative candidate filter, not a replacement checker or a guarantee that every graph can render.

The existing architecture route configuration and label-box calculation were moved into shared functions used by rendering and the candidate filter. Their values, native route algorithm and validator thresholds are unchanged. Speculative diagnostics are suppressed so a discarded candidate cannot contaminate a later failure. Acyclic placement skips this speculative route work. No syntax, schema, preparation/cache contract, authored JSON geometry, Viewer or Skill was changed in this follow-up.

## Verification

| Check | Result |
| --- | --- |
| Related native/Explainer selection, 30 files | 370/370 passed; before final default-label guard |
| Final fourteen Node-only Explainer files | 129/129 passed; zero skips/cancellations |
| Final Edge Explainer + architecture reading size | 11/11 passed |
| Chrome full selection, two runs | 10/11 each; different process-exit cleanup timeouts |
| Isolated replay of both Chrome cleanup failures | 2/2 passed |
| Generated freshness and golden renders | Passed |
| Isolated packaged Explainer smoke | Passed without dependencies |
| Canonical ZIP, Node 22.23.2/zlib 1.3.1-e00f703 | Byte-identical rebuild, 200 files |
| Width/readability boundary corpus | 64/64 base-accepted inputs retained; no topology differences |
| Additional 64 chorded-cycle inputs | All 55 base-accepted inputs retained; no topology differences or new rejection |
| Fixed-seed acyclic comparison | 400 exact comparisons, no differences |
| Ten real-source compact native models | All unchanged from reviewed parent |
| Fixed native architecture models on base/current renderer | Ten profile/input comparisons, identical SVG hashes or failure diagnostics |

The final Explainer pass was rerun after the last guard edit. The native architecture source from the 370-test and generated/golden runs is identical to this commit; those results are reused for that unchanged source. The selections overlap and their test counts are not additive. Chrome's two failed full runs remain disclosed: they reported `ARCHIFY_TEMP_CLEANUP` when Chrome did not exit, and both affected cases passed focused replay. This report does not claim a clean full Chrome run or a baseline reproduction of that local cleanup issue.

[Structured results](route-followup.json), [64 additional cycle inputs and results](route-audit.json), [64 readability inputs and results](route-readability.json). ZIP SHA-256: `b91cf7ac918271ddda08e1d597a2b0738ffebff2525e65b3ca898f0521140d3b`.

The real-source replay remains standard 10/10 and showcase 9/10. Its one existing showcase rejection is not hidden. The ten compact models are unchanged from the previous candidate, and the ten fixed-native profile/input comparisons support reuse of the prior native visual outcomes. Original [benchmark timing samples](benchmark/README.md) retain their original revision; fresh measurements for this route-guard follow-up are recorded separately below. These are finite maintenance-authored comparisons, not independent Agent-generation sessions.

The standing maintainer scope and Agent-comparison pilot decisions remain unresolved. The three already-confirmed base Skill wording assertion failures are separate from these route defects. The new source head starts its own remote CI and robot review; no merge is performed.

## Small serial timing comparison

Five unchanged real-source architecture inputs were delivered from isolated packaged parent and candidate sources with Node 22.23.2, standard quality and update checks disabled. Each input used one warmup pair and three measured alternating pairs; all deliveries succeeded. This is a local diagnostic with a small sample, not a model-generation or universal performance benchmark.

| Input | Parent median | Candidate median | Ratio |
| --- | --- | --- | --- |
| openpi-architecture | 1.388s | 1.555s | 1.120× |
| hive-architecture | 1.481s | 1.798s | 1.214× |
| mco-architecture | 1.414s | 1.548s | 1.095× |
| squad-architecture | 1.412s | 1.571s | 1.113× |
| skillroster-architecture | 1.736s | 1.792s | 1.032× |

The additional check has a measurable cost here: per-input medians are about 3–21% higher (roughly 0.06–0.32s), with candidate deliveries around 1.55–1.80s. This fix prioritizes preserving deliverability; it does not claim a performance improvement. [All timing samples and input hashes](route-timing.json). The old benchmark results keep their own revision identity.
