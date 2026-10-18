# Hive: workbench and worker process

The workbench calls server operations; persisted dispatch messages reach a worker PTY through the runtime, and reports return through server message operations.

@meta locale=en style=product quality_profile=standard

## How does it work? {#implementation}

@architecture id=graph title="Hive: workbench and worker process"
| web | Browser workbench | frontend |
| api | Server operations | backend |
| store | Dispatch store | database |
| outbox | Message outbox | backend |
| runtime | Agent runtime | backend |
| worker | Worker CLI process | external |
| web > api | team actions |
| api > store | persist message |
| api > outbox | drain recipient |
| outbox > runtime | deliver envelope |
| runtime > worker | PTY input |
| worker > api | report message |
| api > web | status and messages |
