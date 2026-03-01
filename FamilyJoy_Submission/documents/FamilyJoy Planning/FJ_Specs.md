# Family Joy Project - Specs

## Traceability Bridge
This section is the bridge between planning/user stories and code.

### A) Sprint-to-Commit Index (As-Built)
| Sprint | Commit Evidence |
|---|---|
| Sprint 6 | `4ab6742`, `41c7014` |
| Sprint 7 | `63c35b0` |
| Sprint 8 | `1b1c73b`, `00d25a3` |
| Sprint 9 | `980ca89`, `d17cee0`, `0d9f92e` |
| Sprint 1-5 (legacy baseline) | pre-`Sprint_6` history on `main` (tracked by US key + code evidence below) |

### B) Story-to-Code Evidence Map
Use this map to locate code evidence for a story key by epic.

| Story Key Scope | Primary Server Evidence | Primary Client/Admin Evidence |
|---|---|---|
| `E1-US*` Login | `src/familyjoy_server/controllers/authController.js`, `src/familyjoy_server/services/authService.js`, `src/familyjoy_server/routes/auth.js` | `src/familyjoy_client/views/pages/auth/login.ejs` |
| `E2-US*` Family Management | `src/familyjoy_server/controllers/familyController.js`, `src/familyjoy_server/services/familyService.js`, `src/familyjoy_server/services/userService.js` | `src/familyjoy_client/views/pages/family/family.ejs`, `src/familyjoy_client/public/js/pages/family.js` |
| `E3-US*` Quest Lifecycle | `src/familyjoy_server/controllers/questController.js`, `src/familyjoy_server/services/questService.js`, `src/familyjoy_server/viewModels/questViewModel.js` | `src/familyjoy_client/views/pages/quest/quest_home.ejs`, `src/familyjoy_client/public/js/pages/quest_home.js`, `src/familyjoy_client/public/js/pages/quest_assign.js` |
| `E4/E8/E9-US*` Shop/Backpack/Spirit Tree | `src/familyjoy_server/controllers/shopController.js`, `src/familyjoy_server/services/shopService.js`, `src/familyjoy_server/controllers/dashboardController.js` | `src/familyjoy_client/views/pages/shop/*.ejs`, `src/familyjoy_client/views/pages/dashboard/*.ejs`, `src/familyjoy_client/public/js/pages/child_dashboard.js`, `src/familyjoy_client/public/js/pages/shop_*.js` |
| `E5-US*` Account Security | `src/familyjoy_server/services/userService.js`, `src/familyjoy_server/controllers/userController.js`, `src/familyjoy_server/controllers/authController.js` | `src/familyjoy_client/views/pages/profile/*.ejs` |
| `E6-US*` Ops/Admin | `src/familyjoy_admin/server/routes/admin_routes.js`, `src/familyjoy_admin/server/controllers/admin_controller.js`, `src/familyjoy_admin/server/services/admin_service.js`, `src/familyjoy_admin/server/repositories/admin_repository.js` | `src/familyjoy_admin/views/pages/admin_*.ejs`, `src/familyjoy_admin/views/layouts/admin_layout.ejs`, `src/familyjoy_admin/public/css/admin_base.css` |
| `E7-US*` Notifications | `src/familyjoy_server/services/mailboxService.js`, `src/familyjoy_server/controllers/mailboxController.js` | `src/familyjoy_client/public/js/modules/mailbox.js` |

### C) Verification Rules
- Every `US Key` in CSV must exist in `FJ_UserStories.md`.
- Every story in `FJ_UserStories.md` must have a matching spec anchor in this file.
- Done stories must resolve to at least one code evidence path in section **B**.

## E1 - Login
<a id="e1-us01"></a>
### E1-US01 - Family members login and manage sessions
**Core Rules & Constraints**
- All roles login with username+password. Remember-me enabled for all roles. Users can change their own password.
**Lifecycle / State Notes**
- Session persists until logout or expiry.

<a id="e1-us02"></a>
### E1-US02 - User can use remember-me
**Core Rules & Constraints**
- See User Story for functional intent and acceptance criteria.
**Lifecycle / State Notes**
- TBA.

<a id="e1-us03"></a>
### E1-US03 - User can logout
**Core Rules & Constraints**
- See User Story for functional intent and acceptance criteria.
**Lifecycle / State Notes**
- TBA.

## E2 - Family Management
<a id="e2-us01"></a>
### E2-US01 - Create family and generate Family Admin
**Core Rules & Constraints**
- Creating a family auto-generates a Family Admin account. Family Name is set during creation. Family Code is 4 letters. Accounts are generated inside family; no invite flow. Username format: <FamilyCode>_<username>. Prefix immutable; username editable.
**Lifecycle / State Notes**
- Family created -> Family Admin exists.

