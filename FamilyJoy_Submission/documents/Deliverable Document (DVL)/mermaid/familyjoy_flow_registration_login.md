# FamilyJoy Registration to Login Flow (Family Admin and Family Members)

```mermaid
flowchart TD
    A[User opens Register Family page] --> B[Submit family name, family code, admin username, password]
    B --> C{Validation passed?}
    C -->|No| D[Show validation errors and stay on register page]
    C -->|Yes| E[Create family record]
    E --> F[Create Family Admin account]
    F --> G[Auto-login as Family Admin]
    G --> H[Family Admin lands on app home]

    H --> I[Family Admin opens Family Management]
    I --> J[Create member account: Parent or Child]
    J --> K[System generates member username and default password]
    K --> L[Member receives credentials]

    L --> M[Member opens Login page]
    M --> N[Enter username and password]
    N --> O{Credentials valid?}
    O -->|No| P[Show login error]
    O -->|Yes| Q[Create user session]
    Q --> R{Is first login or reset-required?}
    R -->|Yes| S[Force change password modal]
    S --> T[Save new password]
    T --> U[Redirect to role home page]
    R -->|No| U

    U --> V{Role}
    V -->|Parent| W[Parent dashboard and management flows]
    V -->|Child| X[Child dashboard and task flows]
```

## Notes
- Family Admin is created during family registration.
- Family members are created by Family Admin inside Family Management.
- Member first login can require password change based on account policy.
- Successful login always establishes a role-based session.
