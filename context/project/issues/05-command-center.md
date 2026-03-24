## Parent PRD

`context/project/prd.md`

## What to build

Build the high-density Data Table. Feed it from the Supabase `applications` database. Implement updating statuses (Backlog -> Applied -> Interviewing), priorities, private notes, and the checklist. Implement the 30-day auto-archive logic (can be UI filtered or DB triggered).

This slice cuts through:
1. TDD: Test sorting, filtering, and status state updates on application records.
2. UI: Advanced data table (likely utilizing `@tanstack/react-table` with Shadcn).
3. Logic: Status transition handlers and private note saving.

## Acceptance criteria

- [ ] User can view a table of all `applications` that do not have the status `Archived`.
- [ ] User can click a row to view its details (Private Notes text area and Task Checklist).
- [ ] User can change the status of an application (e.g., Backlog -> Applied).
- [ ] Applications sitting in `Applied` with a `updated_at` older than 30 days are automatically filtered out to an `Archived` view.

## Blocked by

- Blocked by `03-jd-intake.md` (Need applications to view)

## User stories addressed

- 11
- 12
- 13
- 14
- 15