<a id="e2-us02"></a>
### E2-US02 - Edit family name
**Core Rules & Constraints**
- Family Name editable after creation.
**Lifecycle / State Notes**
- Immediate effect.

<a id="e2-us03"></a>
### E2-US03 - Generate parent/child accounts (no invite)
**Core Rules & Constraints**
- Parent/Child cannot self-register. Accounts are generated in-family. All roles can login with username+password.
**Lifecycle / State Notes**
- Account status Active by default.

<a id="e2-us04"></a>
### E2-US04 - Enforce default role permissions
**Core Rules & Constraints**
- Child: view quests and submit completion; cannot create/assign/confirm. Parent: full management for family and quests.
**Lifecycle / State Notes**
- Immutable permissions (no custom config in v1).

<a id="e2-us06"></a>
### E2-US06 - Disable a member account
**Core Rules & Constraints**
- See User Story for functional intent and acceptance criteria.
**Lifecycle / State Notes**
- TBA.

<a id="e2-us07"></a>
### E2-US07 - Show delete countdown for disabled member
**Core Rules & Constraints**
- See User Story for functional intent and acceptance criteria.
**Lifecycle / State Notes**
- TBA.

<a id="e2-us08"></a>
### E2-US08 - Restore member during countdown
**Core Rules & Constraints**
- See User Story for functional intent and acceptance criteria.
**Lifecycle / State Notes**
- TBA.

<a id="e2-us09"></a>
### E2-US09 - Reset member password to default
**Core Rules & Constraints**
- See User Story for functional intent and acceptance criteria.
**Lifecycle / State Notes**
- TBA.

<a id="e2-us11"></a>
### E2-US11 - View family members list
**Core Rules & Constraints**
- See User Story for functional intent and acceptance criteria.
**Lifecycle / State Notes**
- TBA.

<a id="e2-us12"></a>
### E2-US12 - View member login credential status
**Core Rules & Constraints**
- See User Story for functional intent and acceptance criteria.
**Lifecycle / State Notes**
- TBA.

<a id="e2-us15"></a>
### E2-US15 - Standardize mobile app shell and navigation
**Core Rules & Constraints**
- Navigated pages share fixed `app-header`, `app-content`, `app-footer` structure.
- `app-content` itself does not scroll; only explicit module regions may scroll.
- Bottom navigation uses equal-width item distribution independent of label length and item count.
**Lifecycle / State Notes**
- Applies to all navigated parent/child pages except non-navigated auth/error flows.

<a id="e2-us16"></a>
### E2-US16 - Generate Family Admin
**Core Rules & Constraints**
- See User Story for functional intent and acceptance criteria.
**Lifecycle / State Notes**
- TBA.

<a id="e2-us17"></a>
### E2-US17 - View member role and status
**Core Rules & Constraints**
- See User Story for functional intent and acceptance criteria.
**Lifecycle / State Notes**
- TBA.

## E3 - Quest Lifecycle
<a id="e3-us01"></a>
### E3-US01 - Create reusable quests in Quest Book
**Core Rules & Constraints**
- System categories: housework / study / health / habit / reading / sports / others.
**Lifecycle / State Notes**
- Quest stored as reusable template.

<a id="e3-us02"></a>
### E3-US02 - Plan daily quests manually from Quest Book
**Core Rules & Constraints**
- Daily lists select only from Quest Book; no ad-hoc creation in daily list. Tomorrow list is read-only for child. Same quest cannot repeat on same day.
**Lifecycle / State Notes**
- Tomorrow -> Today at server 00:00.

<a id="e3-us03"></a>
### E3-US03 - Child views daily quests
**Core Rules & Constraints**
- Tomorrow is read-only; cannot submit completion for Tomorrow.
**Lifecycle / State Notes**
- Quest status: assigned.

<a id="e3-us04"></a>
### E3-US04 - Child requests completion (Today only)
**Core Rules & Constraints**
- Only Today quests can be submitted. Submission sets status to submitted. No notes/photos/attachments in v1.
**Lifecycle / State Notes**
- Quest status: submitted (pending review).

<a id="e3-us05"></a>
### E3-US05 - Parent confirms completion (complete/incomplete)
**Core Rules & Constraints**
- Parent marks submitted quests as complete or incomplete. Scoring and rewards are handled in later scope.
**Lifecycle / State Notes**
- Quest status complete or incomplete.

<a id="e3-us06"></a>
### E3-US06 - Remove assigned quest
**Core Rules & Constraints**
- See User Story for functional intent and acceptance criteria.
**Lifecycle / State Notes**
- TBA.

