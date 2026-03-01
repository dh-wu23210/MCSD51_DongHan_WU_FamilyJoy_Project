# Sprint 2 TDD - Family Member Disable/Delete

## 1. Overview & Scope
Implements delayed delete (disable) and restore for family members.

## 2. Architecture (Mermaid)
```mermaid
flowchart LR
  HomeController --> FamilyService
  FamilyService --> UserRepo
  HomeController --> ViewModels
```

## 3. Module Responsibilities
- HomeController: disable/restore actions.
- FamilyService: update status and countdown.
- MaintenanceService: cleanup expired disabled users.

## 4. Data Model / ERD (Mermaid)
```mermaid
erDiagram
  users {
    char(36) id PK
    enum status
    datetime disabled_at
    datetime delete_after
  }
```

## 5. API / Route Contracts
- POST /family/disable-member
- POST /family/restore-member

## 6. Validation Rules
- memberId required.

## 7. State Machine (Mermaid)
```mermaid
stateDiagram-v2
  active --> disabled
  disabled --> active: restore
  disabled --> deleted: cleanup
```

## 8. Sequence Flow (Mermaid)
```mermaid
sequenceDiagram
  participant A as Admin
  participant C as HomeController
  participant S as FamilyService
  participant R as UserRepo
  A->>C: POST /family/disable-member
  C->>S: disableMember
  S->>R: update status
  R-->>S: ok
  S-->>C: ok
  C-->>A: redirect
```

## 9. Error Handling
- Missing memberId -> redirect with error.

## 10. Security & Access Control
- Admin-only.

## 11. Operational Notes
- Cleanup job runs hourly.

## 12. Out of Scope
- Hard delete UI.

## 13. Open Questions
- None.
