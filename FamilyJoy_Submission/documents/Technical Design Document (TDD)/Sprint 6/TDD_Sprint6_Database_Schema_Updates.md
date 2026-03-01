# Sprint 6 TDD - Database Schema Updates

## 1. Schema Changes
No new table/column/index is introduced in Sprint 6.

## 2. Data Integrity Updates (Implementation Level)
- Family creation flow now uses a DB transaction:
  - Insert `families`
  - Insert admin `users`
  - Commit/rollback as one unit
- Quest review flow uses conditional update:
  - Update status only when current status is `submitted`
  - Prevent duplicate reward issuance on repeated/concurrent reviews
- Quest definition delete behavior is soft delete using existing `quest_definitions.status`:
  - `active -> archived`
  - No table/column changes required
- Quest base crystals validation range aligned to `1..100` at application layer:
  - No schema change required

## 3. Migration Notes
- No migration SQL is required for Sprint 6 hardening changes.
- Existing data remains compatible.

## 4. Compatibility
- Works with current `familyjoy_db` schema.
- No backfill and no downtime required for this sprint scope.
