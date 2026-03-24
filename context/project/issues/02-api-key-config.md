## Parent PRD

`context/project/prd.md`

## What to build

Build the Settings UI where the user can input their Gemini API Key, save it to `localStorage`, and select their AI Persona. Implement a test function to verify the API key connects to Gemini successfully.

This slice cuts through:
1. TDD: Write component tests for saving credentials to `localStorage`.
2. UI: A settings page with an input for the API Key and a dropdown for the Persona.
3. Logic: A visual "Test Connection" button that runs a dummy prompt to Google Gemini.

## Acceptance criteria

- [ ] User can enter an API key into a settings input.
- [ ] The API key is securely saved to browser `localStorage` on submit.
- [ ] User can select a Persona (e.g., Professional, Humble) which maps to a local state/storage.
- [ ] Clicking "Test Connection" triggers a real call to Gemini using the stored key and displays a success/fail badge.

## Blocked by

None - can start immediately.

## User stories addressed

- 2
- 4
