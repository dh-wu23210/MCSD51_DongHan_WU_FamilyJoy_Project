# FamilyJoy Code Structure Overview

## 1) Project Directory Map

```mermaid
flowchart TD
    ROOT[FamilyJoy_Development]

    ROOT --> DOCS[documents]
    ROOT --> WORKSPACE[workspace]

    WORKSPACE --> SRC[src]
    WORKSPACE --> TOOLS[tools]

    SRC --> SERVER[familyjoy_server]
    SRC --> CLIENT[familyjoy_client]
    SRC --> ADMIN[familyjoy_admin]

    CLIENT --> CLIENT_PUBLIC[public]
    CLIENT --> CLIENT_VIEWS[views]

    CLIENT_PUBLIC --> CLIENT_CSS[css]
    CLIENT_PUBLIC --> CLIENT_JS[js]
    CLIENT_PUBLIC --> CLIENT_ASSETS[assets]

    SERVER --> SERVER_ROUTES[routes]
    SERVER --> SERVER_CONTROLLERS[controllers]
    SERVER --> SERVER_SERVICES[services]
    SERVER --> SERVER_VM[viewModels]
    SERVER --> SERVER_MODELS[models]
    SERVER --> SERVER_MW[middleware]
    SERVER --> SERVER_CFG[config]

    ADMIN --> ADMIN_SERVER[server]
    ADMIN --> ADMIN_VIEWS[views]
    ADMIN --> ADMIN_PUBLIC[public]

    ADMIN_SERVER --> ADMIN_ROUTES[routes]
    ADMIN_SERVER --> ADMIN_CONTROLLERS[controllers]
    ADMIN_SERVER --> ADMIN_SERVICES[services]

    TOOLS --> DB_TASKS[db_tasks]
    TOOLS --> TEST_DATA[test_data]
```

## 2) Main App Runtime Interaction (SSR MVC Pattern)

```mermaid
flowchart LR
    U[Browser]
    U --> R[routes]
    R --> C[controllers]
    C --> S[services]
    S --> M[models / db connector]
    M --> DB[(MySQL)]

    C --> VM[viewModels]
    VM --> V[views - EJS]
    V --> U

    R --> MW[middleware]
    MW --> C
```

## 3) Admin Runtime Interaction

```mermaid
flowchart LR
    AU[Admin Browser]
    AU --> AR[admin routes]
    AR --> AC[admin controllers]
    AC --> AS[admin services]
    AS --> DB[(MySQL)]
    AC --> AV[admin EJS views]
    AV --> AU
```

## Notes
- `familyjoy_client/public` contains static frontend assets (CSS, JS, image assets).
- `familyjoy_server/services` is the main business logic layer.
- `familyjoy_server/routes` defines URL entry points and request mapping.
- `familyjoy_server/controllers` coordinates request/response and delegates logic to services.
- `familyjoy_admin` is isolated for admin portal pages and server flow.
- `tools` provides DB utility tasks and test data seeding scripts.
