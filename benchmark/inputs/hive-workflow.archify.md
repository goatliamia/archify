# Hive: queued dispatch delivery

The outbox drains queued messages, records delivery or PTY failure, and retries a failed write only after another explicit drain/start.

@meta locale=en style=product quality_profile=standard

## How does it work? {#implementation}

@workflow id=graph title="Hive: queued dispatch delivery"
| accept | Authorize message | backend |
| queue | Select queued message | backend |
| active | Active worker? | backend |
| write | Write PTY envelope | backend |
| ack | Mark delivered | backend |
| failed | Record failure | backend |
| done | Stop draining | backend |
| accept > queue |
| queue > active |
| active > write | ready |
| active > done | no active run |
| write > ack | written |
| write > failed | PTY error |
| ack > queue | next queued message |
| failed > queue | next explicit drain |
