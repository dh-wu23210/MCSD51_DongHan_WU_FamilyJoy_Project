# FamilyJoy Core Use Case Diagram

```mermaid
flowchart LR
    P[Parent]
    C[Child]

    subgraph SYS[FamilyJoy Main System]
        direction LR
        U1([Register family])
        U4([Manage members])
        U5([View family / profile])

        U2([Login / logout])
        U3([Change first password])

        U6([Create quest template])
        U7([Assign quest])
        U8([View quests])
        U9([Submit completion])
        U10([Review submission])

        U11([Manage rewards])
        U12([Use shop])
        U13([View backpack])
        U14([Create wish])
        U15([View spirit tree])

        U16([View calendar])
        U17([View mailbox])

        U1 --- U4 --- U5
        U2 --- U3
        U6 --- U7 --- U8 --- U9 --- U10
        U11 --- U12 --- U13 --- U14 --- U15
        U16 --- U17
    end

    %% force horizontal lanes
    P --- U1
    U10 --- C

    %% real use-case relationships
    P --> U1
    P --> U2
    P --> U4
    P --> U5
    P --> U6
    P --> U7
    P --> U10
    P --> U11
    P --> U15
    P --> U16
    P --> U17

    U2 --> C
    U3 --> C
    U8 --> C
    U9 --> C
    U12 --> C
    U13 --> C
    U14 --> C
    U15 --> C
    U16 --> C
    U17 --> C

    classDef actor fill:#f7f7f7,stroke:#333,stroke-width:1px;
    classDef usecase fill:#ffffff,stroke:#4a4a4a,stroke-width:1px;
    class P,C actor;
    class U1,U2,U3,U4,U5,U6,U7,U8,U9,U10,U11,U12,U13,U14,U15,U16,U17 usecase;
```

## Notes
- This version compresses similar use cases so the diagram fits better in a Word document.
- Parent and child still share some access and history functions, but their workflow responsibilities remain different.
- Admin governance has been separated into `familyjoy_admin_use_case_diagram.md`.
