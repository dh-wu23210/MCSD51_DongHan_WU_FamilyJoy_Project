# Sprint 6 PRD - Security and Documentation Alignment

## 1. Background
Sprint 5 delivered the wish loop, while several hardening/documentation items remained outside user-visible feature scope.

## 2. User-Visible Impact
- No new pages are introduced.
- Existing flows continue to work with stricter backend validation.

## 3. Functional Requirements
### 3.1 Family Scope Enforcement
- Parent actions that reference `childId`, `rewardId`, or `questDefinitionId` must be constrained to the same family.
- Cross-family references must be rejected.

### 3.2 Session Hardening
- On successful login, authenticated state must be written only after session ID regeneration.
- On successful register-family auto-login, authenticated state must be written only after session ID regeneration.

### 3.3 Quest Review Safety
- Parent review action can update only `submitted` tasks.
- Duplicate review attempts must not issue duplicate crystals.

### 3.4 Documentation Governance
- Sprint 6 stories must be reflected in Planning CSV, UserStories, and Specs.
- Sprint 7/8 backlogs must be explicitly listed in planning artifacts.

### 3.5 UI Shell and Navigation Consistency
- Navigated pages must follow fixed three-section structure: `app-header`, `app-content`, `app-footer`.
- Page-level scrolling is disabled in shell; only module-level scrolling is allowed where explicitly required.
- Bottom navigation items must use equal-width distribution regardless item count and label text length.

### 3.6 Child Backpack Experience
- Child role has a dedicated Backpack page entry in bottom navigation (`/backpack`, after `Shop`).
- Spirit Tree keeps existing backpack functionality; standalone Backpack page is additive.
- Backpack page contains a fixed item detail panel and a separately scrollable backpack grid region.

### 3.7 Quest Assign Modal Efficiency
- Add Quest modal shows Day first, then Category, then Quest.
- Category selection uses button grid; Quest selection uses in-modal selectable list.
- Category grid always shows the full predefined category set.
- Quest list is filtered by selected category.
- Already-assigned quests for selected child + selected day must be excluded from selectable options.
- Modal height is fixed; Quest list region is scrollable.
- Quest definition base crystals in create/edit flows must be integer range `1..100`.

### 3.8 Quest Book Definition Maintenance
- Edit Quest modal includes delete capability for quest definitions.
- Delete operation archives definition instead of physical deletion.
- Archived definitions are excluded from Quest Book and Add Quest selectable options.

### 3.9 Category Definition Governance
- Quest categories must be defined in one shared constants module.
- Validator, service, and view-model must consume the same category source.

## 4. Acceptance Criteria
- Family-scope checks are centralized and reused.
- Login and register-family flows regenerate session before setting user session.
- Quest review is idempotent in concurrent review attempts.
- Planning/UserStories/Specs remain cross-referenced and consistent.
- Child can enter standalone Backpack page from bottom navigation and still use Spirit Tree backpack flow.
- Add Quest modal prevents duplicate assignment choices by excluding already-assigned quest definitions for active day.
- Quest Book delete action archives definitions and removes them from active displays.
- Quest categories remain consistent across validation, assignment model, and UI generation from one source.
- Bottom navigation widths remain equal under different role-specific item counts.

## 5. Out of Scope
- API payload and response envelope normalization.
- Client visual redesign.
