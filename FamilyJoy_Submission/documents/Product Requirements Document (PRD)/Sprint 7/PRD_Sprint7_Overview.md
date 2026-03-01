# Sprint 7 PRD - Spirit Tree UX Consolidation (As-Built)

## 1. Goal
Sprint 7 completes a UI/interaction consolidation pass for Spirit Tree and parent management pages, with one shared slot contract, stronger empty-state handling, and production-aligned asset configuration.

## 2. In-Scope User Stories
- E4-US30 - Unify child and parent Spirit Tree slot layout contract.
- E4-US31 - Parent Spirit Tree all-children carousel without header child switcher dependency.
- E4-US32 - Child empty slot guidance with Backpack deep-link.

## 3. Scope (As-Built)
- Shared 5-slot contract for Spirit Tree rendering in both child and parent pages.
- Parent Spirit Tree carousel with alphabetical child order, loop continuity, one-step navigation, and segmented position indicator.
- Child and parent Spirit Tree both use:
  - floating wish markers for filled slots,
  - docked markers for empty slots,
  - bottom storage slot strip for direct slot-state visibility.
- Child empty storage slot interaction opens guidance modal and routes to Backpack.
- No-child empty-state cards with Add Child CTA in parent Spirit Tree, parent Quest, and parent Shop views.
- Asset paths centralized through server-side asset manifest and injected to layout-level CSS variables.

## 4. Functional Requirements

### FR-7.1 Shared Slot Contract
- Slot order is fixed to 5 slots (`A..E`) for both child and parent Spirit Tree pages.
- One shared JS module defines:
  - floating layout per slot (`top/left/right/bottom/rotate/scale/z/delay`)
  - docked layout per slot above the bottom storage strip.
- Parent and child render the same slot code using the same geometry contract.

### FR-7.2 Parent Carousel Behavior
- Parent sees one child card per viewport.
- Child cards are sorted alphabetically by nickname/username.
- Carousel supports loop continuity (first/last wrap behavior).
- Touch movement is clamped to one-card progression per swipe.
- Position indicator uses segmented bar by child count.

### FR-7.3 Empty and Filled Slot Interaction
- Child:
  - Click filled slot -> open wish detail modal.
  - Click empty storage slot -> open guidance modal -> primary action routes to `/backpack`.
- Parent:
  - Click filled slot -> open detail modal -> accept flow available.
  - Click empty slot -> no action modal.

### FR-7.4 No-Child Empty States
- For parent role, when family has no child members:
  - Spirit Tree page shows no-child card + Add Child CTA.
  - Quest page shows no-child card + Add Child CTA.
  - Shop page shows no-child card + Add Child CTA and suppresses child-scoped content.

### FR-7.5 Asset Manifest Usage
- UI asset paths are read from `assets.manifest.json` via server helper.
- Layout exposes resolved paths as CSS variables for client styles.
- This removes per-page hard-coded UI asset file paths.

## 5. UX Requirements
- Tree remains primary visual anchor.
- Filled and empty slot states must be visually distinguishable.
- Parent and child Spirit Tree visual language must remain consistent.
- Empty-state cards must provide a direct next step (Add Child).

## 6. Out of Scope
- Admin portal features (moved to Sprint 8 planning phase).
- Essence-to-health economy redesign and balancing.
- New role/permission model changes.

## 7. Acceptance Criteria
- Shared slot contract is consumed by both child and parent Spirit Tree scripts.
- Parent Spirit Tree works without header child switcher data dependency.
- Parent carousel loops and remains single-card step.
- Child empty storage slot flow reaches Backpack via modal confirm.
- No-child state cards render correctly in parent Spirit Tree/Quest/Shop pages.

