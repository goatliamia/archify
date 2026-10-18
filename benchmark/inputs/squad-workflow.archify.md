# Squad: leased task and explicit requeue

A task is assigned and acknowledged by its intended active worker; completion requires the lease owner. Explicit requeue returns the record to queued state.

@meta locale=en style=product quality_profile=standard

## How does it work? {#implementation}

@workflow id=graph title="Squad: leased task and explicit requeue"
| assign | Assign task | backend |
| queued | Queued task | database |
| ack | Worker may acknowledge? | backend |
| lease | Acked with lease | database |
| complete | Owner completes task | backend |
| result | Read result summary | frontend |
| requeue | Explicit requeue | backend |
| reject | Reject invalid state | backend |
| assign > queued |
| queued > ack |
| ack > lease | intended active worker |
| ack > reject | invalid worker or state |
| lease > complete | lease owner |
| complete > result |
| lease > requeue | manager requests reassignment |
| requeue > queued | reset lease and result |
