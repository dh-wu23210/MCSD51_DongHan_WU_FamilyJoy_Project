# Sprint 5 TDD - Database Schema Updates

## 1. New Table: wishes
Fields
- `id` (PK, uuid)
- `child_id` (FK users.id)
- `family_id` (FK families.id)
- `reward_id` (FK rewards.id)
- `slot_code` (A?F)
- `status` (`open` | `accepted`)
- `created_at`
- `accepted_at` (nullable)

## 2. Indexes
- `idx_wishes_child_status` (`child_id`, `status`)
- `idx_wishes_family_status` (`family_id`, `status`)

## 3. Migration Notes
- No backfill required
- Existing backpack data unchanged
