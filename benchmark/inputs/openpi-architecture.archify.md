# OpenPI: managed child sessions

Request and completion communication is bidirectional. Cycles here express actual calls and returned events, not invented processing retries.

@meta locale=en style=product quality_profile=standard

## How does it work? {#implementation}

@architecture id=graph title="OpenPI: managed child sessions"
| parent | Parent agent | frontend |
| tools | Subagent tools | backend |
| manager | Subagent manager | backend |
| session | Pi child session | backend |
| delivery | Result inbox | backend |
| parent > tools | delegate or inspect |
| tools > manager | spawn, wait, cancel |
| manager > session | create and control |
| session > manager | lifecycle events |
| manager > delivery | settled snapshot |
| delivery > parent | result follow-up |
