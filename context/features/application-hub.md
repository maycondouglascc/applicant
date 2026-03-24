# Application Hub (The Forge)

## Core Specification
The Forge is a single vertical page where users generate their job-specific assets. It connects the user's Master Snippets to a Target Job Description using Gemini.

## Workflow
1. **JD Input:** User pastes a Job Description.
2. **AI Action (One-click):** 
   - **Extractor:** Gemini identifies top keywords.
   - **Selector:** Gemini selects the most relevant master snippets.
   - **Tailor:** Gemini generates the Tailored CV, Cover Letter, and a <=250 character LinkedIn message.
3. **Diff Review:** A split-pane VS Code-style Diff view. Left side shows the Master Snippet segments used. Right side shows the Tailored Markdown editor. User can manually edit the right side.
4. **Export:** User can copy the raw Markdown or export as an ATS-clean PDF.

## User Interface Needs
- Split-pane code editor capable of showing inline or side-by-side diffs.
- Clear section boundaries for CV, Cover Letter, and LinkedIn message.
- Download/Copy buttons.
