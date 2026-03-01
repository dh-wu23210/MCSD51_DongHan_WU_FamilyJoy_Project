# Sprint 2 PRD - UI Page Tree

## 1. Overview
Sprint 2 introduces Quest management and delayed delete for family members.

## 2. Page Tree (Mermaid)
```mermaid
flowchart LR
  Login --> ParentHome
  Login --> ChildHome
  ParentHome --> QuestHome
  QuestHome --> QuestBook
  QuestHome --> QuestAssign
  QuestHome --> SubmissionsList
  ParentHome --> FamilyMembers
  FamilyMembers --> AddMemberModal
  ParentHome --> Profile
  ChildHome --> QuestHome
  ChildHome --> QuestDetail
```

## 3. Out of Scope
- Rewards flow
- Notifications