<a id="e3-us07"></a>
### E3-US07 - Child views today quests
**Core Rules & Constraints**
- See User Story for functional intent and acceptance criteria.
**Lifecycle / State Notes**
- TBA.

<a id="e3-us08"></a>
### E3-US08 - Child views tomorrow quests
**Core Rules & Constraints**
- See User Story for functional intent and acceptance criteria.
**Lifecycle / State Notes**
- TBA.

<a id="e3-us09"></a>
### E3-US09 - Child submits completion request (today only)
**Core Rules & Constraints**
- See User Story for functional intent and acceptance criteria.
**Lifecycle / State Notes**
- TBA.

<a id="e3-us10"></a>
### E3-US10 - Child views quest detail
**Core Rules & Constraints**
- See User Story for functional intent and acceptance criteria.
**Lifecycle / State Notes**
- TBA.

<a id="e3-us11"></a>
### E3-US11 - Child submits from quest detail
**Core Rules & Constraints**
- See User Story for functional intent and acceptance criteria.
**Lifecycle / State Notes**
- TBA.

<a id="e3-us12"></a>
### E3-US12 - Parent marks quest complete
**Core Rules & Constraints**
- See User Story for functional intent and acceptance criteria.
**Lifecycle / State Notes**
- TBA.

<a id="e3-us13"></a>
### E3-US13 - Parent marks quest incomplete
**Core Rules & Constraints**
- See User Story for functional intent and acceptance criteria.
**Lifecycle / State Notes**
- TBA.

<a id="e3-us18"></a>
### E3-US18 - View daily history calendar
**Core Rules & Constraints**
- See User Story for functional intent and acceptance criteria.
**Lifecycle / State Notes**
- TBA.

<a id="e3-us19"></a>
### E3-US19 - Prevent duplicate reward on concurrent quest review
**Core Rules & Constraints**
- Quest review state transition must be conditional: update only from `submitted` to `complete` or `incomplete`.
- Crystal reward issuance must be idempotent with respect to a daily quest review decision.
**Lifecycle / State Notes**
- Allowed transition in review path: `submitted` -> `complete|incomplete` (single effective commit).

<a id="e3-us20"></a>
### E3-US20 - Optimize quest assignment with day/category filters
**Core Rules & Constraints**
- Add Quest modal field order: Day -> Category -> Quest.
- Category selection gates Quest selection.
- Available quest options are computed by selected day and selected child; already-assigned definitions for that day are excluded.
- Client-side filtering improves selection speed; server validation remains source of truth.
- Quest definition base crystals must be integer range `1..100` in create/edit flows.
**Lifecycle / State Notes**
- Assign modal state rebinds when day tab changes (`Yesterday`, `Today`, `Tomorrow`).

<a id="e3-us21"></a>
### E3-US21 - Archive quest from Quest Book edit modal
**Core Rules & Constraints**
- Delete operation for quest definitions is soft delete (`status = archived`), not physical deletion.
- Delete action is exposed from Edit Quest modal with explicit confirmation.
- Quest Book and Add Quest assignment options must only include `active` definitions.
**Lifecycle / State Notes**
- Definition lifecycle: `active -> archived`.
- Existing historical daily quests remain intact.

<a id="e3-us22"></a>
### E3-US22 - Use category grid for quest assignment
**Core Rules & Constraints**
- Category selection uses equal-width button grid (no native select overlay).
- Category grid always renders the full predefined category set (not filtered by current available quests).
- Quest selection uses in-modal selectable list and hidden submit field.
- Modal height remains fixed; quest list area is independently scrollable.
- Placeholder item is shown when no category is selected.
**Lifecycle / State Notes**
- State order: day bind -> category select -> quest select -> assign enabled.
- On modal open/day switch, selection state is reset and recomputed.

<a id="e3-us23"></a>
### E3-US23 - Centralize quest category source of truth
**Core Rules & Constraints**
- Quest categories are defined once in server constants and imported by validator/service/view-model.
- Duplicated hard-coded category arrays are prohibited.
**Lifecycle / State Notes**
- Category list updates propagate automatically to validation and assignment UI models.

<a id="e3-us24"></a>
### E3-US24 - Set quest category
**Core Rules & Constraints**
- See User Story for functional intent and acceptance criteria.
**Lifecycle / State Notes**
- TBA.

<a id="e3-us25"></a>
### E3-US25 - Set base crystals
**Core Rules & Constraints**
- See User Story for functional intent and acceptance criteria.
**Lifecycle / State Notes**
- TBA.

## E4 - Reward Shop
<a id="e4-us01"></a>
### E4-US01 - Crystals wallet & ledger
**Core Rules & Constraints**
- All crystal earnings/spending recorded and visible.
**Lifecycle / State Notes**
- Ledger append-only.

