# Sprint 3 TDD - Routes and Middleware Updates

## 1. Overview & Scope
Defines routes for reward management, child shop, and wallet updates.

## 2. Route Contracts
Parent:
- GET /shop
- GET /shop/library
- GET /shop/assign/:childId
- POST /shop/reward/create
- POST /shop/reward/edit/:id
- POST /shop/reward/toggle/:id
- POST /shop/reward/assign
- POST /shop/reward/assign/update

Child:
- GET /child/shop
- POST /child/shop/buy/:rewardId

Shared:
- Header balance rendered on authenticated layouts.

## 3. Middleware
- requireAuth
- requirePasswordChange
- requireRole(['parent']) for parent shop
- requireRole(['child']) for child shop

## 4. Validation
- Use feature validators per route.

## 5. Error Handling
- Redirect with query error parameters, toast messages.
