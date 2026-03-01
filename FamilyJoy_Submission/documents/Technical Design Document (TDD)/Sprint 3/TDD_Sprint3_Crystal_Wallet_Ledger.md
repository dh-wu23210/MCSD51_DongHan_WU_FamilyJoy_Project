# Sprint 3 TDD - Crystal Wallet and Ledger

## 1. Overview
Shows crystal balance in header and records ledger entries in DB (no UI).

## 2. Wallet Update Rules
- Earn: add crystals and write ledger `quest_reward`.
- Spend: subtract crystals and write ledger `purchase`.

## 3. Ledger Fields
- `user_id`, `amount`, `type`, `source_id`, `created_at`.

## 4. Header Display
- Read `users.crystal_balance` and render in top-center header for child only.

## 5. Out of Scope
- Ledger UI, export, or analytics.
