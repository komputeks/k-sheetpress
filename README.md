# K-SheetPress

> Blog CMS with bi-directional Google Sheets & Supabase sync

🌐 **Live Site:** [k-sheetpress-qio9sbt1d-xpatworld2021s-projects.vercel.app](https://k-sheetpress-qio9sbt1d-xpatworld2021s-projects.vercel.app)

## What is K-SheetPress?

K-SheetPress is a modern blog CMS that bridges the gap between the simplicity of a spreadsheet and the power of a modern web platform. Write your posts in Google Sheets, and they automatically appear on your blog. Edit them on the web, and your spreadsheet stays in sync — bi-directional, real-time, and fast.

## Features

- 🔀 **Bi-directional sync** — Edit posts in Google Sheets or the web editor; changes replicate both ways
- 📊 **Google Sheets as CMS** — Service account integration; just share a spreadsheet with an email
- ⚡ **Supabase backend** — Fast PostgreSQL reads/writes with row-level security
- ✍️ **Markdown editor** — Full Markdown support with live preview
- 🔗 **Clean permalinks** — SEO-friendly `/category/subcategory/post-slug` structure
- 👤 **Public author profiles** — Every author gets a paginated, searchable profile page
- ❤️ **Likes & comments** — Built-in engagement system
- 🌙 **Dark/light theme** — System preference detection + manual toggle
- 📱 **Responsive design** — Works beautifully on mobile and desktop
- 🔐 **Auth** — Email/password + Google sign-in via Supabase Auth
- 📖 **Documentation** — Landing copy, user manual, changelog, roadmap
- 🛡️ **Admin dashboard** — Analytics, sync logs, user management

## Tech Stack

- **Next.js 16** (App Router, Server Components)
- **React 19** + **TypeScript**
- **Tailwind CSS 4**
- **Supabase** (Auth, PostgreSQL, RLS)
- **Google Sheets API** (Service Account)
- **Vercel** (Deployment, CDN)

## How It Works

1. **Sign in** to K-SheetPress
2. **Create** an empty Google Spreadsheet
3. **Share** the spreadsheet with the K-SheetPress service account (as Editor)
4. **Initialize** your sheet — we add columns, headers, and a sample post
5. **Write** posts in Sheets or the built-in editor
6. **Publish** — content syncs bi-directionally between Sheets and Supabase

### Permalink Structure

Every published post gets a clean URL: `/{cat1}/{cat2}/{post-slug}`

Example: `/technology/web-dev/getting-started-with-k-sheetpress`

### Sheet Columns

| Column | Description |
|--------|-------------|
| `post_id` | Auto-generated UUID |
| `post_title` | Post title |
| `post_slug` | URL-friendly slug (auto-generated) |
| `cat1` | Primary category |
| `cat2` | Subcategory |
| `post_description` | SEO description |
| `post_excerpt` | Brief excerpt for listings |
| `post_content` | Full content (Markdown) |
| `post_tags` | Comma-separated tags |
| `post_status` | `draft` or `published` |
| `post_likes` | Like count |
| `post_comments_count` | Comment count |
| `featured_image` | Image URL |
| `created_at` | Creation timestamp |
| `updated_at` | Last update timestamp |

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
- A Google Cloud project with Sheets API enabled and a service account

### Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_SERVICE_ACCOUNT_EMAIL=your_service_account_email
GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY_ID=your_key_id
GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY=your_private_key
NEXT_PUBLIC_APP_URL=your_production_url
NEXT_PUBLIC_APP_NAME=K-SheetPress
```

### Install & Run

```bash
npm install
npm run dev
```

### Build & Deploy

```bash
npm run build
npm start
```

Deployed automatically to Vercel on push to `main`.

## Demo Account

- **Email:** `demo@sheetpress.dev`
- **Password:** `password123`

## Architecture Decisions

- **Next.js App Router** over Pages Router — Server Components, streaming, better data fetching
- **Supabase** over raw PostgreSQL — Built-in auth, RLS, real-time capabilities
- **Google Sheets as CMS interface** — Familiar interface for non-technical users
- **Service Account** over OAuth — Simpler setup; users just share a spreadsheet with an email
- **`k_sheetpress_` table prefix** — Namespace isolation in shared Supabase projects

## License

MIT
