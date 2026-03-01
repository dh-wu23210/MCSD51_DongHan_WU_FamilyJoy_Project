# Sprint 5 TDD - Wish Flow

## 1. Child Wish Creation
Endpoint
- `POST /wishes`

Inputs
- `reward_id`

Steps
1. Validate reward exists and belongs to child backpack with quantity > 0.
2. Determine next available slot (A?F order).
3. Insert wish row with `status=open`.
4. Decrement backpack quantity by 1.
5. If quantity becomes 0, remove item from grid.

Rules
- If grid full: return error `Wish grid full`.
- Modal is reused; UI updates without reopening.

## 2. Parent Accepts Wish
Endpoint
- `POST /wishes/:id/accept`

Inputs
- `wish_id`

Steps
1. Validate wish belongs to parent?s family and is `open`.
2. Confirm action (client-side confirmation modal).
3. Update wish status to `accepted`, set `accepted_at`.
4. Send mailbox messages to child and parent.

## 3. Mailbox Messages
Type: `wish_accepted`
- Title: `Wish Accepted`
- Message: `Your wish "{itemName}" was accepted.`

## 4. Error Handling
- Invalid reward: 404
- Insufficient quantity: 400
- Wish already accepted: 409
