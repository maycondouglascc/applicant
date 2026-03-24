## Parent PRD

`context/project/prd.md`

## What to build

Parse the generated raw Markdown CV from the diff editor and convert it into a strictly-structured, ATS-compliant PDF document for download.

This slice cuts through:
1. TDD: Test markdown-to-pdf parsing functions.
2. Logic: The PDF renderer (e.g., `@react-pdf/renderer` or browser print styling).
3. UI: A simple "Export to PDF" button on the tailored application view.

## Acceptance criteria

- [ ] User sees a "Download ATS PDF" button when viewing a tailored CV.
- [ ] Clicking the button generates a single-column, cleanly formatted PDF using standard fonts (e.g., Arial/Helvetica logic).
- [ ] The PDF strips any complex Markdown elements (like tables/HTML) that break ATS parsers and replaces them with standard bullet lists.
- [ ] The PDF downloads automatically to the user's machine.

## Blocked by

- Blocked by `04-generation-diff.md`

## User stories addressed

- 10
