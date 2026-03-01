# Sprint 2 TDD - Database Schema Updates

## 1. Overview & Scope
Adds quest tables and user fields for admin flag and delayed delete.

## 2. Data Model / ERD (Mermaid)
```mermaid
erDiagram
  families {
    char(36) id PK
    varchar family_code
  }
  users {
    char(36) id PK
    char(36) family_id FK
    enum role
    enum status
    tinyint is_admin
    datetime disabled_at
    datetime delete_after
  }
  quest_definitions {
    char(36) id PK
    char(36) family_id FK
    enum category
    enum status
  }
  daily_quests {
    char(36) id PK
    char(36) child_id FK
    char(36) quest_definition_id FK
    date target_date
    enum status
  }
  families ||--o{ users : has
  families ||--o{ quest_definitions : has
  quest_definitions ||--o{ daily_quests : defines
  users ||--o{ daily_quests : assigned
```

## 3. Schema Changes
- users: add is_admin, gold_balance, gem_balance, disabled_at, delete_after
- role normalized to enum('parent','child')

## 4. New Tables
- quest_definitions
- daily_quests

## 5. Migration Script
See `workspace/tools/migrate-sprint2-schema.sql`.

## 6. Out of Scope
- Rewards logic.
