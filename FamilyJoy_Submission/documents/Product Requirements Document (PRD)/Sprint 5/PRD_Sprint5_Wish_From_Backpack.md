# Sprint 5 PRD - Wish From Backpack

## 1. Background / Problem
Children can buy items but cannot consume them. Sprint 5 adds a simple wish loop.

## 2. Goals & Non-Goals
Goals
- Allow a child to make a wish from a backpack item.
- Allow a parent to accept a child wish.
- Remove the wish from both sides after acceptance.
- Notify both parent and child after acceptance.

Non-Goals
- Child-written wish descriptions.
- Wish tree health, fruit trays, essence.

## 3. Personas & Roles
- Parent
- Child

## 4. User Stories / Jobs
- As a child, I can make a wish using a backpack item.
- As a parent, I can accept a child wish.

## 5. Layout (Child Spirit Tree)
Section A (top)
- A1: animated tree image.
- A2: wish grid, 2 columns x 3 rows, labeled A-F.

Section B (bottom)
- Backpack grid with 6 columns.
- Rows = ceil(itemTypes / 6), with a minimum visible area of 6x3.
- Default visible height is 3 rows; only B section scrolls.
- Empty slots are shown to preserve the 6x3 layout.

## 6. Layout (Parent Spirit Tree)
Section A (bottom)
- Child tabs (avatar on top, name below).
- Default shows up to 3 tabs.
- Use left/right arrows to move by one tab when more than 3.

Section B (top)
- B1: animated tree image.
- B2: wish grid for selected child (same A-F layout).

## 7. Functional Requirements (Child)
- Backpack items show icon only (no text).
- Same items stack with quantity shown bottom-right.
- Quantity display rules:
  - Minimum shown is `x1`.
  - `x0` is not shown.
- Tapping a backpack item:
  - Highlights the item.
  - Opens a detail modal anchored to B (must not cover A).
  - Modal shows name and description.
  - Modal contains a **Make Wish** button.
  - Modal is reused; tapping another item updates the modal content without reopening.
- If wish grid is full:
  - **Make Wish** button is hidden.
  - Show message: "Too many wishes. Please choose wisely."
- Clicking **Make Wish**:
  - Consumes 1 quantity immediately.
  - Inserts wish into the next available slot (A-F order).
  - Closes modal and clears selection.
- If quantity becomes 0 after wishing, the item disappears from the backpack grid.
- Wish grid interaction:
  - Tapping a wish opens a read-only detail modal (same style).
  - Tapping an empty slot closes the modal (same as tapping blank area).
  - Tapping another wish updates the modal content.
  - Selected wish slot shows a highlight effect.

## 8. Functional Requirements (Parent)
- Parent can switch child tabs to view each child's wish grid.
- Tapping a wish opens a read-only detail modal.
- Modal includes an **Accept** button.
- **Accept** requires confirmation.
- After acceptance:
  - Wish is removed from parent and child grids.
  - A notification is sent to both parent and child.

## 9. Business Rules & Constraints
- Wish slots are ordered A-F by reading order:
  - A: top-left, B: top-right, C: middle-left, D: middle-right, E: bottom-left, F: bottom-right.
- Wishes cannot be removed by the child.
- Only B section is scrollable on child Spirit Tree page.

## 10. Edge Cases / Errors
- If backpack quantity is 0, item is not shown.
- If wish grid is full, child cannot make new wishes.

## 11. Notifications
- Accepting a wish sends an inbox message to both parent and child.
- Title suggestion: `Wish Accepted`.
- Message suggestion: `Your wish "{itemName}" was accepted.`

## 12. Open Questions
- None.

