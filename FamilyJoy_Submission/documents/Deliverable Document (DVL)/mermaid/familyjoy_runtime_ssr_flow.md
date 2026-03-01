# FamilyJoy Main Runtime SSR Flow

```mermaid
flowchart LR
    B[Browser Request]
    R[Express Routes]
    MW[Middleware]
    C[Controllers]
    S[Services]
    REP[Repositories]
    DB[(MySQL)]
    VM[ViewModels]
    V[EJS Views]
    RES[Rendered HTML Response]

    B --> R
    R --> MW
    MW --> C
    C --> S
    S --> REP
    REP --> DB

    C --> VM
    VM --> V
    V --> RES
    RES --> B

    S -. business rules .-> VM
    MW -. session / access control .-> C
```

## Notes
- The application follows an SSR request-response pattern rather than a SPA runtime.
- Middleware handles session and access checks before requests reach controllers.
- Controllers coordinate data from services and pass rendered data to EJS views through view models.
- MySQL is used as the persistent data store behind repository calls.