<a id="e4-us02"></a>
### E4-US02 - Parent manages reward shop
**Core Rules & Constraints**
- Rewards priced in Crystals; listed/unlisted; scoped per child. Inventory: unlimited in v1. Unlisting affects shop only; does not remove already-owned items. Price changes affect future purchases only.
**Lifecycle / State Notes**
- Catalog is state-driven.

<a id="e4-us03"></a>
### E4-US03 - Child purchases rewards into backpack
**Core Rules & Constraints**
- Purchase deducts Crystals immediately; insufficient balance blocks purchase. Backpack stacking: ALL items stack as xN in v1.
**Lifecycle / State Notes**
- Backpack state: Owned.

<a id="e4-us04"></a>
### E4-US04 - Essence ->Health + random decay events + event log UI
**Core Rules & Constraints**
- Essence is a backpack-usable resource that directly increases Health when spent. Conversion: 1 Essence = +1 Health (instant), Health capped at 100. Essence exchange rate FIXED: 100 Crystals -> +20 Essence (adjustable later). Implemented via an 'Essence Token' in shop: buying costs 100 Crystals, token stored in backpack; using token grants +20 Essence. Daily purchase cap: 5 tokens/day. Daily Essence gain cap: 200 (enforced at use time; extra tokens can be stored). Health initial value for new family/child: 10. At 00:00: settle Health to compute next-day fruit count; Health persists (no reset) to support LowStreak logic. Random decay events per day: min 0, max 3. Trigger only between 10:00-14:00. 10 decay-event templates in config. Design config policy: per-event decrement MUST NOT exceed 50. Decay cannot reduce Health below 10 (Health floor=10). Strength structure: 3 tiers (light/medium/heavy) and at most one event from each tier per day. UI: Wish Tree shows a small 'notice board' icon if at least one decay event occurred today. Tapping opens Today's Event Log: timestamp + description + Health delta. Log retention: today only.
**Lifecycle / State Notes**
- Token: Owned -> Used. Decay events scheduled daily (random times in 10:00-14:00).
**Notes**
- Release watch: numeric tuning is main risk (Crystal->Essence->Health vs decay tiers); validate tier distribution and keep heavy event <=1/day (already). | Finalized: Health->Fruit mapping fixed (non-configurable v1): 0-19=1, 20-39=2, 40-59=3, 60-79=4, 80-100=5. Health changes re-evaluate locks in real time; unlock/lock order top->bottom. Cap-disabled is separate from Health-lock. Fruit trays named Lv1-Lv5 for UI & emails. Health floor=10 ensures at least one tray exists (may be locked).

<a id="e4-us05"></a>
### E4-US05 - Wish submission & slot state + capacity rules + fruit priority mapping
**Core Rules & Constraints**
- After child submits a wish request, the selected slot enters Pending Lock (cannot swap/cancel) until parent resolves. If parent resolves on the SAME day: slot enters Cooldown until next server 00:00 (slot unusable during cooldown). If request remains pending across 00:00, it stays Pending Lock. When parent resolves on a LATER day, the slot remains usable that day after resolution (no cooldown penalty caused by late approval). Cap only limits NEW wish submissions for the day; it does NOT affect slots already in Pending Lock. Daily NEW wish submission limit: UsableNewWishSlotsPerDay = min(F_health, Cap). When limit is reached, further wish submissions are blocked for that day. Fruit priority/order (low-to-high) by height. Indexed bottom-to-top: Fruit 1 (lowest) ... Fruit 5 (highest). When next-day fruit count is F_health, enable Fruit 1..F_health and disable Fruit (F_health+1)..5 by default. Pending Lock always remains visible and occupies its slot; grey-out/disable rules do NOT override Pending display. After parent resolves a pending wish, slot availability is re-evaluated against today's fruit enablement, LowStreak penalty locks, and Cap (NEW submissions). If resolved slot is outside today's fruit enablement, it becomes Disabled (no fruit) after resolution. If day is under LowStreak penalty, resolved slots follow penalty lock state. Cap affects only NEW submissions; resolved slots return to normal, while NEW submissions remain limited by Cap.
**Lifecycle / State Notes**
- States: Pending Lock -> (Fulfilled/Deferred) -> (Cooldown only if same-day resolution).
**Notes**
- QA focus: boundary cases combining Pending Lock + low fruits + LowStreak penalty + Cap limit across day boundary. | Finalized: Health->Fruit mapping fixed (non-configurable v1): 0-19=1, 20-39=2, 40-59=3, 60-79=4, 80-100=5. Health changes re-evaluate locks in real time; unlock/lock order top->bottom. Cap-disabled is separate from Health-lock. Fruit trays named Lv1-Lv5 for UI & emails. Health floor=10 ensures at least one tray exists (may be locked).

