# Sprint 5 TDD - Overview

## 1. Scope
Implements the minimal wish loop using backpack items.

Included
- Child makes wish from a backpack item (consumes quantity immediately)
- Parent accepts wish with confirmation
- Wish removed from both child and parent views
- Notifications sent to both parent and child

## 2. Roles
- Child: create wish from own backpack
- Parent: view and accept wishes for children in same family

## 3. Modules
- Controllers: Spirit Tree (parent/child), wish actions
- Services: wish creation, wish acceptance
- Repositories: wish persistence, backpack update
- Views: Spirit Tree UI + modals

## 4. Out of Scope
- Wish descriptions
- Essence / health / fruit trays
