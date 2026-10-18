# Impact diagnosis and native column-budget follow-up

Base: `824db3ad62bae7f7acde02c65f3c236d41e60b5c`. Initial candidate: `8bb803ef0c27a5602bf74330f16a78c66864749c`. Follow-up: `7a9b2c939bfe8a85e3edc67c1a90e848954d9b5b`.

## Scope before selecting generation evidence

| Path | Expected impact and evidence |
| --- | --- |
| Standalone native JSON diagrams | The changed compact compiler is bypassed; native renderers and explicit geometry are unchanged. Reuse the recorded golden/native CI evidence. |
| Compact workflow/architecture without cycles | DFS omits no edges. Outgoing edge order and indegrees match the original rank traversal, yielding the same queue, ranks and row order. A fixed sample of 400 compilations also remains identical. |
| Compact workflow/architecture with cycles | Placement intentionally changes. Check complete topology, returns, downstream exits and native limits on identical input. Native acceptance and visual review remain necessary. |
| Paragraph references | Optional page bindings reuse existing text. Check parsing, target diagnostics, body patch isolation, focus and native activation. Invalid legacy node-source bindings are now diagnosed instead of silently ignored. |

These are code-path and compatibility findings. They do not establish faster model authoring, fewer repairs, or better readability on all inputs. The current benchmark's native-JSON prompts bypass the changed compact compiler. Any additional live comparison should exercise the Explainer entry point; its scope still needs maintainer agreement under the pilot protocol.

## A concrete gap found by the impact check

Unfolding a 13-node architecture cycle required 13 columns, beyond the existing native limit of 12. With no edge labels, base passed the native standard check while the initial candidate rejected the shorthand. This gap was not covered by the earlier small acyclic sample.

The follow-up first tries unfolded placement. If it exceeds the native column budget, it reuses the original rank traversal on the full placement adjacency. Both attempts use the same traversal code. Every authored node, edge, label and variant stays in the native specification. Already unsupported wide acyclic chains retain their existing diagnostic; no native constraint is relaxed.

The new regression covers a complete 13-node cycle, retained return edge, native standard validation and the unchanged wide-chain rejection. The paired probe also includes 12-node cycles and labeled edges. Original failed outcomes are retained in [the structured report](impact-followup.json). Native validation success here does not establish that a long cycle fits every Explainer preview or is visually ideal.

## Verification at the follow-up head

- All 14 Node-only Explainer files: 123 cases, 121 passed and 2 failed at symlink fixture creation with the same known Windows EPERM limitation; no cancelled or skipped cases.
- Explainer Chrome: 8 passed, zero skipped. Edge: 8 passed, zero skipped.
- Generated freshness and golden checks passed. The clean staged Explainer package passed its zero-dependency smoke.
- Canonical ZIP rebuilt and reproduced byte for byte: SHA-256 `1c8dbf21a3c41ca47519d73d25da318c91926b519c1e5b40be665569efedb9bc`.
- The same 400 acyclic comparisons still report zero differences.

The full 3332-case Node run, complete 298-case Chrome run and prior remote CI belong to the initial candidate and are retained with that SHA in the original report. They are reused for unaffected paths, not relabeled as fresh follow-up runs. Remote CI reruns on the follow-up commit. No fresh Agent generation session was run, and no benchmark exemption is claimed.

## Additional acceptance compatibility check

At the same follow-up head, a directed compatibility audit covered every cyclic directed graph on three labeled nodes without self-loops: 39 graphs × two node declaration orders × compact architecture/workflow = 156 paired inputs. Each base input passed the native standard check; all 156 remained renderable on candidate, with zero topology differences and zero newly rejected inputs. [Inputs](cyclic-acceptance-inputs.json) and [results](cyclic-acceptance.json) are portable, constructed evidence. The base/candidate compact compilers use the same native renderer, whose source is unchanged between the two revisions.

This is a finite acceptance check, not a natural-language generation benchmark or a proof that every cyclic layout improves. The separate 13-node regression covers the native column-budget boundary. The observed benefit remains concrete: the original six-node/eight-edge retry case preserves its graph, clears three showcase errors, and uses a 796 × 404 required viewBox instead of 796 × 900. The follow-up restores the previously accepted 13-node cycle. No further performance optimization or renderer refactor is included.
