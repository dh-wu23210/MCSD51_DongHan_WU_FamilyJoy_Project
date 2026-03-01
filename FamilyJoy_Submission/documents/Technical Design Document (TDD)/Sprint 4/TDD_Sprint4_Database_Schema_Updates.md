# Sprint 4 TDD - Database Schema Updates

## 1. Overview
Adds `mailbox_messages` table to persist mailbox messages.

## 2. Migration (SQL)
```sql
CREATE TABLE IF NOT EXISTS mailbox_messages (
  id CHAR(36) NOT NULL,
  user_id CHAR(36) NOT NULL,
  type ENUM('crystal_earn','crystal_spend','quest_failed') NOT NULL,
  amount INT NOT NULL,
  source_id CHAR(36) NULL,
  title VARCHAR(80) NOT NULL,
  message VARCHAR(200) NOT NULL,
  is_read TINYINT(1) NOT NULL DEFAULT 0,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP(),
  PRIMARY KEY (id),
  KEY idx_user (user_id),
  KEY idx_user_read (user_id, is_read),
  CONSTRAINT fk_mailbox_messages_user FOREIGN KEY (user_id) REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

## 3. Notes
- `amount` is 0 for `quest_failed`.
- No backfill required.
