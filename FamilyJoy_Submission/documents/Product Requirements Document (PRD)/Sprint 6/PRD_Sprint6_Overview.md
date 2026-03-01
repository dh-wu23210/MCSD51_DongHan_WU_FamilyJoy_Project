# Sprint 6 PRD - Overview

## 1. Scope
Sprint 6 formalizes as-built hardening and planning documentation after Sprint 5 feature delivery.

Included
- Family-scope authorization guard applied to child/reward/quest references.
- Session fixation hardening for login and register-family auto-login.
- Quest review idempotency to prevent duplicate rewards in concurrent actions.
- Sprint planning/user stories/specs synchronization for Sprint 6-8.
- Mobile-app shell alignment for child/parent navigated pages (`app-header` / `app-content` / `app-footer`).
- Child Backpack standalone page and navigation entry (`/backpack`) while keeping Spirit Tree backpack flow.
- Quest assign modal usability improvement (day-first, category-filtered quest list, exclusion of already-assigned quests).
- Quest assignment modal interaction modernization (no native dropdown overlays; category button grid + selectable quest list).
- Quest Book maintenance improvement: Edit Quest modal supports delete (archive) action.
- Bottom navigation equal-width behavior regardless item count/label length.

Deferred
- API contract standardization (E4-US28).

## 2. Goals
- Reduce cross-family access risk.
- Reduce duplicate reward risk in review flow.
- Keep current UX behavior unchanged while hardening backend behavior.
- Ensure planning artifacts match delivered code and future sprint sequencing.
- Improve parent assignment and quest-book operation speed on mobile while keeping backend safety constraints.

## 3. Non-Goals
- New gameplay/economy modules beyond current quest/shop/wish/backpack scope.
- New economy mechanics (essence/health/decay).
- Ops/Admin runtime feature delivery.

## 4. Notes
- Sprint 6 is an alignment and hardening sprint, not a UI expansion sprint.
- API contract normalization is tracked separately and discussed later.
- UI changes in this sprint are scope-contained alignment updates to improve mobile consistency and task efficiency, not new economy or gameplay mechanics.
- Quest definition delete in Sprint 6 is implemented as archive (soft delete) using existing status model.
