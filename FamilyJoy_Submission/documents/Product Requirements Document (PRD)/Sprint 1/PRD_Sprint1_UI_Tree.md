# Sprint 1 PRD - UI Page Tree

## 1. Overview
Initial Sprint 1 pages for authentication and family management.

## 2. Page Tree (Mermaid)
```mermaid
flowchart LR
  Login --> CreateFamily
  Login --> ParentHome
  Login --> ChildHome
  ParentHome --> FamilyMembers
  FamilyMembers --> AddMemberModal
  ParentHome --> Profile
  ChildHome --> Profile
```

## 3. Out of Scope
- Quest pages (Sprint 2).