<a id="e4-us06"></a>
### E4-US06 - Parent resolves wish request
**Core Rules & Constraints**
- Fulfill consumes item (removed from backpack & wish tree). Defer returns item to backpack. Slot state handled per lock/cooldown rules.
**Lifecycle / State Notes**
- Wish result: Fulfilled / Deferred.

<a id="e4-us07"></a>
### E4-US07 - Health settlement, fruit count, and consecutive low-health penalty
**Core Rules & Constraints**
- At 00:00, settle Health and determine next-day F_health by tier: 0-19=1, 20-39=2, 40-59=3, 60-79=4, 80-100=5. Threshold T=60. LowStreak: if Health_settle < 60 then +1 else reset to 0. If LowStreak >=2 then next-day penalty locks 1 highest-priority fruit (Fruit 5, then Fruit 4...) in addition to normal enablement.
**Lifecycle / State Notes**
- Daily update at 00:00.
**Notes**
- Finalized: Health->Fruit mapping fixed (non-configurable v1): 0-19=1, 20-39=2, 40-59=3, 60-79=4, 80-100=5. Health changes re-evaluate locks in real time; unlock/lock order top->bottom. Cap-disabled is separate from Health-lock. Fruit trays named Lv1-Lv5 for UI & emails. Health floor=10 ensures at least one tray exists (may be locked).

<a id="e4-us08"></a>
### E4-US08 - Wish Tree care time window
**Core Rules & Constraints**
- Wish tree care actions only allowed 08:00 inclusive to 20:00 exclusive.
**Lifecycle / State Notes**
- Outside window: care actions disabled.

<a id="e8-us01"></a>
## E8 - Backpack

### E8-US01 - Purchase reward into backpack
**Core Rules & Constraints**
- See User Story for functional intent and acceptance criteria.
**Lifecycle / State Notes**
- TBA.

<a id="e4-us10"></a>
### E4-US10 - Buy essence token
**Core Rules & Constraints**
- See User Story for functional intent and acceptance criteria.
**Lifecycle / State Notes**
- TBA.

<a id="e8-us02"></a>
### E8-US02 - Use essence token
**Core Rules & Constraints**
- See User Story for functional intent and acceptance criteria.
**Lifecycle / State Notes**
- TBA.

<a id="e9-us01"></a>
## E9 - Wish Tree Economy

### E9-US01 - Spend essence for wish tree health
**Core Rules & Constraints**
- See User Story for functional intent and acceptance criteria.
**Lifecycle / State Notes**
- TBA.

<a id="e9-us02"></a>
### E9-US02 - View decay event log
**Core Rules & Constraints**
- See User Story for functional intent and acceptance criteria.
**Lifecycle / State Notes**
- TBA.

<a id="e9-us03"></a>
### E9-US03 - Place reward in wish slot
**Core Rules & Constraints**
- See User Story for functional intent and acceptance criteria.
**Lifecycle / State Notes**
- TBA.

<a id="e9-us04"></a>
### E9-US04 - Submit wish request
**Core Rules & Constraints**
- See User Story for functional intent and acceptance criteria.
**Lifecycle / State Notes**
- TBA.

<a id="e9-us05"></a>
### E9-US05 - Fulfill wish request
**Core Rules & Constraints**
- See User Story for functional intent and acceptance criteria.
**Lifecycle / State Notes**
- TBA.

<a id="e9-us06"></a>
### E9-US06 - Defer wish request
**Core Rules & Constraints**
- See User Story for functional intent and acceptance criteria.
**Lifecycle / State Notes**
- TBA.

<a id="e8-us03"></a>
### E8-US03 - Child makes wish from backpack item
**Core Rules & Constraints**
- Spirit Tree (Child) page layout:
  - A1: animated tree area
  - A2: wish grid (2 columns x 3 rows), labeled A?F (A top-left, F bottom-right)
  - B: backpack grid (6 columns, rows = ceil(itemTypes/6)); scroll only B when > 3 rows
- Backpack shows item icons only (no text); same items stack with quantity shown bottom-right (min 1; hide if 0).
- Tapping a backpack item highlights it and opens a detail modal anchored to B (does not cover A).
- The detail modal shows item name + description and a **Make Wish** button.
- If wish grid is full, **Make Wish** is hidden and show: ?Too many wishes. Don?t be greedy.?.
- Clicking **Make Wish**:
  - Consumes 1 quantity immediately.
  - Inserts wish into next available slot (A?F order).
  - Closes modal and clears selection.
- Wish slot can be tapped to view its detail (read-only).
**Lifecycle / State Notes**
- Wish state: Open -> Completed.

