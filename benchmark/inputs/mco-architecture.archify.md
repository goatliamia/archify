# MCO: invocation and artifact boundary

The runtime delegates transport to adapters, receives decoded invocation outcomes, and writes raw answer artifacts without treating prose as structured findings.

@meta locale=en style=product quality_profile=standard

## How does it work? {#implementation}

@architecture id=graph title="MCO: invocation and artifact boundary"
| cli | Review CLI | frontend |
| runtime | Invocation runtime | backend |
| adapter | Provider adapter | backend |
| provider | Provider process | external |
| artifacts | Answer artifacts | database |
| cli > runtime | review request |
| runtime > adapter | invocation |
| adapter > provider | transport |
| provider > adapter | answer events |
| adapter > runtime | decoded outcome |
| runtime > artifacts | ordered answers and status |
| runtime > cli | complete, partial or failed |
