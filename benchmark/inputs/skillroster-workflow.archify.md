# SkillRoster: inspect, apply and undo

Inspection derives a plan, human approval precedes filesystem mutation, and apply/undo recheck fingerprints instead of forcing over changed files.

@meta locale=en style=product quality_profile=standard

## How does it work? {#implementation}

@workflow id=graph title="SkillRoster: inspect, apply and undo"
| scan | Inspect installed skills | backend |
| plan | Derive change plan | backend |
| review | Review and approve | frontend |
| apply | Apply checked changes | backend |
| receipt | Save receipt and backups | database |
| undo | Undo with checks | backend |
| restore | Restore prior files | backend |
| blocked | Refuse conflicting change | backend |
| scan > plan |
| plan > review |
| review > apply | approved |
| apply > receipt | verified |
| apply > blocked | changed precondition |
| receipt > undo | later undo request |
| undo > restore | fingerprints still match |
| undo > blocked | conflict |
