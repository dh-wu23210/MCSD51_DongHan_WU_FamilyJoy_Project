# Sprint 4 TDD - Mailbox

## 1. Overview
Mailbox modal for crystal earn/spend + quest failed messages.

## 2. Message Types
- `crystal_earn` (quest completion)
- `crystal_spend` (reward purchase)
- `quest_failed` (parent marks incomplete)

## 3. Write Triggers
- Quest completion -> crystal_earn
- Reward purchase -> crystal_spend
- Quest marked incomplete -> quest_failed

## 4. Routes
- `GET /mailbox` (SSR fallback)
- `GET /mailbox/data` (JSON list)
- `GET /mailbox/summary` (unread count)
- `POST /mailbox/mark-read` (mark all)
- `POST /mailbox/mark-read/:id` (mark one)

## 5. Payloads
- `/mailbox/data` response:
  - `{ messages: [{ id, title, message, amount, created_at, is_read }] }`
- `/mailbox/summary` response:
  - `{ unreadCount }`

## 6. UI Behavior
- Header mailbox icon opens modal (no page navigation)
- Unread badge (red dot) shows if unreadCount > 0
- Each item is clickable
  - Unread shows `NEW` badge
  - Read shows no badge
- Clicking item marks read and updates badge

## 7. Error Handling
- If fetch fails: show error modal
- If mark-read fails: silently ignore and retry on refresh

## 8. De-dup
- One notification per successful event
