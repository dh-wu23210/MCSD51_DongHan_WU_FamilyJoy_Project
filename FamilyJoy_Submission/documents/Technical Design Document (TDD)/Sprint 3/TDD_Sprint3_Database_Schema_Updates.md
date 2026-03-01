# Sprint 3 TDD - Database Schema Updates

## 1. Overview
Adds reward shop, backpack, and crystal ledger tables. Replaces gold/gem balances with crystal balance.

## 2. Migration Plan (SQL)
```sql
-- 1) Users: replace gold/gem with crystal
ALTER TABLE users
  ADD COLUMN crystal_balance INT NOT NULL DEFAULT 0 AFTER status,
  DROP COLUMN gold_balance,
  DROP COLUMN gem_balance;

-- 1b) Quest definitions: replace gold/gem rewards with base crystals
ALTER TABLE quest_definitions
  ADD COLUMN base_crystals INT NOT NULL DEFAULT 0 AFTER description,
  DROP COLUMN gold_reward,
  DROP COLUMN gem_reward;

-- 2) Reward library
CREATE TABLE IF NOT EXISTS rewards (
  id CHAR(36) NOT NULL,
  family_id CHAR(36) NOT NULL,
  name VARCHAR(50) NOT NULL,
  description VARCHAR(120) NOT NULL,
  icon_key VARCHAR(32) NOT NULL,
  price INT NOT NULL,
  status ENUM('active','inactive') NOT NULL DEFAULT 'active',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP(),
  PRIMARY KEY (id),
  KEY idx_family (family_id),
  CONSTRAINT fk_rewards_family FOREIGN KEY (family_id) REFERENCES families(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3) Per-child shop assignment (visibility + quantity)
CREATE TABLE IF NOT EXISTS reward_child_assignments (
  id CHAR(36) NOT NULL,
  reward_id CHAR(36) NOT NULL,
  child_id CHAR(36) NOT NULL,
  quantity INT NOT NULL DEFAULT 0,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP(),
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP(),
  PRIMARY KEY (id),
  UNIQUE KEY uk_reward_child (reward_id, child_id),
  KEY idx_child (child_id),
  CONSTRAINT fk_rca_reward FOREIGN KEY (reward_id) REFERENCES rewards(id),
  CONSTRAINT fk_rca_child FOREIGN KEY (child_id) REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4) Backpack items (owned)
CREATE TABLE IF NOT EXISTS child_backpack_items (
  id CHAR(36) NOT NULL,
  child_id CHAR(36) NOT NULL,
  reward_id CHAR(36) NOT NULL,
  quantity INT NOT NULL DEFAULT 0,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP(),
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP(),
  PRIMARY KEY (id),
  UNIQUE KEY uk_child_reward (child_id, reward_id),
  KEY idx_child (child_id),
  CONSTRAINT fk_cbi_child FOREIGN KEY (child_id) REFERENCES users(id),
  CONSTRAINT fk_cbi_reward FOREIGN KEY (reward_id) REFERENCES rewards(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5) Crystal ledger (DB-only)
CREATE TABLE IF NOT EXISTS crystal_ledger (
  id CHAR(36) NOT NULL,
  user_id CHAR(36) NOT NULL,
  amount INT NOT NULL,
  type ENUM('quest_reward','purchase') NOT NULL,
  source_id CHAR(36) NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP(),
  PRIMARY KEY (id),
  KEY idx_user (user_id),
  CONSTRAINT fk_ledger_user FOREIGN KEY (user_id) REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

## 3. Notes
- `amount` is positive for earn, negative for spend (or use sign by type in service).
- `source_id` references `daily_quests.id` for quest rewards and `rewards.id` for purchases.
- Migration policy: crystal balance and base crystals are reset to 0 (no data carryover from gold/gem).
