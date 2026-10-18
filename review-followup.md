# Review follow-up

Candidate: `58967708f77cc961b5f698be7a26bd268962f90f`; comparison base: `824db3ad62bae7f7acde02c65f3c236d41e60b5c`. Both initial robot reviews were submitted on `7a9b2c939bfe8a85e3edc67c1a90e848954d9b5b`.

## Confirmed defects and bounded fixes

- [CodeRabbit: sequence message references](https://github.com/tt-a1i/archify/pull/997#discussion_r4306522974): a message row could attach a body/source reference to its sender. Only actual actor/entity/node declaration rows now create references; invalid rows produce an authored-line diagnostic without mutating bindings. Tests also cover phase, edge and entity-field rows.
- [Codex: source reference position](https://github.com/tt-a1i/archify/pull/997#discussion_r4306537493): a previously valid source immediately after the node ID was missed. All previously accepted source-cell positions are preserved across the four compact diagram types. Duplicate bindings are rejected before side effects; prose, callout, list and facts targets are covered.
- [Codex: wide cycle readability](https://github.com/tt-a1i/archify/pull/997#discussion_r4306537489): a ten-node architecture ring remained below the twelve-column cap but projected its node text to 5.516px, below the existing 6px showcase floor. Automatic compact placement now checks the existing native grid/text-fit projection budget before unfolding. An overly wide candidate keeps the previous placement. A readable nine-node ring still unfolds. Every authored node and edge is retained; native routing, validation thresholds and explicit JSON geometry are unchanged. This is a conservative placement guard, not a guarantee that every graph is readable.

The readability guard applies consistently to automatic compact architecture placement, independent of the eventual quality override. A CLI regression starts from standard metadata and delivers with showcase, checks provenance, and confirms that the source Markdown is unchanged. No new syntax, quality API or cache contract was added.

## Fresh verification

Checks ran on the final source bytes committed as the candidate above, using canonical Node 22.23.2 on Windows.

| Check | Result |
| --- | --- |
| Fourteen Node-only Explainer files | 128/128 passed; no skips or cancellations |
| Chrome Explainer interactions | 8/8 passed |
| Generated freshness and golden output | Passed |
| Isolated packaged Explainer smoke | Passed without dependencies |
| Canonical ZIP rebuilt twice | Byte-identical; 200 package files |
| Readability boundary replay | 64/64 base-accepted inputs still accepted; no topology differences |
| Constructed acyclic comparison | 400 comparisons, no differences from base |
| Existing ten source-backed benchmark models | All ten unchanged from the prior candidate |

[Structured check summary](review-followup.json). ZIP SHA-256: `c60a7a9417def63cc88d52be8bbba6255368c592403f06c872acea8c71008851`.

The [64 retained readability inputs/results](review-readability.json) cover architecture rings with 6–13 nodes, short/long labels, forward/reverse declaration order and standard/showcase profiles. These inputs have unlabeled edges; this is finite boundary coverage, not an arbitrary-graph claim. The fresh fixed-seed acyclic comparison uses the [retained 400-input comparison definition](acyclic-compatibility.json). The [ten-model parity result](review-benchmark-parity.json) permits reuse of their prior native visual outcomes. Their [original timing samples](benchmark/README.md) still belong to the prior revision; no fresh timing or speed improvement is claimed.

The earlier full regression and Edge results remain attributed to their recorded revisions. They are not relabeled as fresh candidate passes. The three documented base Skill wording failures are separate from these fixed code defects; current remote CI is authoritative for the new head.

## Review disposition and remaining decisions

All three initial inline code findings were reproduced and addressed. The overlapping source-position regression found during investigation and reported by Codex is one issue, not two fixes. No additional inline findings were present when this report was prepared.

CodeRabbit also requested maintainer agreement for the optional nodeBlocks contract and an agreed fresh Agent-generation benchmark scope. Those remain acceptance decisions, rather than additional reproduced code defects. This follow-up neither invents agreement nor claims that maintenance-authored fixed-input replays replace independent Agent generation. The requested focused reference-validation coverage has been added. No unrelated Skill wording test or native validator was changed.
