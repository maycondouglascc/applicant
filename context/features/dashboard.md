# Command Center (Dashboard)

## Core Specification
The Dashboard is the home screen for managing all applications and their statuses. It uses a high-density, professional table, avoiding visually noisy Kanban boards.

## Features
- **Application List Table:** Displays all non-archived applications.
- **Data Columns:** Priority (1-5), Company, Role, Status Badge, Last Action, Days Since Applied.
- **Status Pipeline:**
  - `Backlog`
  - `Drafting`
  - `Applied`
  - `Interviewing`
  - `Offer`/`Rejected`
- **Auto-Archive:** Applications sitting in `Applied` with no response for 30+ days gracefully move to `Archived`.
- **Private Notes & Checklist:** Each row should expand or link to a detail view containing a checklist (Tailor CV, Tailor CL, Sent LI Message, Applied on portal) and private notes.
