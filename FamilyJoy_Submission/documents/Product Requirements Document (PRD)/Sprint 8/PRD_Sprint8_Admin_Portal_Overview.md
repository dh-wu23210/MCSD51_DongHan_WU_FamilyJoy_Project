# Sprint 8 PRD - Admin Portal (MVP) (As-Built)

## 1. Goal
Deliver a Bootstrap-based operations admin portal, isolated from the main FamilyJoy user flows, for system-level read/query and daily operations visibility.

## 2. Scope
Included:
- Dedicated admin login/logout/session flow.
- Admin dashboard as post-login home.
- Users list query page.
- Families list query page.
- Family detail page (from families drill-down).
- Audit logs list page.
- Fuzzy search + server-side pagination (10 rows per page).
- Responsive navigation behavior:
  - desktop: tab-style nav
  - mobile: collapsed menu

Not included:
- Fine-grained permissions (single system-admin role).
- CSV export.
- Risk alerts.
- Login rate limiting / IP lock.

## 3. Entry and Navigation
- Login URL: `/admin_login`
- Portal URLs: `/admin`, `/admin/users`, `/admin/families`, `/admin/families/:familyId`, `/admin/audit-logs`
- Unauthenticated access to admin pages redirects to `/admin_login`.
- Login success redirects to `/admin` (Dashboard).
- Top navigation items:
  - Dashboard
  - Users
  - Families
  - Audit Logs
  - Logout

## 4. Functional Requirements

### FR-8.1 Admin Authentication
- Admin account is provisioned by DB seed script only (no UI registration).
- Login uses username/password from dedicated admin table.
- Successful login creates admin session (`adminUser`).
- Logout clears admin session.

### FR-8.2 Dashboard Metrics (Natural Day, Server Timezone)
- Total users (non-admin business users).
- Total families.
- Active users today.
- Active families today.
- New users today.
- New families today.
- 7-day active-user trend (most recent day first).

### FR-8.3 Users Page
- Search bar above table.
- Fuzzy query by username and family name (independent or combined).
- Pagination: 10 rows per page.

### FR-8.4 Families Page
- Search bar above table.
- Fuzzy query by family name and username.
- Pagination: 10 rows per page.
- Drill-down to Family Detail page.

### FR-8.5 Family Detail Page
- Family summary card.
- Member list table (username, nickname, role, status, created time).

### FR-8.6 Audit Logs Page
- Search bar above table.
- Query by username/family name keywords.
- Pagination: 10 rows per page.

## 5. UX and Tech Constraints
- Bootstrap-first implementation (container/card/table/form/nav tabs).
- Admin CSS/JS extracted to:
  - `familyjoy_admin/public/css/admin_base.css`
  - `familyjoy_admin/public/js/admin_base.js`
- No custom complex widgets.
- Keep complexity aligned with course baseline.

## 6. Acceptance Criteria (As-Built)
- Admin login at `/admin_login` works end-to-end.
- Admin pages are session-protected and isolated from normal app login.
- Dashboard metrics load correctly with natural-day server-time rules.
- Users/Families/Audit support fuzzy search + 10-row pagination.
- Family detail drill-down works.
