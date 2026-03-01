# FamilyJoy Database ER Diagram

```mermaid
erDiagram
  FAMILIES {
    char36 id PK
    varchar100 name
    char4 family_code UK
  }

  USERS {
    char36 id PK
    char36 family_id FK
    varchar150 username UK
    enum role
    int crystal_balance
    tinyint is_initial_password
  }

  QUEST_DEFINITIONS {
    char36 id PK
    char36 family_id FK
    varchar120 name
    int base_crystals
    enum status
  }

  DAILY_QUESTS {
    char36 id PK
    char36 child_id FK
    char36 quest_definition_id FK
    char36 assigned_by FK
    date target_date
    enum status
  }

  CRYSTAL_LEDGER {
    char36 id PK
    char36 user_id FK
    int amount
    enum type
    char36 source_id
  }

  REWARDS {
    char36 id PK
    char36 family_id FK
    varchar50 name
    int price
    enum status
  }

  REWARD_CHILD_ASSIGNMENTS {
    char36 id PK
    char36 reward_id FK
    char36 child_id FK
    int quantity
  }

  CHILD_BACKPACK_ITEMS {
    char36 id PK
    char36 child_id FK
    char36 reward_id FK
    int quantity
  }

  WISHES {
    char36 id PK
    char36 child_id FK
    char36 family_id FK
    char36 reward_id FK
    char1 slot_code
    enum status
  }

  CHILD_SPIRIT_TREE {
    char36 child_id PK,FK
    char36 family_id FK
    enum state
    tinyint completion_rate
  }

  CHILD_SPIRIT_TREE_DAILY {
    bigint id PK
    char36 child_id FK
    char36 family_id FK
    date snapshot_date
    enum state
    tinyint completion_rate
  }

  MAILBOX_MESSAGES {
    char36 id PK
    char36 user_id FK
    enum type
    varchar80 title
    tinyint is_read
  }

  USER_LOGIN_EVENTS {
    char36 id PK
    char36 user_id FK
    char36 family_id FK
    datetime login_at
  }

  SYSTEM_ADMINS {
    char36 id PK
    varchar100 username UK
    enum status
  }

  FAMILIES ||--o{ USERS : owns
  FAMILIES ||--o{ QUEST_DEFINITIONS : defines
  FAMILIES ||--o{ REWARDS : owns
  FAMILIES ||--o{ WISHES : scopes
  FAMILIES ||--o{ CHILD_SPIRIT_TREE : scopes
  FAMILIES ||--o{ CHILD_SPIRIT_TREE_DAILY : snapshots
  FAMILIES ||--o{ USER_LOGIN_EVENTS : logs

  USERS ||--o{ DAILY_QUESTS : assigned_child
  USERS ||--o{ DAILY_QUESTS : assigned_by
  QUEST_DEFINITIONS ||--o{ DAILY_QUESTS : template

  USERS ||--o{ CRYSTAL_LEDGER : ledger
  USERS ||--o{ MAILBOX_MESSAGES : mailbox
  USERS ||--o{ USER_LOGIN_EVENTS : login_events

  REWARDS ||--o{ REWARD_CHILD_ASSIGNMENTS : assigned
  USERS ||--o{ REWARD_CHILD_ASSIGNMENTS : child_access

  REWARDS ||--o{ CHILD_BACKPACK_ITEMS : inventory_item
  USERS ||--o{ CHILD_BACKPACK_ITEMS : backpack_owner

  REWARDS ||--o{ WISHES : wish_item
  USERS ||--o{ WISHES : child_wishes

  USERS ||--|| CHILD_SPIRIT_TREE : current_tree
  USERS ||--o{ CHILD_SPIRIT_TREE_DAILY : tree_history
```

## Notes
- `families` is the top-level ownership boundary for most business tables.
- `users`, `quest_definitions`, and `rewards` form the main operational base of the family workflow.
- `daily_quests`, `crystal_ledger`, `child_backpack_items`, `wishes`, and `child_spirit_tree` form the core child-facing interaction chain.
- `system_admins` is intentionally separate from the family-scoped application model.
