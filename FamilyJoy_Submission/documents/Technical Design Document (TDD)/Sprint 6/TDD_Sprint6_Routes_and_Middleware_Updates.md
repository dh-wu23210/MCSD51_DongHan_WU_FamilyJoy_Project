# Sprint 6 TDD - Routes and Middleware Updates

## 1. Routes
New route introduced in Sprint 6 UI alignment scope:
- `GET /backpack`
  - Child-only standalone backpack page.
  - Served by `dashboardController.getChildBackpack`.
- `POST /quest/book/delete/:id`
  - Parent-only quest definition delete action.
  - Implemented as archive (`status = 'archived'`) via `questController.postDeleteQuest`.

Updated behavior on existing routes:
- `POST /login`
  - Session regeneration before writing authenticated session state.
- `POST /register-family`
  - Session regeneration before writing authenticated session state.
- `POST /shop/reward/assign`
  - Family-scope validation for `rewardId` and `childId` before assignment.
- `GET /wishes/child/:childId`
  - Family-scope validation for `childId` before reading wishes.
- `POST /quest/review/confirm/:id`
  - Conditional status update (`submitted` -> `complete|incomplete`) to enforce idempotency.
- `GET /quest?childId=<id>&tab=<day>`
  - Assign modal day context synchronized with selected tab.
  - Assign options are day-aware and exclude already-assigned quest definitions.
- `POST /quest/book/edit/:id`
  - Base crystals validation aligned to `1..100`.
- `POST /quest/book/create`
  - Base crystals validation aligned to `1..100`.

## 2. Middleware and Authorization Pattern
- Existing middleware stack remains:
  - `requireAuth`
  - `requirePasswordChange`
  - `requireRole(...)`
- Sprint 6 introduces service-level authorization guard reuse:
  - `assertChildInFamily(...)`
  - `assertActiveChildInFamily(...)`
  - `assertRewardInFamily(...)`
  - `assertActiveQuestDefinitionInFamily(...)`
- Child backpack route reuses existing middleware chain:
  - `requireAuth`
  - `requirePasswordChange`
  - `requireRole(['child'])`

## 3. Error Behavior
- Forbidden cross-family access is rejected consistently.
- Invalid entity references return controlled user-facing errors.
- Existing redirect/json patterns are preserved.
- For quest assignment UI, unavailable/duplicate options are prevented client-side by filtered option generation and still validated server-side.
- Confirmation workflow preserves submitter context (`requestSubmit(submitter)`), ensuring buttons with `formaction` (e.g., delete in edit modal) reach intended routes.
