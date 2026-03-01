# Sprint 7 TDD - Spirit Tree and Parent Scope UX Consolidation

## 1. Summary
Sprint 7 consolidates Spirit Tree rendering and interaction contracts across parent/child pages, normalizes parent child-scope UX, and externalizes UI assets through manifest-driven resolution.

## 2. As-Built Components

### 2.1 Shared Wish Slot Layout Module
- File: `workspace/src/familyjoy_client/public/js/modules/wish_cloud_layout.js`
- Exports:
  - `WISH_SLOT_ORDER` (`A..E`)
  - `WISH_LEAF_LAYOUT_BY_CODE` (filled/floating layout)
  - `WISH_DOCK_LAYOUT_BY_CODE` (empty/docked layout near storage strip)
  - `WISH_CLOUD_LAYOUT_BY_CODE` (backward-compatible alias)
- Consumed by:
  - `workspace/src/familyjoy_client/public/js/pages/child_dashboard.js`
  - `workspace/src/familyjoy_client/public/js/pages/parent_dashboard.js`

### 2.2 Child Spirit Tree Rendering and Interaction
- Files:
  - `workspace/src/familyjoy_client/views/pages/dashboard/child_dashboard.ejs`
  - `workspace/src/familyjoy_client/public/js/pages/child_dashboard.js`
  - `workspace/src/familyjoy_client/public/css/child-dashboard.css`
- As-built behavior:
  - Floating layer (`.fj-wish-leaf-layer`) for visual markers.
  - Bottom storage strip (`.fj-wish-storage-layer`) for slot state.
  - Filled slot shows seed marker + opens wish detail modal.
  - Empty storage slot opens guidance modal and deep-links to `/backpack`.
  - Health gauge shows YD/TD values with separate layered fills.

### 2.3 Parent Spirit Tree Carousel and Interaction
- Files:
  - `workspace/src/familyjoy_client/views/pages/dashboard/parent_dashboard.ejs`
  - `workspace/src/familyjoy_client/public/js/pages/parent_dashboard.js`
  - `workspace/src/familyjoy_client/public/css/parent-dashboard.css`
- As-built behavior:
  - One child card per viewport with clone-based loop continuity.
  - Single-step swipe/button transition.
  - Segmented child position indicator (segment count = child count).
  - Side navigation buttons integrated into tree card.
  - Filled wish interaction keeps accept flow via modal.

### 2.4 Parent No-Child Empty States
- Files:
  - `workspace/src/familyjoy_client/views/pages/dashboard/parent_dashboard.ejs`
  - `workspace/src/familyjoy_client/views/pages/quest/quest_home.ejs`
  - `workspace/src/familyjoy_client/views/pages/shop/shop_parent_home.ejs`
- Behavior:
  - Render no-child card and Add Child CTA.
  - Suppress child-scoped list/grids when no child exists.

### 2.5 Parent Child-Scope Tab UX (Quest / Shop)
- Files:
  - `workspace/src/familyjoy_client/views/pages/quest/quest_home.ejs`
  - `workspace/src/familyjoy_client/public/js/pages/quest_home.js`
  - `workspace/src/familyjoy_client/views/pages/shop/shop_parent_home.ejs`
  - `workspace/src/familyjoy_client/public/js/pages/parent_scope_tabs.js`
- Behavior:
  - Header child selector dependency removed for these pages.
  - Child scope switched by horizontal tabs with left/right arrow scroll controls.
  - Active tab auto-scrolls into visible bounds.

## 3. Asset Resolution Contract
- Manifest file:
  - `workspace/src/familyjoy_server/config/assets.manifest.json`
- Resolver:
  - `workspace/src/familyjoy_server/constants/assets.js` (`getAssetPath`)
- Injection point:
  - `workspace/src/familyjoy_client/views/layouts/navigated_layout.ejs`
- Runtime CSS vars:
  - `--asset-ui-background-image`
  - `--asset-ui-wish-leaf-image`
  - `--asset-ui-wish-seed-image`
  - `--asset-ui-shop-seed-image`

## 4. Controller and ViewModel Updates
- Parent dashboard path no longer depends on `selectedChildId` query for Spirit Tree rendering.
- Parent view-model marks Spirit Tree page with hidden header child switcher.
- No-child fallback data is handled for parent pages via existing view-model payloads.

## 5. Database and API Contract Update
- Sprint 7 database additions:
  - `child_spirit_tree`
  - `child_spirit_tree_daily`
- Migration:
  - `workspace/tools/migrate-sprint7-schema.sql`
- Migration runner:
  - `workspace/tools/db-migrate.js`
- APIs:
  - `GET /spirit-tree/me`
  - `GET /spirit-tree/family`
  - `GET /spirit-tree/child/:childId`
  - `GET /spirit-tree/child/:childId/history`
  - `POST /spirit-tree/child/:childId/sync-yesterday`
  - `POST /spirit-tree/child/:childId`
  - `DELETE /spirit-tree/child/:childId`
  - `DELETE /spirit-tree/child/:childId/history/:snapshotDate`

## 6. Traceability
- E4-US30
  - `wish_cloud_layout.js`
  - `child_dashboard.js`
  - `parent_dashboard.js`
- E4-US31
  - `parent_dashboard.ejs`
  - `parent_dashboard.js`
  - `dashboardViewModel.js`
- E4-US32
  - `child_dashboard.js` (empty storage slot modal -> `/backpack`)
- Sprint 7 As-Built Extensions
  - Parent no-child CTA cards (Spirit Tree/Quest/Shop)
  - Parent child-scope tabs in Quest/Shop
  - Manifest-driven UI asset path injection in layout
