# Sprint 4 TDD - Routes and Middleware Updates

## 1. Routes
Calendar
- `GET /calendar` (parent & child)

Mailbox
- `GET /mailbox` (parent & child)
- `GET /mailbox/data` (parent & child)
- `GET /mailbox/summary` (parent & child)
- `POST /mailbox/mark-read` (parent & child)
- `POST /mailbox/mark-read/:id` (parent & child)

## 2. Middleware
- `requireAuth`
- `requirePasswordChange`
- `requireRole(['parent','child'])`
