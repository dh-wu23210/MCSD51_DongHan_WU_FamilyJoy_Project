# Sprint 3 TDD - Overview and Integration Guide

## 1. Overview & Scope
Sprint 3 adds the Quest ? Crystal ? Shop ? Backpack loop, crystal wallet display, and reward shop management.

## 2. Architecture (Mermaid)
```mermaid
flowchart LR
  Controllers --> Services
  Services --> Repositories
  Controllers --> ViewModels
  ViewModels --> Views
```

## 3. Module Responsibilities
- Controllers: HTTP request handling and redirects.
- Services: business rules (rewards, purchases, wallet updates).
- Repositories: DB access.
- ViewModels: prepare view data for SSR templates.

## 4. Data Model / ERD (Mermaid)
```mermaid
erDiagram
  users {
    char(36) id PK
    int crystal_balance
  }
  rewards {
    char(36) id PK
    char(36) family_id FK
    varchar name
    varchar description
    varchar icon_key
    int price
    enum status
  }
  reward_child_assignments {
    char(36) id PK
    char(36) reward_id FK
    char(36) child_id FK
    int quantity
  }
  child_backpack_items {
    char(36) id PK
    char(36) child_id FK
    char(36) reward_id FK
    int quantity
  }
  crystal_ledger {
    char(36) id PK
    char(36) user_id FK
    int amount
    enum type
    char(36) source_id
  }

  users ||--o{ crystal_ledger : has
  rewards ||--o{ reward_child_assignments : assigned
  rewards ||--o{ child_backpack_items : owned
  users ||--o{ reward_child_assignments : child
  users ||--o{ child_backpack_items : child
```

## 5. Integration Points
- Quest Review: when marking `complete`, issue crystal rewards and write ledger.
- Parent Shop: shop home + reward library CRUD + per-child assignment.
- Child Shop: purchase flow updates inventory and ledger.
- Header UI: display crystal balance for child only.

## 6. Validation Rules
- Reward name <= 50 chars, description <= 120 chars.
- Price in [1, 9999].
- Quantity per child >= 0.
- Icon key must be in fixed list.

## 7. Error Handling
- Redirect with query error parameters.
- Toast messages for user feedback.

## 8. Security & Access Control
- requireAuth, requireRole, requirePasswordChange.
- CSRF intentionally not used.

## 9. Out of Scope
- Essence economy, wish tree logic, ledger UI.
