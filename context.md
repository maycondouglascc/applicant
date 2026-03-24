# Agent Context Guide

Welcome, Agent. To provide the best assistance and ensure consistency with the project's architecture and goals, you MUST contextualize yourself before taking any actions.

## 🏁 How to Get Started

Before you write code, suggest a plan, or perform any research, follow these steps:

1.  **Read the Root `README.md`**: Get a high-level overview of the tech stack and project setup.
2.  **Explore the `context/` Directory**: This is your primary source of truth.
3.  **Mandatory Reading**:
    *   [**`context/project/project.md`**](file:///c:/Users/mcmay/Documents/Coding/applicant/applicant/context/project/project.md): Understand the core description, scope, and the current roadmap.
    *   [**`context/technical/architecture.md`**](file:///c:/Users/mcmay/Documents/Coding/applicant/applicant/context/technical/architecture.md): Learn about the tech stack, data flow, and core mechanisms.
    *   [**`context/project/prd.md`**](file:///c:/Users/mcmay/Documents/Coding/applicant/applicant/context/project/prd.md): Read the Product Requirements Document for a detailed feature breakdown.

## 📂 Context Directory Structure

*   **/context/project**: Core mission, roadmap, and PRD.
*   **/context/technical**: Architecture, database schema, and technical decisions.
*   **/context/design**: UI/UX guidelines and design system details.
*   **/context/features**: Detailed specifications for specific feature sets (e.g., Application Hub, Dashboard).
*   **/context/ops**: Deployment and operational procedures.

## 📝 When and How to Update Context

Context files are a living organism. They must evolve as the project progresses.

### When to Update
*   **EndOfEachSession**: Before concluding your turn or session, summarize what was achieved and update the relevant `context/` file.
*   **RoadmapMilestones**: Mark a phase as completed or update its status in `context/project/project.md` once finished.
*   **ArchitectureChanges**: If you add a new library, change a state management pattern, or modify the database schema, update `context/technical/architecture.md` or `schema.md`.
*   **LogDecisions**: Use the **"Key Decisions Log"** in `project.md` to record *why* a choice was made (e.g., "Choosing React-PDF over alternatives for ATS compatibility").

### How to Update
1.  **Surgical Edits**: Use targeted tools to update only relevant sections. Do not rewrite filenames or whole directories unnecessarily.
2.  **Maintain Links**: Ensure that all markdown links between context files (e.g., linking from a feature doc back to architecture) remain valid.
3.  **Traceability**: When updating, clearly state *what* changed and *relative to what* task it was changed for.

## 🧠 Principles for Agents

*   **Context First**: Never assume. Always verify against the docs.
*   **Update-as-you-go**: Don't wait until the end of a big task to update context. If a decision is made, log it immediately.
*   **Consistency**: Ensure your suggestions align with the decisions logged in `context/project/project.md`.
*   **Atomic Updates**: Keep context updates focused. If you're working on the "Dashboard", update `context/features/dashboard.md` only.

---
*Last updated: 2026-03-24*
