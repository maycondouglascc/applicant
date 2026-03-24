## Parent PRD

`context/project/prd.md`

## What to build

Implement the `applications` database schema. Build the UI in "The Forge" to paste a Job Description text. Trigger a Gemini call to extract Top Keywords from the JD and recommend/rank which Master Snippets should be selected. Save the application strictly in a "Backlog" status.

This slice cuts through:
1. Supabase schema creation (`applications` table).
2. TDD: Write tests for the JD extraction logic (mocking the Gemini response).
3. UI: A text area for the JD and a display of recommended snippets extracted from `master_assets`.

## Acceptance criteria

- [ ] An `applications` table exists in Supabase.
- [ ] User can paste plain text into a "Job Description" field and submit.
- [ ] System calls Gemini to extract 5 key skills/keywords from the JD.
- [ ] System compares JD against existing Master Snippets and suggests the top relevant snippets.
- [ ] A new row is inserted into the `applications` table with status `Backlog` and the raw JD text.

## Blocked by

- Blocked by `01-snippet-management.md` (Needs master snippets to rank)
- Blocked by `02-api-key-config.md` (Needs Gemini API access)

## User stories addressed

- 5
- 6
- 16
