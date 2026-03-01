# Sprint 6 TDD - Overview

## 1. Scope
Implements backend hardening and documentation alignment without introducing new user-facing modules.

Included
- Shared access guard service for family-scope checks.
- Session regeneration in login and register-family auto-login flows.
- Conditional quest review update to enforce idempotent reward issuance.
- Transactional family creation (family + admin user) for atomicity.
- Mobile app shell standardization for navigated pages with fixed header/footer and module-level scroll boundaries.
- Frontend CSS architecture split (`app_tokens.css`, `app_base.css`, `app_layout.css`, `app_modal.css`, `app_utilities.css`) and deprecation of active `shell.css` loading.
- Child Backpack standalone route/view (`/backpack`) with dedicated page script and bottom-nav integration.
- Quest assign modal data model update for day/category-filtered selectable quest definitions.
- Quest assign modal UI replacement from native selects to category grid + list selection.
- Quest definition soft-delete (archive) flow from Quest Book Edit modal.
- Quest category constants centralization (`constants/questCategories.js`) consumed by validator/service/view-model.

## 2. Modules
- Services: `accessGuard`, `questService`, `rewardService`, `wishService`, `authService`
- Controllers: `authController`, `shopController`, `wishController`, `questController`
- Repositories: `questRepo`, `familyRepo`, `userRepo`
- Controllers: `dashboardController` (`getChildBackpack`)
- ViewModels: `dashboardViewModel` (`buildChildBackpackViewModel`), `questViewModel` (`assignOptionsByDay`, `assignCategoriesByDay`)
- Constants: `constants/questCategories.js`
- Client Views: `layouts/navigated_layout.ejs`, `partials/navigation.ejs`, `pages/backpack/child_backpack.ejs`, `pages/quest/quest_home.ejs`
- Client Scripts: `public/js/pages/child_backpack.js`, `public/js/pages/quest_assign.js`, `public/js/pages/quest_home.js`, `public/js/modules/confirm.js`

## 3. Integration Notes
- Existing security-hardening routes remain in place.
- New child route `/backpack` is added; existing Spirit Tree flow remains available.
- Bottom nav rendering changed to equal-width strategy independent of item count.
- Hardening is applied in service/controller/repository layers; UI alignment applied in layout/view/page-script layers.

## 4. Traceability Matrix
### E3-US21 - Quest Definition Delete (Archive)
- Route: `POST /quest/book/delete/:id` (`routes/quest.js`)
- Controller: `questController.postDeleteQuest`
- Service: `questService.archiveQuestDefinition`
- Repository: `questRepo.archiveDefinition`, `questRepo.getDefinitionsByFamily` (`status='active'` filter)
- Client View: `views/pages/quest/quest_home.ejs` (Edit Quest modal delete action)
- Client Script: `public/js/pages/quest_home.js` (bind delete `formaction` by quest id)
- Client Confirm: `public/js/modules/confirm.js` (`requestSubmit(submitter)` support)

### E3-US22 - Assign Modal Category Grid + Quest List
- ViewModel: `questViewModel.buildQuestAssignViewModel` (`assignOptionsByDay`, `assignCategoriesByDay`)
- Client View: `views/pages/quest/quest_home.ejs` (`#assignQuestCategoryButtons`, `#assignQuestDefinitionList`)
- Client Script: `public/js/pages/quest_assign.js` (category button state, quest list selection, placeholder item, submit enable/disable)
- Client Style: `public/css/quest.css` (fixed modal height, list scroll region, equal-width category grid)
- Behavior: category grid renders full predefined category set; quest list remains filtered by selected category/day.

### E3-US23 - Quest Category Single Source
- Constants: `constants/questCategories.js` (`QUEST_CATEGORIES`)
- Validator: `validators/questValidator.js` (category validation source)
- Service: `services/questService.js` (`getCategoryList` source)
- ViewModel: `viewModels/questViewModel.js` (category list generation source)

### E3-US20 (Updated) - Assign Constraints and Efficiency
- Controller: `questController.postAssignQuest`
- Validator: `validateAssignQuest`, `validateQuestDefinition` (`baseCrystals: 1..100`)
- Service: `questService.assignQuest` (duplicate assignment rejection)
- Repository: `questRepo.findDailyQuest`

## 5. Out of Scope
- API contract standardization across all JSON routes.
- New schema entities.
