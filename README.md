# K-SheetPress

> Blog CMS with bi-directional Google Sheets & Supabase sync

**🌐 Live Site:** [k-sheetpress-q28gpdkea-xpatworld2021s-projects.vercel.app](https://k-sheetpress-q28gpdkea-xpatworld2021s-projects.vercel.app)

## What is K-SheetPress?

K-SheetPress is a modern blog CMS that bridges the gap between the simplicity of a spreadsheet and the power of a modern web platform. Write your posts in Google Sheets, and they automatically appear on your blog. Edit them on the web, and your spreadsheet stays in sync.

## Features

- 🔀 **Bi-directional sync** — Edit in Google Sheets or the web editor, changes replicate both ways
- 📊 **Google Sheets as CMS** — Service account integration, just share a spreadsheet with an email
- ⚡ **Supabase backend** — Fast PostgreSQL reads/writes with Row Level Security
- ✍️ **Markdown editor** — Full Markdown support with live preview
- 🔗 **Clean permalinks** — SEO-friendly URL structure: `/cat1/cat2/post-slug`
- 👤 **Public author profiles** — Every author gets their own page with paginated post listings
- ❤️ **Likes & comments** — Built-in engagement system
- 🌙 **Dark/light theme** — System preference detection with manual toggle
- 📱 **Responsive design** — Mobile-first, works on all devices
- 🔐 **Authentication** — Email/password + Google sign-in via Supabase Auth
- 📖 **Documentation** — Landing copy, user manual, changelog, and roadmap pages
- 🛡️ **Admin dashboard** — Sync logs, site stats, and settings management
- 🔍 **Search & filter** — Full-text search and category filtering on explore page

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS 4
- **Database:** Supabase (PostgreSQL)
- **Auth:** Supabase Auth (Email + Google OAuth)
- **CMS Interface:** Google Sheets (via Service Account)
- **Deployment:** Vercel (auto-deploys on GitHub push)

## Database Schema

All tables use the `k_sheetpress_` prefix:

| Table | Purpose |
|-------|---------|
| `k_sheetpress_posts` | Blog posts with categories, tags, markdown content |
| `k_sheetpress_profiles` | Author profiles with usernames |
| `k_sheetpress_comments` | Post comments |
| `k_sheetpress_likes` | Post likes |
| `k_sheetpress_user_sheets` | Google Sheet connections per user |
| `k_sheetpress_sync_log` | Sync audit trail |
| `k_sheetpress_site_settings` | Site configuration |

## Getting Started

### Prerequisites

- Node.js 18+
- A Supabase project
- A Google Cloud project with Sheets API enabled and a Service Account

### Setup

1. **Clone the repo:**
   ```bash
   git clone https://github.com/komputeks/k-sheetpress.git
   cd k-sheetpress
   npm install
   ```

2. **Configure environment variables** (see `.env.example` for reference):
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   GOOGLE_SERVICE_ACCOUNT_EMAIL=your_service_account_email
   GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY=your_private_key
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   NEXT_PUBLIC_APP_NAME=K-SheetPress
   ```

3. **Run the dev server:**
   ```bash
   npm run dev
   ```

### Using as an Author

1. Sign up / Sign in
2. Create an empty Google Spreadsheet
3. Share it with the K-SheetPress service account email (as Editor)
4. Paste the Spreadsheet ID in your dashboard and click "Initialize Sheet"
5. Start writing posts in the editor or directly in Google Sheets
6. Click "Sync Now" to pull changes from Sheets into Supabase

## Permalink Structure

Every published post gets a clean, SEO-friendly URL:

```
/{cat1}/{cat2}/{post-slug}
```

Example: `/technology/web-dev/getting-started-with-k-sheetpress`

## Demo Account

- **Email:** `demo@sheetpress.dev`
- **Password:** `password123`

## Architecture Decisions

- **Next.js App Router** over Pages Router — Server Components, streaming, better data fetching
- **Supabase** over Firebase — Relational data, RLS, open source, real PostgreSQL
- **Google Sheets as CMS** — Familiar interface, no new UI to learn, built-in collaboration
- **Service Account** over OAuth — Simpler setup, users just share a spreadsheet with an email

## License

MIT
# Build Thu Jun 25 23:54:31 UTC 2026
