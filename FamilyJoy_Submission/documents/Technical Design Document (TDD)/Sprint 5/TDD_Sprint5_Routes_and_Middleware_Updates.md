# Sprint 5 TDD - Routes and Middleware Updates

## 1. Routes
Child
- `POST /wishes` create wish
- `GET /wishes/me` list open wishes (child)

Parent
- `POST /wishes/:id/accept` accept wish
- `GET /wishes/child/:childId` list open wishes for child

## 2. Middleware
- `requireAuth`
- `requirePasswordChange`
- Child routes: `requireRole(['child'])`
- Parent routes: `requireRole(['parent'])`
