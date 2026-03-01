# FamilyJoy Admin Use Case Diagram

```mermaid
flowchart LR
    A[Admin]

    subgraph SYS[FamilyJoy Admin Portal]
        direction TB
        U1([Admin login])
        U2([View dashboard])
        U3([Browse users])
        U4([Browse families])
        U5([View audit logs])
    end

    A --> U1
    A --> U2
    A --> U3
    A --> U4
    A --> U5

    classDef actor fill:#f7f7f7,stroke:#333,stroke-width:1px;
    classDef usecase fill:#ffffff,stroke:#4a4a4a,stroke-width:1px;
    class A actor;
    class U1,U2,U3,U4,U5 usecase;
```

## Notes
- This diagram separates admin governance behaviour from the family-facing workflow.
- It is suitable for report sections that explain admin access, monitoring, and governance visibility.
- It can also be used in place of the admin subsection of the larger core use case diagram when a smaller figure is needed.
