# SkillRoster: inspection and mutation boundaries

The scan and planning stages are separate from guarded filesystem changes. Saved state provides receipts and backups for later undo.

@meta locale=en style=product quality_profile=standard

## How does it work? {#implementation}

@architecture id=graph title="SkillRoster: inspection and mutation boundaries"
| ui | CLI and review | frontend |
| scan | Skill scanner | backend |
| plan | Roster planner | backend |
| change | Checked apply and undo | backend |
| files | Skill files | database |
| state | Receipts and backups | database |
| ui > scan | inspect |
| scan > files | read installation state |
| scan > plan | snapshot |
| plan > change | approved operations |
| change > files | checked mutation |
| files > change | current fingerprints |
| change > state | receipt and backups |
| state > change | undo receipt |
