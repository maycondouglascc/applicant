# Architecture

## Tech Stack
- **Frontend Framework:** Vite + React + TypeScript
- **Styling:** Tailwind CSS + Shadcn UI (Radix base component library)
- **Data Fetching / State:** React Query or native Hooks.
- **Database / Auth:** Supabase (PostgreSQL + Storage for generated PDFs/Assets).
- **AI Integration:** Google Gemini SDK (using `@google/genai` or standard REST fetch).

## Core Mechanisms
- **State Management:** Application state (Diff, Form generation) managed via standard React Context/reducer or Zustand if complex.
- **Security:** The app is public-facing but intended for a single user/dev context. No central API keys for Gemini—the user provides their own key to be stored in `localStorage`.
- **Diffing Library:** Need a lightweight React diff viewer to handle the Markdown comparisons.
- **PDF Generation:** Use `react-pdf` or a similar solution to parse Markdown to a strictly structured, ATS-compliant PDF document. No visual frills.