<a id="e9-us07"></a>
### E9-US07 - Parent accepts child wish
**Core Rules & Constraints**
- Parent ?Home? is renamed **Spirit Tree**.
- Parent Spirit Tree layout:
  - A (bottom): child tabs (show name + avatar). Default shows up to 3 tabs; use left/right arrows to scroll one tab per click if more than 3.
  - B (top): B1 tree animation; B2 wish grid for selected child (same A?F layout).
- Parent taps a wish slot to open a detail modal (read-only) with **Accept** button.
- **Accept** requires a confirmation step.
- When accepted:
  - Wish is removed from parent and child grids.
  - Notification is sent to both parent and child via Inbox.
**Lifecycle / State Notes**
- Wish state: Open -> Completed.

<a id="e8-us04"></a>
### E8-US04 - Add standalone child backpack page
**Core Rules & Constraints**
- Child role has dedicated `/backpack` page entry in bottom navigation.
- Backpack page has fixed detail panel and separate scrollable grid panel.
- Clicking an empty wish slot on Spirit Tree routes child to `/backpack`.
- Existing Spirit Tree backpack interactions remain supported.
**Lifecycle / State Notes**
- Backpack inventory source remains shared (`child_backpack_items` + reward metadata).

<a id="e9-us08"></a>
### E9-US08 - Unify Spirit Tree slot layout (parent/child)
**Core Rules & Constraints**
- A shared client module defines slot order and per-slot geometry (`top`, `left`, `rotate`, `scale`).
- Child and parent Spirit Tree pages must import and use the same cloud layout source.
- Slot distribution must remain non-grid, asymmetric, and constrained to the tree visual band (between canopy base and root region).
- Cloud slot visuals use the existing magic-cloud slot style with transparent PNG background.
**Lifecycle / State Notes**
- Layout changes are single-source updates and propagate to both pages without duplicate edits.

<a id="e9-us09"></a>
### E9-US09 - Parent Spirit Tree all-children carousel mode
**Core Rules & Constraints**
- Parent Spirit Tree renders children as horizontal cards sorted by nickname (alphabetical).
- Parent dashboard Spirit Tree view no longer depends on header child switcher query/selection state.
- Template removes legacy all-vs-single child rendering branch and uses one carousel flow.
- Carousel behavior supports loop continuity and one-card transition per swipe interaction.
**Lifecycle / State Notes**
- Parent Spirit Tree navigation state is carousel index-based, not dropdown selection-based.

<a id="e9-us10"></a>
### E9-US10 - Empty wish slot opens modal with backpack deep-link
**Core Rules & Constraints**
- Clicking an empty wish cloud on child Spirit Tree opens modal guidance (not inline toast).
- Modal confirm action deep-links directly to `/backpack`.
- Filled slot behavior remains detail modal flow.
**Lifecycle / State Notes**
- Empty slot interaction: `idle -> modal-open -> backpack-navigation(optional)`.

## E5 - Account Security & Recovery
<a id="e5-us03"></a>
### E5-US03 - Family Admin forced reset on next login
**Core Rules & Constraints**
- After reset, auto-login and set PasswordState back to Normal.
**Lifecycle / State Notes**
- PasswordState: ResetRequired -> Normal.

<a id="e5-us04"></a>
### E5-US04 - Family Member forgot password (family-managed)
**Core Rules & Constraints**
- Members must submit a reset request (cannot be cancelled). Cooldown: one request per member every 5 minutes. Family Admin can reset member password to DEFAULT. Default password is the Family Code (permanent; does not rotate). Default password display: shown in plaintext on Family Management page. If member changes password after login, Family Admin cannot view the new password. All actions are logged (DB audit log; no UI).
**Lifecycle / State Notes**
- Request: Pending -> Completed.

<a id="e5-us05"></a>
### E5-US05 - Self-service username change
**Core Rules & Constraints**
- Prefix (Family Code) immutable; Name editable.
**Lifecycle / State Notes**
- Immediate effect.

<a id="e5-us06"></a>
### E5-US06 - Baseline security controls
**Core Rules & Constraints**
- Password stored securely (hash+salt). Enforce policy: 6-20 chars; letters+digits only (no symbols); case-sensitive; must include both letters and digits. Maintain DB audit logs for reset lifecycle and username changes.
**Lifecycle / State Notes**
- Global controls.

<a id="e5-us07"></a>
### E5-US07 - View profile and account details
**Core Rules & Constraints**
- See User Story for functional intent and acceptance criteria.
**Lifecycle / State Notes**
- TBA.

<a id="e5-us12"></a>
### E5-US12 - Regenerate session after register-family auto-login
**Core Rules & Constraints**
- Registration auto-login must regenerate session identifier before writing authenticated session state.
- Post-registration redirect behavior remains unchanged.
**Lifecycle / State Notes**
- Session lifecycle: anonymous session -> regenerated authenticated session.

