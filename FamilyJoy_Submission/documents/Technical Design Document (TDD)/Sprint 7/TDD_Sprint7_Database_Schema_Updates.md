# Sprint 7 TDD - Database Schema Updates

## 1. Scope
Sprint 7 adds Spirit Tree persistence to support:
- Child current tree state rendering
- Parent all-children Spirit Tree rendering
- Historical state trace by date

## 2. New Table: child_spirit_tree
Fields:
- `child_id` (PK, FK -> `users.id`)
- `family_id` (FK -> `families.id`)
- `state` (`withered` | `sicked` | `healthy`)
- `completion_rate` (`0..100`)
- `source_date` (date used for this computed state)
- `last_calculated_at`
- `created_at`
- `updated_at`

Indexes:
- `PRIMARY KEY (child_id)`
- `idx_cst_family (family_id)`
- `idx_cst_source_date (source_date)`

## 3. New Table: child_spirit_tree_daily
Fields:
- `id` (PK, auto increment)
- `child_id` (FK -> `users.id`)
- `family_id` (FK -> `families.id`)
- `snapshot_date`
- `state` (`withered` | `sicked` | `healthy`)
- `completion_rate` (`0..100`)
- `created_at`
- `updated_at`

Indexes:
- `PRIMARY KEY (id)`
- `UNIQUE uk_cstd_child_date (child_id, snapshot_date)`
- `idx_cstd_family_date (family_id, snapshot_date)`

## 4. Migration Source
- `workspace/tools/migrate-sprint7-schema.sql`

## 5. Execution
Run from repository root:

```bash
node workspace/tools/db-migrate.js workspace/tools/migrate-sprint7-schema.sql
```

## 6. Compatibility Notes
- No destructive change to existing tables.
- Existing dashboard behavior remains compatible: if no tree row exists, service computes from yesterday completion and upserts.
- Existing user/wish/quest flows are not blocked by this migration.
