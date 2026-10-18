# Squad: CLI and persisted coordination

Manager and worker commands meet at the same store. Task queries and unread-message delivery are reads of persisted state, not a fabricated worker daemon.

@meta locale=en style=product quality_profile=standard

## How does it work? {#implementation}

@architecture id=graph title="Squad: CLI and persisted coordination"
| manager | Manager | frontend |
| cli | Squad CLI | backend |
| store | Task and message store | backend |
| db | SQLite state | database |
| worker | Worker | external |
| manager > cli | assign or inspect |
| worker > cli | receive, ack, complete |
| cli > store | checked operation |
| store > db | transaction or query |
| store > cli | task and messages |
| cli > worker | assignment and task state |
| cli > manager | result summary |