<a id="e5-us13"></a>
### E5-US13 - Enforce family-scope authorization guard
**Core Rules & Constraints**
- Authorization checks for child/reward/quest-definition ownership are centralized in reusable guard logic.
- Cross-family references must fail closed with consistent error semantics.
**Lifecycle / State Notes**
- Guard applies before state-mutating operations in quest/shop/wish flows.

## E6 - Ops & Admin
<a id="e6-us01"></a>
### E6-US01 - System Admin login
**Core Rules & Constraints**
- Admin signs in with dedicated admin credentials.
- Entry route is `/admin_login`; successful login redirects to `/admin` dashboard.
- Legacy `/admin/login` path redirects to `/admin_login`.
**Lifecycle / State Notes**
- Auth state: LoggedOut -> LoggedIn.

<a id="e6-us02"></a>
### E6-US02 - System Admin logout
**Core Rules & Constraints**
- Admin logout clears admin session.
**Lifecycle / State Notes**
- Auth state: LoggedIn -> LoggedOut.

<a id="e6-us03"></a>
### E6-US03 - System Admin session management
**Core Rules & Constraints**
- `/admin/*` routes require valid admin session (except login).
- Unauthenticated admin routes redirect to `/admin_login`.
**Lifecycle / State Notes**
- Session active until logout/expiry.

<a id="e6-us06"></a>
### E6-US06 - View growth metrics
**Core Rules & Constraints**
- Dashboard shows total users, total families, new users today, and new families today.
- Natural-day calculation uses server timezone.
**Lifecycle / State Notes**
- Dashboard metrics refresh on page load.

<a id="e6-us07"></a>
### E6-US07 - Browse families
**Core Rules & Constraints**
- See User Story for functional intent and acceptance criteria.
**Lifecycle / State Notes**
- TBA.

<a id="e6-us08"></a>
### E6-US08 - Filter families by name
**Core Rules & Constraints**
- See User Story for functional intent and acceptance criteria.
**Lifecycle / State Notes**
- TBA.

<a id="e6-us09"></a>
### E6-US09 - Search users by username and family name
**Core Rules & Constraints**
- Support fuzzy search by username, family name, or combined filters.
- User list page uses pagination (10 rows per page).
**Lifecycle / State Notes**
- Server-side query + pagination response.

<a id="e6-us10"></a>
### E6-US10 - View audit logs
**Core Rules & Constraints**
- Admin can view audit log list for key operations.
- Audit log list supports username/family-name filtering and pagination.
**Lifecycle / State Notes**
- Read-only operational trace view.

<a id="e6-us11"></a>
### E6-US11 - System Admin account provisioning
**Core Rules & Constraints**
- System Admin accounts are provisioned by controlled DB tooling (seed/provision script), not by in-app self-registration.
- Main FamilyJoy user flows cannot create system admin identities.
**Lifecycle / State Notes**
- Provisioned -> Active (admin auth enabled).

<a id="e6-us12"></a>
### E6-US12 - Produce Sprint 6 as-built documentation
**Core Rules & Constraints**
- Planning entries must exist in Jira import CSV.
- UserStories and Specs must be updated in the same cycle to avoid drift.
**Lifecycle / State Notes**
- Documentation baseline finalized at sprint handoff.

<a id="e6-us13"></a>
### E6-US13 - Maintain code-to-doc traceability matrix
**Core Rules & Constraints**
- Each in-scope story must map to concrete modules/routes/services.
- Handoff checklist includes traceability verification and unresolved-gap notes.
**Lifecycle / State Notes**
- Traceability matrix updated before sprint close.

<a id="e6-us14"></a>
### E6-US14 - View family detail
**Core Rules & Constraints**
- Families list includes detail navigation.
- Family detail page is read-only for metadata and member accounts (username, nickname, role, status, created_at).
**Lifecycle / State Notes**
- Navigation: families list -> family detail -> back to families list.

<a id="e6-us15"></a>
### E6-US15 - View activity metrics
**Core Rules & Constraints**
- Dashboard shows daily active users and active families (natural day, server timezone).
- Includes 7-day active users trend in table form.
**Lifecycle / State Notes**
- Daily rollup by server local date.

<a id="e6-us16"></a>
### E6-US16 - View user retention metrics
**Core Rules & Constraints**
- See User Story for functional intent and acceptance criteria.
**Lifecycle / State Notes**
- TBA.

## E7 - Notifications
<a id="e7-us04"></a>
### E7-US04 - Feature entry badges for pending work
**Core Rules & Constraints**
- Quest/Wish pending work reminders are shown ONLY at feature entry points (tabs/pages), not in Inbox. Quest management entry shows Pending Review count; Wish management entry shows Pending Wish count. Family management entry shows 'change password reminder' for members still using default password after reset.
**Lifecycle / State Notes**
- Counts update based on underlying pending states.

