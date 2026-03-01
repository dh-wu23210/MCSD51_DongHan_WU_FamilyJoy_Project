# FamilyJoy Problem Domain Sketch

```mermaid
flowchart TD
    F[Family]

    F --> P[Parent Role]
    F --> C[Child Role]
    F --> A[Admin Role \n system governance boundary]

    P --> QM[Quest Management]
    P --> RM[Reward Management]
    P --> FM[Family Management]
    P --> RV[Review and Decision]

    C --> MQ[My Quests]
    C --> SH[Shop]
    C --> BP[Backpack]
    C --> WS[Wishes]
    C --> ST[Spirit Tree]
    C --> MB[Mailbox]
    C --> CL[Calendar]

    QM --> DQ[Daily Quests]
    RV --> DQ
    MQ --> DQ

    RM --> CR[Crystal Ledger]
    SH --> CR
    DQ --> CR

    SH --> RI[Reward Items]
    RI --> BP
    BP --> WS
    WS --> ST

    DQ --> CL
    RV --> MB
    WS --> MB
    SH --> MB

    A -. monitors .-> F
    A -. reviews .-> UL[Users]
    A -. reviews .-> FL[Families]
    A -. reviews .-> LG[Audit Logs]
```

## Notes
- `Family` is the top-level ownership boundary for most business data.
- `Parent` controls assignment, review, and reward management.
- `Child` interacts with quests, rewards, backpack items, wishes, and the spirit tree.
- `Admin` is outside the family workflow and focuses on operational governance.
