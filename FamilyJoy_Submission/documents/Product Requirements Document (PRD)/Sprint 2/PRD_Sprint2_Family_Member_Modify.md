# Sprint 2 PRD - Family Member Disable and Delete

## 1. Background / Problem
Admins need to disable a family member with a delayed delete window for safety.

## 2. Goals & Non‑Goals
**Goals**
- Disable member with 7-day countdown.
- Restore within countdown.

**Non‑Goals**
- Immediate hard delete.

## 3. Personas & Roles
- Parent admin

## 4. User Stories / Jobs
- As an admin, I can disable and restore members.

## 5. User Flow (Mermaid)

```mermaid
flowchart TD
  A[Family Members] --> B["Delete (Disable)"]
  B --> C[Countdown Visible]
  C --> D[Restore]
  C --> E[Auto-delete after 3 days]
```

## 6. UI / Pages Map (Mermaid)
```mermaid
flowchart LR
  FamilyMembers --> Disable
  FamilyMembers --> Restore
```

## 7. Functional Requirements
- Countdown text shown when disabled.
- Do not show "disabled" badge during countdown.

## 8. Business Rules & Constraints
- Only admin can disable/restore.

## 9. Edge Cases / Errors
- Missing member ID.

## 10. Metrics / Success Criteria
- Restore success rate.

## 11. Out of Scope
- Recovery after deletion.

## 12. Open Questions
- None.
