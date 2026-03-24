## Parent PRD

`context/project/prd.md`

## What to build

Send the selected Snippets and the JD to Gemini to generate the tailored CV, Cover Letter, and a <300 character LinkedIn message. Build the side-by-side Markdown Diff view so the user can verify the AI's spins against their facts. Allow direct edits to the final Markdown output.

This slice cuts through:
1. TDD: Test the diff editor component rendering and markdown generation mapping.
2. AI Logic: The complex prompt design to ensure the AI uses *only* the provided snippets and formats the output cleanly.
3. UI: A split-pane view showing the Source Snippets (Left) and Tailored Output (Right).

## Acceptance criteria

- [ ] User clicks "Generate" and the system passes the JD, Persona, and selected Snippets to Gemini.
- [ ] Gemini returns a tailored CV format, a Cover Letter, and a short LinkedIn message.
- [ ] The Diff UI renders, allowing a side-by-side comparison of the Source text vs Generated text.
- [ ] The user can click into the Generated text (Right side) and manually type edits.
- [ ] Saving updates the `tailored_cv`, `tailored_cl`, and `linkedin_msg` columns in the `applications` database.

## Blocked by

- Blocked by `03-jd-intake.md`

## User stories addressed

- 7
- 8
- 9
