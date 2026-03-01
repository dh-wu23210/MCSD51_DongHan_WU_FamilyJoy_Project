# Sprint 2 TDD - Daily Quest Assignment Design

## 1. Overview & Scope
Parents assign quest definitions to a child for Today or Tomorrow.

## 2. Architecture (Mermaid)
```mermaid
flowchart LR
  QuestController --> QuestService
  QuestService --> QuestRepo
  QuestController --> QuestViewModel
```

## 3. Module Responsibilities
- QuestController: render assign page, handle add/remove.
- QuestService: apply rules, query tasks.

## 4. Data Model / ERD (Mermaid)
```mermaid
erDiagram
  daily_quests {
    char(36) id PK
    char(36) child_id FK
    char(36) quest_definition_id FK
    date target_date
    enum status
  }
  quest_definitions {
    char(36) id PK
    varchar name
  }
  users {
    char(36) id PK
  }
  quest_definitions ||--o{ daily_quests : assigned
  users ||--o{ daily_quests : child
```

## 5. API / Route Contracts
- GET /quest/assign/:childId
- POST /quest/assign/:childId/add
- POST /quest/assign/:childId/remove

## 6. Validation Rules
- questDefinitionId required.
- day in {today, tomorrow}.

## 7. State Machine
- See TD-200.

## 8. Sequence Flow (Mermaid)
```mermaid
sequenceDiagram
  participant P as Parent
  participant C as QuestController
  participant S as QuestService
  participant R as QuestRepo
  P->>C: POST /quest/assign/:childId/add
  C->>S: assignQuest
  S->>R: insert daily_quest
  R-->>S: ok
  S-->>C: ok
  C-->>P: redirect
```

## 9. Error Handling
- Duplicate assignment -> redirect with error.

## 10. Security & Access Control
- Parent-only.

## 11. Operational Notes
- Day is derived by server and active tab.

## 12. Out of Scope
- Multi-day scheduling.

## 13. Open Questions
- None.
