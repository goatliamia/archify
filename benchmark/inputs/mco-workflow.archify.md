# MCO: provider review outcomes

A requested provider set runs concurrently. Invocation errors remain explicit results; the aggregate distinguishes all, some, and no successful invocations.

@meta locale=en style=product quality_profile=standard

## How does it work? {#implementation}

@workflow id=graph title="MCO: provider review outcomes"
| request | Accept review request | frontend |
| providers | Expand invocations | backend |
| run | Run providers | backend |
| record | Preserve each outcome | backend |
| aggregate | How many succeeded? | backend |
| complete | Complete | backend |
| partial | Partial | backend |
| failed | Failed | backend |
| request > providers |
| providers > run |
| run > record | answer, failure or timeout |
| record > aggregate |
| aggregate > complete | all |
| aggregate > partial | some |
| aggregate > failed | none |
