# Infrastructure & Deployment

## Hosting
- The frontend will be hosted on Vercel.
- Database is a hosted Supabase project.

## Environment Variables
- `VITE_SUPABASE_URL`: The Supabase project URL.
- `VITE_SUPABASE_ANON_KEY`: The public anonymous key for the client.
- **Note:** The Gemini API key is *not* stored in the `.env` file since it is provided by the user via the UI and stored in their browser `localStorage`.
