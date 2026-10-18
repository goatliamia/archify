# OpenPI: delegate, observe and settle

A bounded delegation uses an independent Pi session. Cancellation and normal settlement converge on the managed result; no automatic retry is invented.

@meta locale=en style=product quality_profile=standard

## How does it work? {#implementation}

@workflow id=graph title="OpenPI: delegate, observe and settle"
| request | Delegate task | frontend |
| admit | Admit child | backend |
| session | Start Pi session | backend |
| events | Observe events | backend |
| settle | Settle snapshot | backend |
| result | Return result | frontend |
| cancel | Cancel session | backend |
| request > admit |
| admit > session |
| session > events |
| events > settle | finished or error |
| settle > result |
| request > cancel | caller cancels |
| cancel > settle | bounded cleanup |
