# Sprint 1 TDD - Auth and Session Management

## 1. Overview & Scope
Implements session-based authentication, login validation, and role-based redirects.

## 2. Architecture (Mermaid)
```mermaid
flowchart LR
  Client --> AuthController
  AuthController --> AuthService
  AuthService --> UserRepo
  AuthController --> SessionStore
```

## 3. Module Responsibilities
- AuthController: request handling and redirects.
- AuthService: login validation and session user creation.
- UserRepo: DB access.
- SessionStore: MySQL-backed sessions.

## 4. Data Model / ERD (Mermaid)
```mermaid
erDiagram
  users {
    char(36) id PK
    varchar username
    varchar password_hash
    enum role
    enum status
    tinyint is_admin
  }
  sessions {
    varchar session_id PK
    text data
    datetime expires
  }
```

## 5. API / Route Contracts
- GET /login
- POST /login
- GET /logout

## 6. Validation Rules
- Username and password required.

## 7. State Machine (Mermaid)
```mermaid
stateDiagram-v2
  [*] --> LoggedOut
  LoggedOut --> LoggedIn: login success
  LoggedIn --> MustChangePassword: initial password or reset
  MustChangePassword --> LoggedIn: password changed (forced)
  LoggedIn --> LoggedOut: logout
```

## 8. Sequence Flow (Mermaid)
```mermaid
sequenceDiagram
  participant U as User
  participant C as AuthController
  participant S as AuthService
  participant R as UserRepo
  U->>C: POST /login
  C->>S: login(username, password)
  S->>R: findByUsername
  R-->>S: user
  S-->>C: sessionUser
  C-->>U: redirect
```

## 9. Error Handling
- Invalid credentials render login with error.
- Database errors render login with error.

## 10. Security & Access Control
- Session-based auth only.
- CSRF intentionally not used.

## 11. Operational Notes
- Session cleanup managed by MySQL store.

## 12. Out of Scope
- MFA, OAuth.

## 13. Open Questions
- None.
