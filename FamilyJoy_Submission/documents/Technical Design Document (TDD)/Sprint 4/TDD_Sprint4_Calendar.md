# Sprint 4 TDD - Calendar

## 1. Overview
Monthly calendar view showing per-day completion percentage and a detail panel.

## 2. Roles
- Child: sees own completion and tasks
- Parent: sees family aggregate in grid; child tabs in detail panel

## 3. Routes
- `GET /calendar` (parent & child)
  - Query: `?month=YYYY-MM-01` for prev/next navigation

## 4. Data Sources
- `daily_quests` joined with `quest_definitions` for name and crystals
- Child list for parent view

## 5. Queries
- Child monthly rows by date range
- Parent monthly rows by family date range
- Child list by family

## 6. Completion Rate Calculation
- `completed = count(status = 'complete')`
- `assigned = total quests for date`
- `rate = completed / assigned` (0% if assigned = 0)
- Parent grid uses totals across all children

## 7. ViewModel Output
- `calendarDays[]`: `{ date, dayNumber, isCurrentMonth, completionRate }`
- `selectedDate` (default today, server time)
- `childTabs[]`: `{ id, name, tasks[], completionRate }`
- `completionMap` for client-side detail panel rendering
- `prevMonthParam`, `nextMonthParam`

## 8. UI Behavior
- Header shows `Prev / Today / Next`
- Weekday header row (Sun?Sat)
- Each date cell shows: large day number + smaller percentage on same line
- Cross-month cells are grey and disabled
- Selected date shows blue outline

## 9. Time Handling
- Use server-local date string (no UTC `toISOString` for logic)

## 10. Error Handling
- Empty month -> grid still renders, detail panel empty

## 11. Performance
- Single aggregated monthly query per role
- Index recommendation: `(child_id, target_date, status)`
