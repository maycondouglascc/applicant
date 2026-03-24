# Product Requirements Document

## Problem Statement

The user is a product designer engaged in an active job hunt. The process of applying for jobs is highly repetitive, disorganized, and time-consuming. It involves keeping multiple versions of a resume or cover letter up-to-date, manually rewriting them for specific job descriptions to pass ATS (Applicant Tracking Systems), and figuring out the right hook for LinkedIn outreach. Managing the status of applications across different platforms without a unified tracker leads to dropped threads and missed opportunities.

## Solution

**Applicant** is a personal, high-density professional utility tailored for the user's local and specific needs. It acts as both a "Command Center" to track application statuses and a "Forge" to rapidly generate highly tailored, ATS-optimized application materials (CV, Cover Letter, LinkedIn Message). 

It uses the user’s personal "Master Profile" (a library of Markdown snippets covering experiences and case studies) as ground truth. By feeding a target Job Description into Google Gemini, Applicant automatically selects the most relevant snippets, weaves them into tailored documents, ensures keyword optimization, and allows the user to review these changes in a side-by-side Markdown Diff editor before exporting or tracking them.

## User Stories

1. As a job seeker, I want to authenticate myself simply into the app so that my private application data is safe.
2. As a job seeker, I want to store my Gemini API key locally in the browser so that I don't need a complex backend billing system to execute AI tasks.
3. As a job seeker, I want to create, edit, and delete Markdown snippets representing my work experience and case studies so that the AI has a "Master Library" to pull from.
4. As a job seeker, I want to assign a "Persona" (e.g., Professional, Humble) to the AI system so that my generated applications match my desired tone.
5. As a job seeker, I want to paste a Job Description into a text area so that the application knows what to tailor against.
6. As a job seeker, I want the AI to automatically extract top keywords and rank my Master Snippets so that the most relevant experiences are prioritized.
7. As a job seeker, I want the AI to generate a tailored CV, a concise Cover Letter, and a <300 character LinkedIn message in a single click so that I save substantial drafting time.
8. As a job seeker, I want to view my Master Snippets side-by-side against the AI's Tailored Markdown version so that I can verify the AI did not hallucinate facts.
9. As a job seeker, I want to edit the AI's Tailored Markdown directly in the app so that I can make final manual adjustments before exporting.
10. As a job seeker, I want to export the finalized CV as an ATS-optimized PDF so that I can immediately upload it to job portals without formatting issues.
11. As a job seeker, I want a single "Command Center" data table to view all my non-archived job applications so that I can assess my pipeline at a glance.
12. As a job seeker, I want to see the status, priority, company, and role attached to each application row so that I know what needs attention.
13. As a job seeker, I want an active checklist (Tailor CV, Tailor CL, Sent LI, Applied, Response) on each application so that I have a consistent workflow.
14. As a job seeker, I want to type private notes (e.g., networking contacts, insights) on a specific application so that I retain context for an interview.
15. As a job seeker, I want applications with no response in 30 days to systematically archive themselves so that my dashboard stays clean.
16. As a job seeker, I want the Job Description itself to be permanently stored in my database so that I can run analytics on requested skills in the future.

## Implementation Decisions

- **Tech Stack:** Vite + React + TypeScript on the frontend. Supabase handles database (PostgreSQL) and Storage. Global state minimally handled via React Context or native hooks.
- **UI Framework Library:** Shadcn UI + Tailwind CSS for a minimal, un-opinionated dev-tool aesthetic.
- **Typography & Iconography:** Geist font exclusively. Lucide icons universally set to a 1.2px stroke width.
- **AI Tooling & Execution:** Google Gemini API integration; the prompt schema will strictly ask for Markdown returned content based on the user's localized API key.
- **Diff Editor Module:** We will implement a specialized dual-pane Markdown editor capable of rendering diff algorithms (e.g., via `diff-match-patch` or `monaco-editor` integration) focused solely on textual comparisons.
- **PDF Generation Module:** We will use a library such as `@react-pdf/renderer` purely optimized for ATS ingestion—no columns, no emojis, just structured headers and bullet points.
- **Security:** The Gemini Key will be persistently stored inside `localStorage`. Supabase Row-Level Security (RLS) policies will isolate the user's data payload.
- **API Contracts:** The interaction will heavily rely on simple direct-to-DB calls via the `@supabase/supabase-js` client, bypassing custom robust intermediate REST APIs given its single-user target model.
- **Layout Architecture:** 
  - `Library`: CRUD operations for `master_assets`.
  - `The Forge (Application Hub)`: Central operation layout rendering the JD input, generating, and Diff editor.
  - `Dashboard (Command Center)`: Data-table-focused root index managing `applications`.

## Testing Decisions

- A good test in this single-user MVP context must verify that critical behavioral workflows (such as creating Snippets or tailoring an Application) function without UI breakage. We do not test implementation details (like the exact rendering of a Shadcn Button inside the Library).
- **Modules to be tested via e2e/integration (Playwright/Cypress):**
  - **The Library Module:** Verification that snippets can be added, updated, and deleted locally and synced to Supabase.
  - **The Forge Module (Mocks Allowed):** The Gemini integration should be mocked during specific tests to guarantee that UI states (Loading, Error, Split-Pane view) behave correctly upon AI response variations.
  - **The Command Center Module:** Filtering and status transition logic (e.g., moving an application from `Applied` to `Archived`).

## Out of Scope

- Multi-tenancy or complex organizational structures.
- Billing systems, Subscriptions, Stripe integration.
- Custom "Visual/Design" PDF templates for human recruiters.
- Automated Job board scraping (e.g., fetching a JD from a LinkedIn URL).
- Direct scheduling or email sending APIs (e.g., sending the LinkedIn message automatically on behalf of the user).
- In-depth, automated market analytics trend-mapping on old Job Descriptions.
- Auto-generation of interview questions or scripts internally within the platform for the MVP phase.

## Further Notes

- Once MVP is established, a clear path forward exists to introduce the "Practice Room" concept, deriving custom interview questions from the JDs.
- Keep the prompt iterations within their own localized definitions file so they can evolve independently from UI code as the user experiments.
