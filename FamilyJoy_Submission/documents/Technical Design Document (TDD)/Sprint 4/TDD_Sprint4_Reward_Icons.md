# Sprint 4 TDD - Reward Icons

## 1. Overview
Replace text icon labels with Bootstrap Icons in reward creation and lists.

## 2. Data Model
- `rewards.icon_key` stores a logical icon name

## 3. Icon Keys (Allowed)
- gift, book, game, sports, snack, outdoor, music, art, pet, star

## 4. Mapping
- `gift -> bi-gift`
- `book -> bi-book`
- `game -> bi-controller`
- `sports -> bi-trophy`
- `snack -> bi-cup-straw`
- `outdoor -> bi-tree`
- `music -> bi-music-note-beamed`
- `art -> bi-palette`
- `pet -> bi-paw`
- `star -> bi-star`

## 5. UI Updates
- Reward Library list shows icon element
- Child Shop list shows icon element
- Icon selection uses a 5x5 grid

## 6. Validation
- Icon key must be in allowed list
- Default: `gift`

## 7. Out of Scope
- Custom uploads
