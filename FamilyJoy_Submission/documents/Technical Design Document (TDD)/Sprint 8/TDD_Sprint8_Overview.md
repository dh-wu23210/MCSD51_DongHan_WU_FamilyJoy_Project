# Sprint 8 TDD - Admin Portal (MVP) (As-Built)

## 1. Scope
Sprint 8 delivers a server-rendered admin portal using Express + EJS + Bootstrap with dedicated admin module separation under:
- `workspace/src/familyjoy_admin/*`

Included:
- Admin authentication/session.
- Dashboard metrics aggregation.
- Users/Families/Audit query pages.
- Family detail view.
- Search + pagination.
- Responsive admin navigation (desktop tabs / mobile collapse).

Excluded:
- CSV export.
- fine-grained permissions.
- risk alerts.
- login throttling/IP lock.

## 2. Architecture Approach
- Single service deployment (same app/port), route isolation by admin route set.
- Dedicated admin module folders (server + views + public assets).
- Dedicated admin identity table (`system_admins`) rather than mixing with normal users.
- Bootstrap-first page composition with admin-specific CSS/JS assets.

## 3. Implemented Modules (As-Built)

### 3.1 App Wiring
- `workspace/src/familyjoy_server/app.js`
  - registers admin views dir and static dir
  - mounts admin routes early

### 3.2 Admin Server Layer
- `workspace/src/familyjoy_admin/server/routes/admin_routes.js`
- `workspace/src/familyjoy_admin/server/controllers/admin_controller.js`
- `workspace/src/familyjoy_admin/server/services/admin_service.js`
- `workspace/src/familyjoy_admin/server/repositories/admin_repository.js`
- `workspace/src/familyjoy_admin/server/middleware/admin_auth.js`

### 3.3 Admin Views and Assets
- Layout:
  - `workspace/src/familyjoy_admin/views/layouts/admin_layout.ejs`
- Pages:
  - `workspace/src/familyjoy_admin/views/pages/admin_login.ejs`
  - `workspace/src/familyjoy_admin/views/pages/admin_dashboard.ejs`
  - `workspace/src/familyjoy_admin/views/pages/admin_users.ejs`
  - `workspace/src/familyjoy_admin/views/pages/admin_families.ejs`
  - `workspace/src/familyjoy_admin/views/pages/admin_family_detail.ejs`
  - `workspace/src/familyjoy_admin/views/pages/admin_audit_logs.ejs`
- Partials:
  - `workspace/src/familyjoy_admin/views/partials/admin_pagination.ejs`
- Public assets:
  - `workspace/src/familyjoy_admin/public/css/admin_base.css`
  - `workspace/src/familyjoy_admin/public/js/admin_base.js`

## 4. Route Contract (As-Built)
- Auth:
  - `GET /admin_login`
  - `POST /admin_login`
  - `POST /admin_logout`
- Portal:
  - `GET /admin`
  - `GET /admin/users`
  - `GET /admin/families`
  - `GET /admin/families/:familyId`
  - `GET /admin/audit-logs`

## 5. Data and Time Rules
- Timezone: server local timezone.
- Natural-day aggregation for daily metrics.
- Page size: 10.
- Trend table order: most recent date first.

## 6. Search and Pagination Contract
- Query parameters:
  - `qUser`
  - `qFamily`
  - `page`
- Matching:
  - fuzzy (`LIKE`) for username and/or family name.
- Pagination:
  - server-side total + page metadata.

## 7. Provisioning
- Admin account seeded by:
  - `workspace/tools/seed-admin-account.js`
- No admin registration UI.