## Rule-Only Items (Moved from User Stories)
The following items are rules/constraints and were removed from User Stories.

### E2 - Family Management (Rules)
<a id="e2-us05"></a>
#### E2-US05 - Enforce role permissions
**Core Rules & Constraints**
- Apply role permission model.

<a id="e2-us10"></a>
#### E2-US10 - Force password change after reset
**Core Rules & Constraints**
- Member must change password on next login.

### E3 - Quest Lifecycle (Rules)
<a id="e3-us14"></a>
#### E3-US14 - Compute daily completion progress
**Core Rules & Constraints**
- Compute EffectiveCompletion.

<a id="e3-us15"></a>
#### E3-US15 - Apply wish cap input rules
**Core Rules & Constraints**
- Cap at 00:00.

<a id="e3-us16"></a>
#### E3-US16 - Daily rollover from tomorrow to today
**Core Rules & Constraints**
- 00:00 Tomorrow -> Today.

<a id="e3-us17"></a>
#### E3-US17 - Lock unsubmitted today quests
**Core Rules & Constraints**
- Lock unsubmitted Today quests at 00:00.

### E9 - Wish Tree Economy (Rules)
<a id="e4-us13"></a>
#### E4-US13 - Trigger random decay events
**Core Rules & Constraints**
- Trigger decay (0-3/day, 10:00-14:00).

<a id="e4-us17"></a>
#### E4-US17 - Apply wish request cooldown
**Core Rules & Constraints**
- Enforce cooldown.

<a id="e4-us18"></a>
#### E4-US18 - Apply new submission cap
**Core Rules & Constraints**
- Apply new submission cap.

<a id="e4-us19"></a>
#### E4-US19 - Enable or disable fruit priority
**Core Rules & Constraints**
- Enable/disable fruit priority.

<a id="e4-us22"></a>
#### E4-US22 - Run health settlement at day end
**Core Rules & Constraints**
- 00:00 Health Settlement -> Next-day Fruit Count.

<a id="e4-us23"></a>
#### E4-US23 - Update low-health streak
**Core Rules & Constraints**
- Update LowStreak.

<a id="e4-us24"></a>
#### E4-US24 - Apply low-health penalty lock
**Core Rules & Constraints**
- Apply penalty lock.

<a id="e4-us25"></a>
#### E4-US25 - Enforce wish tree care time window
**Core Rules & Constraints**
- Enforce Care Window 08:00-20:00.

### E5 - Account Security & Recovery (Rules)
<a id="e5-us08"></a>
#### E5-US08 - Baseline security controls
**Core Rules & Constraints**
- Secure password storage + strength validation + DB audit log.

### E6 - Ops & Admin (Rules)
<a id="e6-us10-rule"></a>
#### E6-US10-Rule - Audit persistence baseline
**Core Rules & Constraints**
- Audit events must be persisted server-side for admin query pages.

### E5 - Account Security & Recovery (Rules)
<a id="e5-us02"></a>
#### E5-US02 - Skip current password in forced reset
**Core Rules & Constraints**
- No current password required in forced reset flow.

### E7 - Notifications (Rules)
<a id="e7-us08"></a>
#### E7-US08 - Feature entry badges
**Core Rules & Constraints**
- Show red dot on feature tabs.

<a id="e7-us09"></a>
#### E7-US09 - Feature entry badge counts
**Core Rules & Constraints**
- Show count on feature tabs/entries.

### E2 - Family Management (Rules)
<a id="e2-us13"></a>
#### E2-US13 - Parent navigation visibility
**Core Rules & Constraints**
- Parent-only pages and navigation items are visible to parent roles.

<a id="e2-us14"></a>
#### E2-US14 - Child navigation visibility
**Core Rules & Constraints**
- Child-only pages and navigation items are visible to child roles.

### E7 - Notifications (Rules)
<a id="e7-us02"></a>
#### E7-US02 - Show unread badge
**Core Rules & Constraints**
- Show unread red dot on inbox icon.

<a id="e7-us03"></a>
#### E7-US03 - Show unread count
**Core Rules & Constraints**
- Show unread count on inbox icon.


### E5 - Account Security & Recovery (Rules)
<a id="e5-us01"></a>
#### E5-US01 - Force password change on first login or after reset
**Core Rules & Constraints**
- Force reset flow on first login or after admin reset.

### E7 - Notifications (Rules)
<a id="e7-us01"></a>
#### E7-US01 - Show inbox icon
**Core Rules & Constraints**
- Inbox icon is visible in the navigation.


