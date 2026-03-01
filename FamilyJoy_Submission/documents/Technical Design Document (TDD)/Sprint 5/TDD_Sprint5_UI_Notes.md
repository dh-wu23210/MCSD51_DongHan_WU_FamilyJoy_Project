# Sprint 5 TDD - UI Notes

## 1. Child Spirit Tree UI
- A1: animated tree image
- A2: wish grid 2x3 labeled A?F (colored badge top-left)
- B: backpack grid 6 columns; rows = ceil(itemTypes/6), min 6x3 visible
- Only B section scrolls
- Items show icon only; quantity at bottom-right (x1+), hide if 0; empty slots render to preserve 6x3

Modal behavior
- Clicking backpack item highlights tile and opens reusable modal
- Modal anchored to B; overlay only in B so wishes remain clickable
- Shows name, description, **Make Wish** button
- If grid full: hide button, show ?Too many wishes. Don?t be greedy.?
- Clicking empty wish slot closes modal
- Clicking another item or wish updates modal content (modal is reused)

## 2. Parent Spirit Tree UI
- A: child tabs moved to bottom area; avatar on top, name below; arrows move one tab per click
- B1: tree animation, B2: wish grid for selected child
- Clicking wish opens read-only modal with **Accept** button (modal over bottom area)
- Accept requires confirmation
