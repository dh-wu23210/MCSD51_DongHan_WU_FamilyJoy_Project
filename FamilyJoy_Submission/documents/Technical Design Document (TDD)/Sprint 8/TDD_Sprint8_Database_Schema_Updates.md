# Sprint 8 TDD - Database Schema Updates (Admin MVP) (As-Built)

## 1. Scope
Sprint 8 introduces a dedicated admin identity table and keeps business-user data separate from admin credentials.

## 2. New Table
- `system_admins`
  - Purpose: store system admin credentials and admin account status independently from `users`.
  - Seeded by tools script, not by UI registration.
  - Core fields used by implementation:
    - `id`
    - `username`
    - `password_hash`
    - `status`
    - `last_login_at`
    - timestamps

Migration file:
- `workspace/tools/migrate-sprint8-admin-schema.sql`

## 3. Existing Tables Reused
- `users`
  - business user list query source (admin not stored here).
- `families`
  - family list and family detail query source.
- `sessions`
  - activity metrics source in MVP.

## 4. Admin Seed Script
- `workspace/tools/seed-admin-account.js`
  - ensures admin table exists if needed.
  - upserts admin credentials.
  - no admin registration endpoint/UI.

## 5. Audit Log Data
- MVP audit list uses existing event/audit source already available in current schema.
- Dedicated `admin_audit_logs` table remains deferred.

## 6. Deferred Schema Items
- Dedicated login-event fact table for more precise DAU/retention analytics.
- Dedicated admin audit table.
- Risk-control tables (rate limit/IP lock).
