# Sprint 4 PRD - Reward Icons (Bootstrap)

## 1. Background / Problem
Reward icons are currently text-based and need to display real icons.

## 2. Goals & Non-Goals
**Goals**
- Render reward icons using Bootstrap Icons.
- Use existing icon key list from Sprint 3.

**Non-Goals**
- Image upload or custom icons.

## 3. Personas & Roles
- Parent
- Child

## 4. User Stories / Jobs
- As a parent, I can see a real icon for each reward.
- As a child, I can see a real icon for each reward.

## 5. Functional Requirements
- Map icon keys to Bootstrap Icons classes.
- Render icons in Reward Library and Child Shop list.
- When selecting an icon, show a 5x5 icon grid for the parent to choose from.
- Interaction: click icon to select; closing the modal submits and writes to DB.

## 6. Icon Mapping (Suggested)
| Icon Key | Bootstrap Icon Class |
| --- | --- |
| gift | bi-gift |
| book | bi-book |
| game | bi-controller |
| sports | bi-trophy |
| snack | bi-cup-straw |
| outdoor | bi-tree |
| music | bi-music-note-beamed |
| art | bi-palette |
| pet | bi-paw |
| star | bi-star |

## 7. Out of Scope
- Uploading custom images.
