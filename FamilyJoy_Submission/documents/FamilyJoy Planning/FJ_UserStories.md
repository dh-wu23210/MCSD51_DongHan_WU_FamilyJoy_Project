# FamilyJoy Project - User Stories (Single Source of Truth)
This file contains **all Epics and User Stories**. Detailed rules, lifecycle notes, and constraints are consolidated in **Specs.md** and referenced from each story.

## Traceability Notes
- `FJ_JiraImport_MVP_Sprint.csv` is the sprint planning source for each `US Key`.
- This file is the story source for each `US Key` and must keep the same key list as the CSV.
- `FJ_Specs.md` provides the matching spec anchor for each story key (for example `E6-US10 -> #e6-us10`).
- Code evidence and sprint-commit index are maintained in `FJ_Specs.md` under **Traceability Bridge**.

## E1 - Login
**Status:** Final
**Description:** Allow all family members to securely access the system.

<a id="e1-us01"></a>
### E1-US01 - User can login
**User Story:** As a Parent, I want to login, so that I can complete the Family Accounts (E2) workflow.
**Description:** This story defines the expected behavior for `User can login` in the current product flow.

**Actor(s):** Parent / Child
**Dependency / Source:** Family Accounts (E2)
**Acceptance Criteria (minimal):**
- [ ] Login with username + password
**Suggested Sub-tasks:**
- Login page and session creation
**Spec:** [Specs for E1-US01](FJ_Specs.md#e1-us01)

<a id="e1-us02"></a>
### E1-US02 - User can use remember-me
**User Story:** As a Parent, I want to use remember-me, so that I can complete the Login (E1-US01) workflow.
**Description:** This story defines the expected behavior for `User can use remember-me` in the current product flow.

**Actor(s):** Parent / Child
**Dependency / Source:** Login (E1-US01)
**Acceptance Criteria (minimal):**
- [ ] Remember-me keeps session across browser restarts
**Suggested Sub-tasks:**
- Remember-me token
**Spec:** [Specs for E1-US02](FJ_Specs.md#e1-us02)

<a id="e1-us03"></a>
### E1-US03 - User can logout
**User Story:** As a Parent, I want to logout, so that I can complete the Active session workflow.
**Description:** This story defines the expected behavior for `User can logout` in the current product flow.

**Actor(s):** Parent / Child
**Dependency / Source:** Active session
**Acceptance Criteria (minimal):**
- [ ] Logout ends session
**Suggested Sub-tasks:**
- Logout route
**Spec:** [Specs for E1-US03](FJ_Specs.md#e1-us03)

## E2 - Family Management
**Status:** Final
**Description:** Family is the root entity. Family Admin manages internal member accounts and permissions.

<a id="e2-us01"></a>
### E2-US01 - Create family

**User Story:** As a System, I want to create family, so that I can complete the Onboarding workflow.
**Description:** This story defines the expected behavior for `Create family` in the current product flow.

**Actor(s):** System

**Dependency / Source:** Onboarding

**Acceptance Criteria (minimal):**

- [ ] Create Family (family name + 4-letter family code)

**Suggested Sub-tasks:**

- Create Family (name + 4-letter family code)

**Spec:** [Specs for E2-US01](FJ_Specs.md#e2-us01)

<a id="e2-us02"></a>
### E2-US02 - Edit family name
**User Story:** As a Family Admin, I want to edit family name, so that I can complete the Family entity workflow.
**Description:** This story defines the expected behavior for `Edit family name` in the current product flow.

**Actor(s):** Family Admin
**Dependency / Source:** Family entity
**Acceptance Criteria (minimal):**
- [ ] Edit Family Name (post-create)
**Suggested Sub-tasks:**
- Edit Family Name (post-create)
**Spec:** [Specs for E2-US02](FJ_Specs.md#e2-us02)

<a id="e2-us03"></a>
### E2-US03 - Create parent account
**User Story:** As a Family Admin, I want to create parent account, so that I can complete the Family Admin workflow.
**Description:** This story defines the expected behavior for `Create parent account` in the current product flow.

**Actor(s):** Family Admin
**Dependency / Source:** Family Admin
**Acceptance Criteria (minimal):**
- [ ] Create Parent Account
**Suggested Sub-tasks:**
- Create Parent Account
**Spec:** [Specs for E2-US03](FJ_Specs.md#e2-us03)

<a id="e2-us04"></a>
### E2-US04 - Create child account
**User Story:** As a Family Admin, I want to create child account, so that I can complete the Family Admin workflow.
**Description:** This story defines the expected behavior for `Create child account` in the current product flow.

**Actor(s):** Family Admin
**Dependency / Source:** Family Admin
**Acceptance Criteria (minimal):**
- [ ] Create Child Account
**Suggested Sub-tasks:**
- Create Child Account
**Spec:** [Specs for E2-US04](FJ_Specs.md#e2-us04)

<a id="e2-us06"></a>
### E2-US06 - Disable a member account
**User Story:** As a Family Admin, I want to disable a member account, so that I can complete the Member Management workflow.
**Description:** This story defines the expected behavior for `Disable a member account` in the current product flow.

**Actor(s):** Family Admin
**Dependency / Source:** Member Management
**Acceptance Criteria (minimal):**
- [ ] Disable Member Account
**Suggested Sub-tasks:**
- Disable member action
**Spec:** [Specs for E2-US06](FJ_Specs.md#e2-us06)

<a id="e2-us07"></a>
### E2-US07 - Show delete countdown for disabled member
**User Story:** As a Family Admin, I want to show delete countdown for disabled member, so that I can complete the Member Management workflow.
**Description:** This story defines the expected behavior for `Show delete countdown for disabled member` in the current product flow.

**Actor(s):** Family Admin
**Dependency / Source:** Member Management
**Acceptance Criteria (minimal):**
- [ ] Show 7-day delete countdown for disabled member
**Suggested Sub-tasks:**
- Countdown status in member list
**Spec:** [Specs for E2-US07](FJ_Specs.md#e2-us07)

<a id="e2-us08"></a>
### E2-US08 - Restore member during countdown
**User Story:** As a Family Admin, I want to restore member during countdown, so that I can complete the Member Management workflow.
**Description:** This story defines the expected behavior for `Restore member during countdown` in the current product flow.

**Actor(s):** Family Admin
**Dependency / Source:** Member Management
**Acceptance Criteria (minimal):**
- [ ] Restore member during countdown window
**Suggested Sub-tasks:**
- Restore member action
**Spec:** [Specs for E2-US08](FJ_Specs.md#e2-us08)

<a id="e2-us09"></a>
### E2-US09 - Reset member password to default
**User Story:** As a Family Admin, I want to reset member password to default, so that I can complete the Member Management workflow.
**Description:** This story defines the expected behavior for `Reset member password to default` in the current product flow.

**Actor(s):** Family Admin
**Dependency / Source:** Member Management
**Acceptance Criteria (minimal):**
- [ ] Reset member password to default (family code)
**Suggested Sub-tasks:**
- Reset member password
**Spec:** [Specs for E2-US09](FJ_Specs.md#e2-us09)

<a id="e2-us11"></a>
### E2-US11 - View family members list

**User Story:** As a Family Admin, I want to view family members list, so that I can complete the Member Management workflow.
**Description:** This story defines the expected behavior for `View family members list` in the current product flow.

**Actor(s):** Family Admin

**Dependency / Source:** Member Management

**Acceptance Criteria (minimal):**

- [ ] View family members list

**Suggested Sub-tasks:**

- Render member list

**Spec:** [Specs for E2-US11](FJ_Specs.md#e2-us11)

<a id="e2-us12"></a>
### E2-US12 - View member login credential status
**User Story:** As a Family Admin, I want to view member login credential status, so that I can complete the Member Management workflow.
**Description:** This story defines the expected behavior for `View member login credential status` in the current product flow.

**Actor(s):** Family Admin
**Dependency / Source:** Member Management
**Acceptance Criteria (minimal):**
- [ ] See login credential status (default password, masked, or reset action)
**Suggested Sub-tasks:**
- Render login credential cell
**Spec:** [Specs for E2-US12](FJ_Specs.md#e2-us12)

<a id="e2-us15"></a>
### E2-US15 - Standardize mobile app shell and navigation
**User Story:** As a Parent, I want to standardize mobile app shell and bottom navigation behavior, so that I can complete the Shared navigation framework (E2, E3, E4) workflow.
**Description:** This story defines the expected behavior for `Standardize mobile app shell and navigation` in the current product flow.

**Actor(s):** Parent / Child
**Dependency / Source:** Shared navigation framework (E2, E3, E4)
**Acceptance Criteria (minimal):**
- [ ] Navigated pages use consistent `app-header`, `app-content`, `app-footer` shell.
- [ ] Page-level scrolling is disabled; only designated modules scroll.
- [ ] Bottom navigation items render with equal width regardless item count or label length.
**Suggested Sub-tasks:**
- Shell/layout CSS split and normalization
- Bottom navigation width strategy update
**Spec:** [Specs for E2-US15](FJ_Specs.md#e2-us15)

<a id="e2-us16"></a>
### E2-US16 - Generate Family Admin

**User Story:** As a System, I want to generate Family Admin, so that I can complete the Onboarding workflow.
**Description:** This story defines the expected behavior for `Generate Family Admin` in the current product flow.

**Actor(s):** System

**Dependency / Source:** Onboarding

**Acceptance Criteria (minimal):**

- [ ] Generate Family Admin account after family creation

**Suggested Sub-tasks:**

- Generate Family Admin

**Spec:** [Specs for E2-US16](FJ_Specs.md#e2-us16)

<a id="e2-us17"></a>
### E2-US17 - View member role and status

**User Story:** As a Family Admin, I want to view member role and status, so that I can complete the Member Management workflow.
**Description:** This story defines the expected behavior for `View member role and status` in the current product flow.

**Actor(s):** Family Admin

**Dependency / Source:** Member Management

**Acceptance Criteria (minimal):**

- [ ] View role and status for each member

**Suggested Sub-tasks:**

- Render role/status columns

**Spec:** [Specs for E2-US17](FJ_Specs.md#e2-us17)

## E3 - Quest Lifecycle
**Status:** Final
**Description:** Create quests, assign daily lists, child submits completion, parent confirms complete/incomplete.

<a id="e3-us01"></a>
### E3-US01 - Create quest definition name

**User Story:** As a Parent, I want to create quest definition name, so that I can complete the Quest Book workflow.
**Description:** This story defines the expected behavior for `Create quest definition name` in the current product flow.

**Actor(s):** Parent

**Dependency / Source:** Quest Book

**Acceptance Criteria (minimal):**

- [ ] Set quest name

**Suggested Sub-tasks:**

- Quest name input

**Spec:** [Specs for E3-US01](FJ_Specs.md#e3-us01)

<a id="e3-us02"></a>
### E3-US02 - Edit quest definition
**User Story:** As a Parent, I want to edit quest definition, so that I can complete the Quest Book workflow.
**Description:** This story defines the expected behavior for `Edit quest definition` in the current product flow.

**Actor(s):** Parent
**Dependency / Source:** Quest Book
**Acceptance Criteria (minimal):**
- [ ] Edit quest name/description/category
**Suggested Sub-tasks:**
- Edit quest definition
**Spec:** [Specs for E3-US02](FJ_Specs.md#e3-us02)

<a id="e3-us03"></a>
### E3-US03 - Archive quest definition
**User Story:** As a Parent, I want to archive quest definition, so that I can complete the Quest Book workflow.
**Description:** This story defines the expected behavior for `Archive quest definition` in the current product flow.

**Actor(s):** Parent
**Dependency / Source:** Quest Book
**Acceptance Criteria (minimal):**
- [ ] Archive quest definition
**Suggested Sub-tasks:**
- Archive quest definition
**Spec:** [Specs for E3-US03](FJ_Specs.md#e3-us03)

<a id="e3-us04"></a>
### E3-US04 - Assign quests for today
**User Story:** As a Parent, I want to assign quests for today, so that I can complete the Quest Book workflow.
**Description:** This story defines the expected behavior for `Assign quests for today` in the current product flow.

**Actor(s):** Parent
**Dependency / Source:** Quest Book
**Acceptance Criteria (minimal):**
- [ ] Assign quests to Today list
**Suggested Sub-tasks:**
- Assign Today
**Spec:** [Specs for E3-US04](FJ_Specs.md#e3-us04)

<a id="e3-us05"></a>
### E3-US05 - Assign quests for tomorrow
**User Story:** As a Parent, I want to assign quests for tomorrow, so that I can complete the Quest Book workflow.
**Description:** This story defines the expected behavior for `Assign quests for tomorrow` in the current product flow.

**Actor(s):** Parent
**Dependency / Source:** Quest Book
**Acceptance Criteria (minimal):**
- [ ] Assign quests to Tomorrow list
**Suggested Sub-tasks:**
- Assign Tomorrow
**Spec:** [Specs for E3-US05](FJ_Specs.md#e3-us05)

<a id="e3-us06"></a>
### E3-US06 - Remove assigned quest
**User Story:** As a Parent, I want to remove assigned quest, so that I can complete the Daily Quest List workflow.
**Description:** This story defines the expected behavior for `Remove assigned quest` in the current product flow.

**Actor(s):** Parent
**Dependency / Source:** Daily Quest List
**Acceptance Criteria (minimal):**
- [ ] Remove assigned quest from Today/Tomorrow
**Suggested Sub-tasks:**
- Remove assigned quest
**Spec:** [Specs for E3-US06](FJ_Specs.md#e3-us06)

<a id="e3-us07"></a>
### E3-US07 - Child views today quests
**User Story:** As a Child, I want to views today quests, so that I can complete the Daily Quest List workflow.
**Description:** This story defines the expected behavior for `Child views today quests` in the current product flow.

**Actor(s):** Child
**Dependency / Source:** Daily Quest List
**Acceptance Criteria (minimal):**
- [ ] View Today Quests
**Suggested Sub-tasks:**
- Today list view
**Spec:** [Specs for E3-US07](FJ_Specs.md#e3-us07)

<a id="e3-us08"></a>
### E3-US08 - Child views tomorrow quests
**User Story:** As a Child, I want to views tomorrow quests, so that I can complete the Daily Quest List workflow.
**Description:** This story defines the expected behavior for `Child views tomorrow quests` in the current product flow.

**Actor(s):** Child
**Dependency / Source:** Daily Quest List
**Acceptance Criteria (minimal):**
- [ ] View Tomorrow Quests (read-only)
**Suggested Sub-tasks:**
- Tomorrow list view
**Spec:** [Specs for E3-US08](FJ_Specs.md#e3-us08)

<a id="e3-us09"></a>
### E3-US09 - Child submits completion request (today only)
**User Story:** As a Child, I want to submits completion request (today only), so that I can complete the Today Quest List workflow.
**Description:** This story defines the expected behavior for `Child submits completion request (today only)` in the current product flow.

**Actor(s):** Child
**Dependency / Source:** Today Quest List
**Acceptance Criteria (minimal):**
- [ ] Submit completion request for Today
**Suggested Sub-tasks:**
- Submit completion request
**Spec:** [Specs for E3-US09](FJ_Specs.md#e3-us09)

<a id="e3-us10"></a>
### E3-US10 - Child views quest detail
**User Story:** As a Child, I want to views quest detail, so that I can complete the Quest Detail workflow.
**Description:** This story defines the expected behavior for `Child views quest detail` in the current product flow.

**Actor(s):** Child
**Dependency / Source:** Quest Detail
**Acceptance Criteria (minimal):**
- [ ] View quest detail page
**Suggested Sub-tasks:**
- Quest detail page
**Spec:** [Specs for E3-US10](FJ_Specs.md#e3-us10)

<a id="e3-us11"></a>
### E3-US11 - Child submits from quest detail
**User Story:** As a Child, I want to submits from quest detail, so that I can complete the Quest Detail workflow.
**Description:** This story defines the expected behavior for `Child submits from quest detail` in the current product flow.

**Actor(s):** Child
**Dependency / Source:** Quest Detail
**Acceptance Criteria (minimal):**
- [ ] Submit if eligible from detail view
**Suggested Sub-tasks:**
- Submit from detail view
**Spec:** [Specs for E3-US11](FJ_Specs.md#e3-us11)

<a id="e3-us12"></a>
### E3-US12 - Parent marks quest complete
**User Story:** As a Parent, I want to marks quest complete, so that I can complete the Completion Requests workflow.
**Description:** This story defines the expected behavior for `Parent marks quest complete` in the current product flow.

**Actor(s):** Parent
**Dependency / Source:** Completion Requests
**Acceptance Criteria (minimal):**
- [ ] Mark completion as Complete
**Suggested Sub-tasks:**
- Mark complete
**Spec:** [Specs for E3-US12](FJ_Specs.md#e3-us12)

<a id="e3-us13"></a>
### E3-US13 - Parent marks quest incomplete
**User Story:** As a Parent, I want to marks quest incomplete, so that I can complete the Completion Requests workflow.
**Description:** This story defines the expected behavior for `Parent marks quest incomplete` in the current product flow.

**Actor(s):** Parent
**Dependency / Source:** Completion Requests
**Acceptance Criteria (minimal):**
- [ ] Mark completion as Incomplete
**Suggested Sub-tasks:**
- Mark incomplete
**Spec:** [Specs for E3-US13](FJ_Specs.md#e3-us13)

<a id="e3-us18"></a>
### E3-US18 - View daily history calendar
**User Story:** As a Parent, I want to view daily history calendar, so that I can complete the Daily quest history workflow.
**Description:** This story defines the expected behavior for `View daily history calendar` in the current product flow.

**Actor(s):** Parent / Child
**Dependency / Source:** Daily quest history
**Acceptance Criteria (minimal):**
- [ ] View daily quest history in calendar format
**Suggested Sub-tasks:**
- Calendar page and monthly navigation
**Spec:** [Specs for E3-US18](FJ_Specs.md#e3-us18)

<a id="e3-us19"></a>
### E3-US19 - Prevent duplicate reward on concurrent quest review
**User Story:** As a Parent, I want to prevent duplicate reward on concurrent quest review, so that I can complete the Quest Review (E3-US12, E3-US13) workflow.
**Description:** This story defines the expected behavior for `Prevent duplicate reward on concurrent quest review` in the current product flow.

**Actor(s):** Parent / System
**Dependency / Source:** Quest Review (E3-US12, E3-US13)
**Acceptance Criteria (minimal):**
- [ ] Quest review updates only when current status is `submitted`
- [ ] Duplicate review attempts do not issue duplicate crystal rewards
**Suggested Sub-tasks:**
- Conditional status update in repository
- Idempotent review flow in service
**Spec:** [Specs for E3-US19](FJ_Specs.md#e3-us19)

<a id="e3-us20"></a>
### E3-US20 - Optimize quest assignment with day/category filters
**User Story:** As a Parent, I want to improve parent quest assignment efficiency with day/category filtering, so that I can complete the Quest assignment flow (E3-US04, E3-US05) workflow.
**Description:** This story defines the expected behavior for `Optimize quest assignment with day/category filters` in the current product flow.

**Actor(s):** Parent
**Dependency / Source:** Quest assignment flow (E3-US04, E3-US05)
**Acceptance Criteria (minimal):**
- [ ] Add Quest modal shows Day first.
- [ ] Parent selects Category before selecting Quest.
- [ ] Quest dropdown excludes already-assigned quests for selected child and selected day.
**Suggested Sub-tasks:**
- Assign view-model day/category option mapping
- Client modal filtering + disabled submit state handling
**Spec:** [Specs for E3-US20](FJ_Specs.md#e3-us20)

<a id="e3-us21"></a>
### E3-US21 - Archive quest from Quest Book edit modal
**User Story:** As a Parent, I want to support quest definition delete (archive) from Quest Book edit modal, so that I can complete the Quest Book management (E3-US03, E3-US20) workflow.
**Description:** This story defines the expected behavior for `Archive quest from Quest Book edit modal` in the current product flow.

**Actor(s):** Parent
**Dependency / Source:** Quest Book management (E3-US03, E3-US20)
**Acceptance Criteria (minimal):**
- [ ] Edit Quest modal includes a Delete action with confirmation.
- [ ] Delete archives the quest definition (soft delete), not physical removal.
- [ ] Archived definitions are excluded from Quest Book display and assignment options.
**Suggested Sub-tasks:**
- Add route/controller for quest delete.
- Reuse existing definition status field (`active`/`archived`) for soft delete.
- Ensure Quest Book query only returns active definitions.
**Spec:** [Specs for E3-US21](FJ_Specs.md#e3-us21)

<a id="e3-us22"></a>
### E3-US22 - Use category grid for quest assignment
**User Story:** As a Parent, I want to replace native quest assignment dropdowns with category grid + quest list, so that I can complete the Quest assignment UX optimization (E3-US20) workflow.
**Description:** This story defines the expected behavior for `Use category grid for quest assignment` in the current product flow.

**Actor(s):** Parent
**Dependency / Source:** Quest assignment UX optimization (E3-US20)
**Acceptance Criteria (minimal):**
- [ ] Add Quest modal no longer uses native select dropdowns for Category and Quest.
- [ ] Category is shown as equal-width button grid.
- [ ] Quest appears as selectable list with placeholder state when category is not selected.
- [ ] Quest list is scrollable in fixed-height modal area.
**Suggested Sub-tasks:**
- Update assign modal markup and client state handling.
- Keep server-side assign validation unchanged.
- Preserve day-aware and duplicate-exclusion filtering.
**Spec:** [Specs for E3-US22](FJ_Specs.md#e3-us22)

<a id="e3-us23"></a>
### E3-US23 - Centralize quest category source of truth
**User Story:** As a Engineering, I want to use a single source of truth for quest categories across server modules, so that I can complete the Hardening and maintainability scope workflow.
**Description:** This story defines the expected behavior for `Centralize quest category source of truth` in the current product flow.

**Actor(s):** Engineering / System
**Dependency / Source:** Hardening and maintainability scope
**Acceptance Criteria (minimal):**
- [ ] Quest categories are defined in one shared constants module.
- [ ] Validator, service, and view-model consume the same category source.
- [ ] Category updates require a one-place change only.
**Suggested Sub-tasks:**
- Add quest category constants file.
- Refactor existing duplicated category arrays to use shared import.
**Spec:** [Specs for E3-US23](FJ_Specs.md#e3-us23)

<a id="e3-us24"></a>
### E3-US24 - Set quest category

**User Story:** As a Parent, I want to set quest category, so that I can complete the Quest Book workflow.
**Description:** This story defines the expected behavior for `Set quest category` in the current product flow.

**Actor(s):** Parent

**Dependency / Source:** Quest Book

**Acceptance Criteria (minimal):**

- [ ] Select quest category

**Suggested Sub-tasks:**

- Quest category selection

**Spec:** [Specs for E3-US24](FJ_Specs.md#e3-us24)

<a id="e3-us25"></a>
### E3-US25 - Set base crystals

**User Story:** As a Parent, I want to set base crystals, so that I can complete the Quest Book workflow.
**Description:** This story defines the expected behavior for `Set base crystals` in the current product flow.

**Actor(s):** Parent

**Dependency / Source:** Quest Book

**Acceptance Criteria (minimal):**

- [ ] Set base crystals

**Suggested Sub-tasks:**

- Base crystals input

**Spec:** [Specs for E3-US25](FJ_Specs.md#e3-us25)

## E4 - Reward Shop
**Status:** Final
**Description:** Manage reward catalog, pricing, visibility, and child shopping flow.

<a id="e4-us01"></a>
### E4-US01 - View crystals balance
**User Story:** As a All Roles, I want to view crystals balance, so that I can complete the Crystal Ledger workflow.
**Description:** This story defines the expected behavior for `View crystals balance` in the current product flow.

**Actor(s):** All Roles
**Dependency / Source:** Crystal Ledger
**Acceptance Criteria (minimal):**
- [ ] View Crystals Balance
**Suggested Sub-tasks:**
- Balance view
**Spec:** [Specs for E4-US01](FJ_Specs.md#e4-us01)

<a id="e4-us02"></a>
### E4-US02 - View crystals ledger
**User Story:** As a All Roles, I want to view crystals ledger, so that I can complete the Crystal Ledger workflow.
**Description:** This story defines the expected behavior for `View crystals ledger` in the current product flow.

**Actor(s):** All Roles
**Dependency / Source:** Crystal Ledger
**Acceptance Criteria (minimal):**
- [ ] View Crystals Ledger
**Suggested Sub-tasks:**
- Ledger view
**Spec:** [Specs for E4-US02](FJ_Specs.md#e4-us02)

<a id="e4-us03"></a>
### E4-US03 - Create reward in shop
**User Story:** As a Parent, I want to create reward in shop, so that I can complete the Reward Catalog workflow.
**Description:** This story defines the expected behavior for `Create reward in shop` in the current product flow.

**Actor(s):** Parent
**Dependency / Source:** Reward Catalog
**Acceptance Criteria (minimal):**
- [ ] Create Reward
**Suggested Sub-tasks:**
- Create reward
**Spec:** [Specs for E4-US03](FJ_Specs.md#e4-us03)

<a id="e4-us04"></a>
### E4-US04 - Set reward price
**User Story:** As a Parent, I want to set reward price, so that I can complete the Reward Catalog workflow.
**Description:** This story defines the expected behavior for `Set reward price` in the current product flow.

**Actor(s):** Parent
**Dependency / Source:** Reward Catalog
**Acceptance Criteria (minimal):**
- [ ] Set Reward Price
**Suggested Sub-tasks:**
- Price edit
**Spec:** [Specs for E4-US04](FJ_Specs.md#e4-us04)

<a id="e4-us05"></a>
### E4-US05 - Activate reward
**User Story:** As a Parent, I want to activate reward, so that I can complete the Reward Catalog workflow.
**Description:** This story defines the expected behavior for `Activate reward` in the current product flow.

**Actor(s):** Parent
**Dependency / Source:** Reward Catalog
**Acceptance Criteria (minimal):**
- [ ] Activate Reward
**Suggested Sub-tasks:**
- Activate reward
**Spec:** [Specs for E4-US05](FJ_Specs.md#e4-us05)

<a id="e4-us06"></a>
### E4-US06 - Deactivate reward
**User Story:** As a Parent, I want to deactivate reward, so that I can complete the Reward Catalog workflow.
**Description:** This story defines the expected behavior for `Deactivate reward` in the current product flow.

**Actor(s):** Parent
**Dependency / Source:** Reward Catalog
**Acceptance Criteria (minimal):**
- [ ] Deactivate Reward
**Suggested Sub-tasks:**
- Deactivate reward
**Spec:** [Specs for E4-US06](FJ_Specs.md#e4-us06)

<a id="e4-us07"></a>
### E4-US07 - Set visible children for reward
**User Story:** As a Parent, I want to set visible children for reward, so that I can complete the Reward Catalog workflow.
**Description:** This story defines the expected behavior for `Set visible children for reward` in the current product flow.

**Actor(s):** Parent
**Dependency / Source:** Reward Catalog
**Acceptance Criteria (minimal):**
- [ ] Set visible children
**Suggested Sub-tasks:**
- Reward visibility mapping
**Spec:** [Specs for E4-US07](FJ_Specs.md#e4-us07)

<a id="e4-us08"></a>
### E4-US08 - Browse reward shop
**User Story:** As a Child, I want to browse reward shop, so that I can complete the Reward Shop workflow.
**Description:** This story defines the expected behavior for `Browse reward shop` in the current product flow.

**Actor(s):** Child
**Dependency / Source:** Reward Shop
**Acceptance Criteria (minimal):**
- [ ] Browse Shop
**Suggested Sub-tasks:**
- Shop list view
**Spec:** [Specs for E4-US08](FJ_Specs.md#e4-us08)

<a id="e8-us01"></a>
## E8 - Backpack
**Status:** Final
**Description:** Manage owned items, stacking, and item-use actions from child inventory.

### E8-US01 - Purchase reward into backpack
**User Story:** As a Child, I want to purchase reward into backpack, so that I can complete the Reward Shop workflow.
**Description:** This story defines the expected behavior for `Purchase reward into backpack` in the current product flow.

**Actor(s):** Child
**Dependency / Source:** Reward Shop
**Acceptance Criteria (minimal):**
- [ ] Buy Reward into Backpack
**Suggested Sub-tasks:**
- Purchase flow
**Spec:** [Specs for E8-US01](FJ_Specs.md#e8-us01)

<a id="e4-us10"></a>
### E4-US10 - Buy essence token
**User Story:** As a Child, I want to buy essence token, so that I can complete the Shop + Backpack workflow.
**Description:** This story defines the expected behavior for `Buy essence token` in the current product flow.

**Actor(s):** Child
**Dependency / Source:** Shop + Backpack
**Acceptance Criteria (minimal):**
- [ ] Buy Essence Token (100 Crystals)
**Suggested Sub-tasks:**
- Essence token purchase
**Spec:** [Specs for E4-US10](FJ_Specs.md#e4-us10)

<a id="e8-us02"></a>
### E8-US02 - Use essence token
**User Story:** As a Child, I want to use essence token, so that I can complete the Backpack workflow.
**Description:** This story defines the expected behavior for `Use essence token` in the current product flow.

**Actor(s):** Child
**Dependency / Source:** Backpack
**Acceptance Criteria (minimal):**
- [ ] Use token (+20 Essence)
**Suggested Sub-tasks:**
- Token consumption
**Spec:** [Specs for E8-US02](FJ_Specs.md#e8-us02)

<a id="e9-us01"></a>
## E9 - Wish Tree Economy
**Status:** Final
**Description:** Run wish-slot lifecycle, Wish Tree health/essence mechanics, and parent resolution flow.

### E9-US01 - Spend essence for wish tree health
**User Story:** As a Child, I want to spend essence for wish tree health, so that I can complete the Wish Tree Health workflow.
**Description:** This story defines the expected behavior for `Spend essence for wish tree health` in the current product flow.

**Actor(s):** Child
**Dependency / Source:** Wish Tree Health
**Acceptance Criteria (minimal):**
- [ ] Spend Essence (+Health)
**Suggested Sub-tasks:**
- Health increase
**Spec:** [Specs for E9-US01](FJ_Specs.md#e9-us01)

<a id="e9-us02"></a>
### E9-US02 - View decay event log
**User Story:** As a Child, I want to view decay event log, so that I can complete the Wish Tree Health workflow.
**Description:** This story defines the expected behavior for `View decay event log` in the current product flow.

**Actor(s):** Child
**Dependency / Source:** Wish Tree Health
**Acceptance Criteria (minimal):**
- [ ] View today's decay log
**Suggested Sub-tasks:**
- Decay log UI
**Spec:** [Specs for E9-US02](FJ_Specs.md#e9-us02)

<a id="e9-us03"></a>
### E9-US03 - Place reward in wish slot
**User Story:** As a Child, I want to place reward in wish slot, so that I can complete the Backpack + Wish Tree workflow.
**Description:** This story defines the expected behavior for `Place reward in wish slot` in the current product flow.

**Actor(s):** Child
**Dependency / Source:** Backpack + Wish Tree
**Acceptance Criteria (minimal):**
- [ ] Place Reward in Slot
**Suggested Sub-tasks:**
- Slot placement
**Spec:** [Specs for E9-US03](FJ_Specs.md#e9-us03)

<a id="e9-us04"></a>
### E9-US04 - Submit wish request
**User Story:** As a Child, I want to submit wish request, so that I can complete the Wish Tree workflow.
**Description:** This story defines the expected behavior for `Submit wish request` in the current product flow.

**Actor(s):** Child
**Dependency / Source:** Wish Tree
**Acceptance Criteria (minimal):**
- [ ] Submit Wish Request (Pending Lock)
**Suggested Sub-tasks:**
- Wish submission
**Spec:** [Specs for E9-US04](FJ_Specs.md#e9-us04)

<a id="e9-us05"></a>
### E9-US05 - Fulfill wish request
**User Story:** As a Parent, I want to fulfill wish request, so that I can complete the Wish Request Queue workflow.
**Description:** This story defines the expected behavior for `Fulfill wish request` in the current product flow.

**Actor(s):** Parent
**Dependency / Source:** Wish Request Queue
**Acceptance Criteria (minimal):**
- [ ] Fulfill wish request
**Suggested Sub-tasks:**
- Fulfill action
**Spec:** [Specs for E9-US05](FJ_Specs.md#e9-us05)

<a id="e9-us06"></a>
### E9-US06 - Defer wish request
**User Story:** As a Parent, I want to defer wish request, so that I can complete the Wish Request Queue workflow.
**Description:** This story defines the expected behavior for `Defer wish request` in the current product flow.

**Actor(s):** Parent
**Dependency / Source:** Wish Request Queue
**Acceptance Criteria (minimal):**
- [ ] Defer wish request
**Suggested Sub-tasks:**
- Defer action
**Spec:** [Specs for E9-US06](FJ_Specs.md#e9-us06)

<a id="e8-us03"></a>
### E8-US03 - Child makes wish from backpack item
**User Story:** As a Child, I want to makes wish from backpack item, so that I can complete the Backpack workflow.
**Description:** This story defines the expected behavior for `Child makes wish from backpack item` in the current product flow.

**Actor(s):** Child
**Dependency / Source:** Backpack
**Acceptance Criteria (minimal):**
- [ ] Child can select a backpack item and click **Make Wish**
- [ ] Wish occupies the next available wish slot (A-F)
- [ ] Item quantity decreases immediately upon wishing
- [ ] If wish grid is full, the Make Wish button is hidden and a message is shown
**Suggested Sub-tasks:**
- Wish slot grid + wish creation flow
**Spec:** [Specs for E8-US03](FJ_Specs.md#e8-us03)

<a id="e9-us07"></a>
### E9-US07 - Parent accepts child wish
**User Story:** As a Parent, I want to accepts child wish, so that I can complete the Child Wish Grid workflow.
**Description:** This story defines the expected behavior for `Parent accepts child wish` in the current product flow.

**Actor(s):** Parent
**Dependency / Source:** Child Wish Grid
**Acceptance Criteria (minimal):**
- [ ] Parent can view child wish grid by switching child tab
- [ ] Parent can open a wish detail modal and click **Accept**
- [ ] Accept requires confirmation
- [ ] Completed wish disappears from both parent and child views
- [ ] Completion generates notifications for parent and child
**Suggested Sub-tasks:**
- Wish review modal + accept action + notification
**Spec:** [Specs for E9-US07](FJ_Specs.md#e9-us07)

<a id="e8-us04"></a>
### E8-US04 - Add standalone child backpack page
**User Story:** As a Child, I want to add standalone child backpack page while retaining Spirit Tree backpack, so that I can complete the Backpack inventory flow (E8-US01, E8-US03) workflow.
**Description:** This story defines the expected behavior for `Add standalone child backpack page` in the current product flow.

**Actor(s):** Child
**Dependency / Source:** Backpack inventory flow (E8-US01, E8-US03)
**Acceptance Criteria (minimal):**
- [ ] Child bottom navigation includes `Backpack` entry after `Shop`.
- [ ] `/backpack` page displays backpack grid and item detail preview panel.
- [ ] Spirit Tree backpack flow remains available and unchanged.
**Suggested Sub-tasks:**
- Child backpack route/controller/view/view-model
- Backpack page script and detail panel interaction
**Spec:** [Specs for E8-US04](FJ_Specs.md#e8-us04)

<a id="e9-us08"></a>
### E9-US08 - Unify Spirit Tree slot layout (parent/child)
**User Story:** As a Parent, I want to unify child and parent Spirit Tree cloud-slot layout contract, so that I can complete the Spirit Tree rendering flow (E8-US03, E9-US07) workflow.
**Description:** This story defines the expected behavior for `Unify Spirit Tree slot layout (parent/child)` in the current product flow.

**Actor(s):** Parent / Child / System
**Dependency / Source:** Spirit Tree rendering flow (E8-US03, E9-US07)
**Acceptance Criteria (minimal):**
- [ ] Child and parent Spirit Tree pages use one shared cloud-slot layout source.
- [ ] Slot position contract supports independent top/left/rotation/scale per slot.
- [ ] Parent and child render consistent cloud-slot geometry for the same slot code.
**Suggested Sub-tasks:**
- Shared wish cloud layout module
- Parent/child renderer refactor to consume the shared module
**Spec:** [Specs for E9-US08](FJ_Specs.md#e9-us08)

<a id="e9-us09"></a>
### E9-US09 - Parent Spirit Tree all-children carousel mode
**User Story:** As a Parent, I want to spirit Tree uses all-children carousel and removes header child switcher dependency, so that I can complete the Parent Spirit Tree dashboard workflow.
**Description:** This story defines the expected behavior for `Parent Spirit Tree all-children carousel mode` in the current product flow.

**Actor(s):** Parent
**Dependency / Source:** Parent Spirit Tree dashboard
**Acceptance Criteria (minimal):**
- [ ] Parent Spirit Tree displays all children in horizontal swipe carousel cards.
- [ ] Child cards are sorted by nickname alphabetically.
- [ ] Header child switcher is not required by parent Spirit Tree view-model/template.
- [ ] Carousel supports looping and one-card step interaction.
**Suggested Sub-tasks:**
- Parent dashboard template cleanup (remove legacy single-child branch)
- Parent dashboard view-model/controller cleanup for child switcher inputs
- Carousel interaction hardening
**Spec:** [Specs for E9-US09](FJ_Specs.md#e9-us09)

<a id="e9-us10"></a>
### E9-US10 - Empty wish slot opens modal with backpack deep-link
**User Story:** As a Child, I want to empty wish slot opens modal with backpack deep-link, so that I can complete the Child Spirit Tree interaction (E8-US03, E8-US04) workflow.
**Description:** This story defines the expected behavior for `Empty wish slot opens modal with backpack deep-link` in the current product flow.

**Actor(s):** Child
**Dependency / Source:** Child Spirit Tree interaction (E8-US03, E8-US04)
**Acceptance Criteria (minimal):**
- [ ] Clicking an empty cloud slot opens an informational modal.
- [ ] Modal message indicates no wish is planted and guides child to Backpack.
- [ ] Modal confirm action deep-links to `/backpack`.
**Suggested Sub-tasks:**
- Empty-slot modal behavior in child dashboard script
- Backpack route deep-link wiring
**Spec:** [Specs for E9-US10](FJ_Specs.md#e9-us10)

## E5 - Account Security & Recovery
**Status:** Confirmed
**Description:** Account security and recovery aligned with family-based accounts. Family Admin manages member resets.

<a id="e5-us03"></a>
### E5-US03 - Family Admin resets member password
**User Story:** As a Family Admin, I want to resets member password, so that I can complete the Member Management workflow.
**Description:** This story defines the expected behavior for `Family Admin resets member password` in the current product flow.

**Actor(s):** Family Admin / System
**Dependency / Source:** Member Management
**Acceptance Criteria (minimal):**
- [ ] Admin can reset member password to default (family code)
**Suggested Sub-tasks:**
- Reset member password
**Spec:** [Specs for E5-US03](FJ_Specs.md#e5-us03)

<a id="e5-us04"></a>
### E5-US04 - Change password (self-service)
**User Story:** As a Parent, I want to change password (self-service), so that I can complete the Profile / Account settings workflow.
**Description:** This story defines the expected behavior for `Change password (self-service)` in the current product flow.

**Actor(s):** Parent / Child
**Dependency / Source:** Profile / Account settings
**Acceptance Criteria (minimal):**
- [ ] Change password with current password
**Suggested Sub-tasks:**
- Change password form
**Spec:** [Specs for E5-US04](FJ_Specs.md#e5-us04)

<a id="e5-us05"></a>
### E5-US05 - Self-service username change
**User Story:** As a Parent, I want to self-service username change, so that I can complete the Profile / Account settings workflow.
**Description:** This story defines the expected behavior for `Self-service username change` in the current product flow.

**Actor(s):** Parent / Child
**Dependency / Source:** Profile / Account settings
**Acceptance Criteria (minimal):**
- [ ] Edit Username (name part only)
**Suggested Sub-tasks:**
- Update username
**Spec:** [Specs for E5-US05](FJ_Specs.md#e5-us05)

<a id="e5-us06"></a>
### E5-US06 - Self-service nickname change
**User Story:** As a Parent, I want to self-service nickname change, so that I can complete the Profile / Account settings workflow.
**Description:** This story defines the expected behavior for `Self-service nickname change` in the current product flow.

**Actor(s):** Parent / Child
**Dependency / Source:** Profile / Account settings
**Acceptance Criteria (minimal):**
- [ ] Edit Nickname
**Suggested Sub-tasks:**
- Update nickname
**Spec:** [Specs for E5-US06](FJ_Specs.md#e5-us06)

<a id="e5-us07"></a>
### E5-US07 - View profile and account details
**User Story:** As a Parent, I want to view profile and account details, so that I can complete the Profile / Account settings workflow.
**Description:** This story defines the expected behavior for `View profile and account details` in the current product flow.

**Actor(s):** Parent / Child
**Dependency / Source:** Profile / Account settings
**Acceptance Criteria (minimal):**
- [ ] View profile (nickname, username, role)
**Suggested Sub-tasks:**
- Profile page
**Spec:** [Specs for E5-US07](FJ_Specs.md#e5-us07)

<a id="e5-us12"></a>
### E5-US12 - Regenerate session after register-family auto-login
**User Story:** As a Parent, I want to regenerate session after register-family auto-login, so that I can complete the Register-family flow (E2-US01) workflow.
**Description:** This story defines the expected behavior for `Regenerate session after register-family auto-login` in the current product flow.

**Actor(s):** Parent / System
**Dependency / Source:** Register-family flow (E2-US01)
**Acceptance Criteria (minimal):**
- [ ] Session ID is regenerated before persisting post-registration login state
- [ ] Auto-login behavior remains unchanged for user experience
**Suggested Sub-tasks:**
- Register-family session lifecycle hardening
**Spec:** [Specs for E5-US12](FJ_Specs.md#e5-us12)

<a id="e5-us13"></a>
### E5-US13 - Enforce family-scope authorization guard
**User Story:** As a Parent, I want to enforce family-scope authorization guard for child/reward/quest refs, so that I can complete the Family permission model (E2), security controls (E5) workflow.
**Description:** This story defines the expected behavior for `Enforce family-scope authorization guard` in the current product flow.

**Actor(s):** Parent / System
**Dependency / Source:** Family permission model (E2), security controls (E5)
**Acceptance Criteria (minimal):**
- [ ] Child/reward/quest reference checks are centralized in reusable guard logic
- [ ] Cross-family references are rejected consistently
**Suggested Sub-tasks:**
- Shared access guard service
- Apply guard to wish/shop/quest write flows
**Spec:** [Specs for E5-US13](FJ_Specs.md#e5-us13)

## E6 - Ops & Admin
**Status:** Implemented baseline (Sprint 8), with selected metrics extensions in later sprint.
**Description:** System admin dashboard for authentication, family/user lookup, audit logs, and operational metrics.

<a id="e6-us01"></a>
### E6-US01 - System Admin login
**User Story:** As a System Admin, I want to login, so that I can complete the Admin Auth workflow.
**Description:** This story defines the expected behavior for `System Admin login` in the current product flow.

**Actor(s):** System Admin
**Dependency / Source:** Admin Auth
**Acceptance Criteria (minimal):**
- [ ] Admin Login
**Suggested Sub-tasks:**
- Admin login
**Spec:** [Specs for E6-US01](FJ_Specs.md#e6-us01)

<a id="e6-us02"></a>
### E6-US02 - System Admin logout
**User Story:** As a System Admin, I want to logout, so that I can complete the Admin Auth workflow.
**Description:** This story defines the expected behavior for `System Admin logout` in the current product flow.

**Actor(s):** System Admin
**Dependency / Source:** Admin Auth
**Acceptance Criteria (minimal):**
- [ ] Admin Logout
**Suggested Sub-tasks:**
- Admin logout
**Spec:** [Specs for E6-US02](FJ_Specs.md#e6-us02)

<a id="e6-us03"></a>
### E6-US03 - System Admin session management
**User Story:** As a System Admin, I want to session management, so that I can complete the Admin Auth workflow.
**Description:** This story defines the expected behavior for `System Admin session management` in the current product flow.

**Actor(s):** System Admin
**Dependency / Source:** Admin Auth
**Acceptance Criteria (minimal):**
- [ ] Session management
**Suggested Sub-tasks:**
- Admin session handling
**Spec:** [Specs for E6-US03](FJ_Specs.md#e6-us03)

<a id="e6-us06"></a>
### E6-US06 - View growth metrics

**User Story:** As a System Admin, I want to view growth metrics, so that I can complete the Families + Login events workflow.
**Description:** This story defines the expected behavior for `View growth metrics` in the current product flow.

**Actor(s):** System Admin

**Dependency / Source:** Families + Login events

**Acceptance Criteria (minimal):**

- [ ] View growth metrics

**Suggested Sub-tasks:**

- Growth metrics panel

**Spec:** [Specs for E6-US06](FJ_Specs.md#e6-us06)

<a id="e6-us07"></a>
### E6-US07 - Browse families
**User Story:** As a System Admin, I want to browse families, so that I can complete the Family registry workflow.
**Description:** This story defines the expected behavior for `Browse families` in the current product flow.

**Actor(s):** System Admin
**Dependency / Source:** Family registry
**Acceptance Criteria (minimal):**
- [ ] View Family List
**Suggested Sub-tasks:**
- Family list view
**Spec:** [Specs for E6-US07](FJ_Specs.md#e6-us07)

<a id="e6-us08"></a>
### E6-US08 - Filter families by name
**User Story:** As a System Admin, I want to filter families by name, so that I can complete the Family registry workflow.
**Description:** This story defines the expected behavior for `Filter families by name` in the current product flow.

**Actor(s):** System Admin
**Dependency / Source:** Family registry
**Acceptance Criteria (minimal):**
- [ ] Filter by Family Name
**Suggested Sub-tasks:**
- Family filter
**Spec:** [Specs for E6-US08](FJ_Specs.md#e6-us08)

<a id="e6-us09"></a>
### E6-US09 - Search users by username and family name
**User Story:** As a System Admin, I want to search users by username and family name, so that I can complete the User registry workflow.
**Description:** This story defines the expected behavior for `Search users by username and family name` in the current product flow.

**Actor(s):** System Admin
**Dependency / Source:** User registry
**Acceptance Criteria (minimal):**
- [ ] Search users with fuzzy match on username
- [ ] Search users with fuzzy match on family name
- [ ] Support combined username + family name filtering
**Suggested Sub-tasks:**
- User/family combined query
**Spec:** [Specs for E6-US09](FJ_Specs.md#e6-us09)

<a id="e6-us10"></a>
### E6-US10 - View audit logs
**User Story:** As a System Admin, I want to view audit logs, so that I can complete the Admin operation logs workflow.
**Description:** This story defines the expected behavior for `View audit logs` in the current product flow.

**Actor(s):** System Admin
**Dependency / Source:** Admin operation logs
**Acceptance Criteria (minimal):**
- [ ] View audit log list
- [ ] Filter logs by username and family name
**Suggested Sub-tasks:**
- Audit log list and filters
**Spec:** [Specs for E6-US10](FJ_Specs.md#e6-us10)

<a id="e6-us11"></a>
### E6-US11 - System Admin account provisioning
**User Story:** As a System, I want to account provisioning, so that I can complete the Admin provisioning workflow.
**Description:** This story defines the expected behavior for `System Admin account provisioning` in the current product flow.

**Actor(s):** System
**Dependency / Source:** Admin provisioning
**Acceptance Criteria (minimal):**
- [ ] System Admin account is pre-provisioned in database by controlled tool/script
- [ ] System Admin account is not self-registered from main app flow
**Suggested Sub-tasks:**
- Admin seed/provisioning task
**Spec:** [Specs for E6-US11](FJ_Specs.md#e6-us11)

<a id="e6-us12"></a>
### E6-US12 - Produce Sprint 6 as-built documentation
**User Story:** As a Product, I want to produce planning-userstories-specs as-built documentation, so that I can complete the Documentation delivery baseline workflow.
**Description:** This story defines the expected behavior for `Produce Sprint 6 as-built documentation` in the current product flow.

**Actor(s):** Product / Engineering
**Dependency / Source:** Documentation delivery baseline
**Acceptance Criteria (minimal):**
- [ ] Planned backlog is recorded in Jira import CSV
- [ ] User stories and specs are updated as single source of truth
**Suggested Sub-tasks:**
- Update planning CSV
- Update UserStories and Specs
**Spec:** [Specs for E6-US12](FJ_Specs.md#e6-us12)

<a id="e6-us13"></a>
### E6-US13 - Maintain code-to-doc traceability matrix
**User Story:** As a Product, I want to maintain code-to-doc traceability matrix for sprint handoff, so that I can complete the Documentation governance workflow.
**Description:** This story defines the expected behavior for `Maintain code-to-doc traceability matrix` in the current product flow.

**Actor(s):** Product / Engineering
**Dependency / Source:** Documentation governance
**Acceptance Criteria (minimal):**
- [ ] Each in-scope story links to concrete code modules/routes
- [ ] Handoff checklist includes traceability verification
**Suggested Sub-tasks:**
- Traceability table
- Handoff checklist update
**Spec:** [Specs for E6-US13](FJ_Specs.md#e6-us13)

<a id="e6-us14"></a>
### E6-US14 - View family detail
**User Story:** As a System Admin, I want to view family detail, so that I can complete the Families list (E6-US07) workflow.
**Description:** This story defines the expected behavior for `View family detail` in the current product flow.

**Actor(s):** System Admin
**Dependency / Source:** Families list (E6-US07)
**Acceptance Criteria (minimal):**
- [ ] System Admin can open a family detail page from families list
- [ ] Family detail page shows family metadata and member list
**Suggested Sub-tasks:**
- Family detail route/controller/view
- Family/member detail query
**Spec:** [Specs for E6-US14](FJ_Specs.md#e6-us14)

<a id="e6-us15"></a>
### E6-US15 - View activity metrics

**User Story:** As a System Admin, I want to view activity metrics, so that I can complete the Families + Login events workflow.
**Description:** This story defines the expected behavior for `View activity metrics` in the current product flow.

**Actor(s):** System Admin

**Dependency / Source:** Families + Login events

**Acceptance Criteria (minimal):**

- [ ] View activity metrics

**Suggested Sub-tasks:**

- Activity metrics panel

**Spec:** [Specs for E6-US15](FJ_Specs.md#e6-us15)

<a id="e6-us16"></a>
### E6-US16 - View user retention metrics

**User Story:** As a System Admin, I want to view user retention metrics, so that I can complete the Families + Login events workflow.
**Description:** This story defines the expected behavior for `View user retention metrics` in the current product flow.

**Actor(s):** System Admin

**Dependency / Source:** Families + Login events

**Acceptance Criteria (minimal):**

- [ ] View retention metrics

**Suggested Sub-tasks:**

- Retention metrics panel

**Spec:** [Specs for E6-US16](FJ_Specs.md#e6-us16)

## E7 - Notifications
**Status:** Draft / MVP Scope v1
**Description:** In-app mailbox style notifications (text + deep links). Processing remains on feature pages.

<a id="e7-us04"></a>
### E7-US04 - View inbox list
**User Story:** As a All Roles (role-based content), I want to view inbox list, so that I can complete the Inbox workflow.
**Description:** This story defines the expected behavior for `View inbox list` in the current product flow.

**Actor(s):** All Roles (role-based content)
**Dependency / Source:** Inbox
**Acceptance Criteria (minimal):**
- [ ] View Inbox list (time order)
**Suggested Sub-tasks:**
- Inbox list
**Spec:** [Specs for E7-US04](FJ_Specs.md#e7-us04)



