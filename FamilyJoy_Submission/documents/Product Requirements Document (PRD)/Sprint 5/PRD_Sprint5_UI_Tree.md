# Sprint 5 PRD - UI Tree

```mermaid
flowchart TD
  Login --> SpiritTreeParent
  Login --> SpiritTreeChild

  subgraph Parent
    SpiritTreeParent --> ParentChildTabs
    SpiritTreeParent --> ParentTreeArea
    SpiritTreeParent --> ParentWishGrid
    ParentWishGrid --> ParentWishDetailModal
    ParentWishDetailModal --> AcceptWishConfirm
  end

  subgraph Child
    SpiritTreeChild --> ChildTreeArea
    SpiritTreeChild --> ChildWishGrid
    SpiritTreeChild --> ChildBackpackGrid
    ChildBackpackGrid --> ChildItemDetailModal
    ChildItemDetailModal --> MakeWish
    ChildWishGrid --> ChildWishDetailModal
  end
```
