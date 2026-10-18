# 循环、汇合与一份正文

保留完整流程，用明确的引用，让图和正文共同表达同一份内容。

@meta locale=zh-CN style=product quality_profile=showcase

## 一次复核怎样返回重试？ {#process}

@workflow id=retry title="Review and retry"
| enter | Enter |
| check | Check? | backend | block:check-notes |
| verify | Verify? |
| record | Record |
| done | Done |
| revise | Revise | backend | block:retry-notes |
| enter > check |
| check > verify | yes |
| verify > record | yes |
| record > done |
| check > revise | no |
| verify > revise | no |
| record > revise | error |
| revise > enter | retry | dashed |

## 检查需要关注什么？ {#explanation}

@prose id=check-notes
| 检查输入是否齐全。条件满足后继续复核；有缺项时，进入补充步骤。这里的正文只写一次，悬停或聚焦 Check? 节点即可读取。 |

@prose id=retry-notes
| 补充材料后回到入口，再走一遍检查。三条分支共享这个步骤，全部返回关系都保留在图中。 |

## 怎样轻量修改？ {#editing}

只修改有稳定 ID 的正文段落。节点继续引用同一个 ID，说明更新，图的结构和原生交互保持一致。
