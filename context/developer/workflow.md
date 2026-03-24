# Developer Workflow

## Code Conventions
- **TypeScript:** Strict typing. Interfaces for all Supabase database shapes.
- **Component Structure:** Functional components. Co-locate feature-specific logic within `/features` folder structurally, overriding `/components` solely for generic UI elements (like Shadcn).
- **Styling:** Avoid stray CSS files. Preach Tailwind utility classes exclusively.

## Implementation Flow
- AI agents and developers should follow a "Plan -> Context -> Execute" loop.
- Features should be developed in isolation first, mocking AI/DB responses if necessary, before hooking up to Gemini and Supabase to reduce latency during dev.
