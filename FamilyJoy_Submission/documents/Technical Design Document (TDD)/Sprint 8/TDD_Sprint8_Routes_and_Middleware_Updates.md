# Sprint 8 TDD - Routes and Middleware Updates (Admin) (As-Built)

## 1. Admin Route Surface
- Auth routes:
  - `GET /admin_login`
  - `POST /admin_login`
  - `POST /admin_logout`
- Admin pages:
  - `GET /admin`
  - `GET /admin/users`
  - `GET /admin/families`
  - `GET /admin/families/:familyId`
  - `GET /admin/audit-logs`

## 2. Access Rules
- Unauthenticated requests to admin pages redirect to `/admin_login`.
- Admin session is stored on `req.session.adminUser`.
- Non-admin business sessions cannot access admin pages.

## 3. Middleware (Implemented)
- `workspace/src/familyjoy_admin/server/middleware/admin_auth.js`
  - `requireAdminAuth`
  - validates `adminUser` session presence and system-admin flag.

## 4. App Wiring
- `workspace/src/familyjoy_server/app.js`
  - mounts admin routes early.
  - includes admin views directory in EJS view lookup.
  - serves admin static assets from `familyjoy_admin/public`.

## 5. Redirect Rules (Implemented)
- `GET /admin_login`
  - with valid admin session: redirect `/admin`
  - without admin session: render login page.
- login success: redirect `/admin`
- logout success: redirect `/admin_login`
