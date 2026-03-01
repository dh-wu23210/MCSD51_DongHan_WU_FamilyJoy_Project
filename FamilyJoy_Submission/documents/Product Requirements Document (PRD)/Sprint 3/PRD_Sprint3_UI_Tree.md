# Sprint 3 PRD - UI Tree

## 1. UI Tree (MVP)
```mermaid
flowchart TD
  Login --> DashboardParent
  Login --> SpiritTree
  DashboardParent --> QuestHome
  DashboardParent --> ShopHome
  ShopHome --> RewardLibrary
  ShopHome --> ChildShopList
  SpiritTree --> ChildShop
  SpiritTree --> Backpack
  ChildShop --> PurchaseConfirm
  Backpack --> BackpackModal
  QuestHome --> QuestBook
  QuestHome --> QuestAssign
  QuestHome --> QuestReview
```
