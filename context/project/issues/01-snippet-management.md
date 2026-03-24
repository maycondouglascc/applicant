## Parent PRD

`context/project/prd.md`

## What to build

Implement the local login flow (or basic Supabase Auth for the single user), set up the database schema for `master_assets`, and build the UI to Create, Read, Update, and Delete Markdown Snippets (work experiences, case studies).

This slice cuts through:
1. Supabase schema creation (`master_assets` table).
2. TDD: Write integration tests for adding and listing snippets.
3. UI: A simple Library page displaying snippets in a list and a form to edit them.

## Acceptance criteria

- [ ] A `master_assets` table exists in Supabase with `id`, `name`, `content`, `created_at`.
- [ ] User can view a list of all their Markdown snippets.
- [ ] User can create a new Markdown snippet, which saves to the database.
- [ ] User can edit the content of an existing snippet and save changes.
- [ ] User can delete a snippet.

## Blocked by

None - can start immediately.

## User stories addressed

- 1
- 3
