# Applicant: Project Overview

## Description
Applicant is a personal, high-density professional utility designed to streamline the job hunt. It acts as a "Command Center" and "Forge" for tailoring resumes, cover letters, and LinkedIn messages to specific job descriptions using AI (Gemini).

## Scope
- Maintain a "Master Profile" consisting of markdown snippets (experiences, case studies).
- Ingest Job Descriptions (JDs) to automatically select relevant snippets and tailor a specific application (CV, Cover Letter, Outreach Message).
- Provide a side-by-side Diff editor to review and edit AI-tailored content against the master source.
- Export raw Markdown or ATS-optimized PDF resumes.
- Track active and archived applications via a lightweight status pipeline.

## Roadmap & Phases
1. **Phase 1: Foundation.** Setup Vite + Tailwind + Shadcn. Configure Geist font and Lucide icon defaults. Initialize Supabase and an API key input in Settings.
2. **Phase 2: The Forge (Editor).** Create the "Library" for Markdown snippets. Implement the "Application Hub" with Diff editor and Gemini tailoring logic.
3. **Phase 3: The Command Center (Dashboard).** Build the high-res applications table with status management.
4. **Phase 4: Export & Polish.** Integrate ATS-clean PDF generation and final UI refinements.

## Key Decisions Log
- **Snippets vs Master File:** Data is split into snippets (e.g., `frontend_exp.md`, `pm_exp.md`) for targeted extraction.
- **ATS Only:** Final PDF layout is strictly ATS-optimized (raw text structure, standard fonts, no complex columns). No visual "pretty" templates.
- **Diff Review:** The user must be able to review what the AI changed to ensure factuality.
- **Local AI Key:** The Gemini API key will be stored in `localStorage` since this is a local/personal tool. Data assets are stored in Supabase.
- **Intelligence Retention:** JDs are retained in the database for future market trend analysis and interview prep, but not built in MVP.
