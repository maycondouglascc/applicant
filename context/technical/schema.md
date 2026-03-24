# Data Models (Supabase)

## Tables

### `master_assets` (The Snippets)
- `id`: uuid
- `name`: string
- `content`: text (Markdown)
- `created_at`: timestamp
- `updated_at`: timestamp

### `applications`
- `id`: uuid
- `company`: string
- `role`: string
- `jd_text`: text
- `status`: enum (Backlog, Drafting, Applied, Interviewing, Offer, Rejected, Archived)
- `tailored_cv`: text (Markdown)
- `tailored_cl`: text (Markdown)
- `linkedin_msg`: text
- `private_notes`: text
- `created_at`: timestamp
- `updated_at`: timestamp
