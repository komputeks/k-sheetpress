# K-SheetPress

> Blog CMS with bi-directional Google Sheets & Supabase sync

[![Deploy to Vercel](https://img.shields.io/badge/Deploy-Vercel-black?logo=vercel)](https://k-sheetpress-mcunavp59-xpatworld2021s-projects.vercel.app)
[![GitHub](https://img.shields.io/badge/Repo-GitHub-181717?logo=github)](https://github.com/komputeks/k-sheetpress)
[![Next.js](https://img.shields.io/badge/Next.js-16.2-black?logo=next.js)](https://nextjs.org)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?logo=supabase)](https://supabase.com)

## 🌐 Live Site

**Production URL:** [k-sheetpress-mcunavp59-xpatworld2021s-projects.vercel.app](https://k-sheetpress-mcunavp59-xpatworld2021s-projects.vercel.app)

## 🚀 What is K-SheetPress?

K-SheetPress is a modern blog CMS that syncs bi-directionally between Google Sheets and Supabase. Write your posts in a spreadsheet, and they publish instantly on your blog. Edit on the web, and your spreadsheet stays in sync.

## ✨ Key Features

- 🔀 **Bi-directional sync** — Edit in Google Sheets or the web editor, changes replicate both ways
- 📊 **Google Sheets as CMS** — Service account integration, just share a spreadsheet with an email
- ⚡ **Supabase backend** — Fast PostgreSQL reads/writes with Row Level Security
- ✍️ **Markdown editor** — Write in Markdown with live preview
- 🔗 **Clean permalinks** — `/category/subcategory/post-slug` structure
- 👤 **Public author profiles** — Paginated, searchable post listings per author
- ❤️ **Likes & Comments** — Engage with readers
- 🌙 **Dark/Light theme** — System preference detection
- 📱 **Responsive** — Works on mobile and desktop
- 🔐 **Auth** — Email/password + Google sign-in
- 🛡️ **Admin dashboard** — Sync logs, SMTP config, site settings
- 📖 **Documentation** — User manual, changelog, roadmap

## 🏗️ Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript 6 (strict mode)
- **Styling:** Tailwind CSS 4
- **Database:** Supabase (PostgreSQL)
- **Auth:** Supabase Auth (email + Google OAuth)
- **CMS Interface:** Google Sheets (via Service Account)
- **Deployment:** Vercel (auto-deploys on GitHub push)

## 📊 Database Schema

| Table | Purpose |
|-------|---------|
| `k_sheetpress_posts` | Blog posts with categories, tags, markdown content |
| `k_sheetpress_profiles` | Author profiles with usernames |
| `k_sheetpress_comments` | Post comments |
| `k_sheetpress_likes` | Post likes |
| `k_sheetpress_user_sheets` | Google Sheet connections per user |
| `k_sheetpress_sync_log` | Sync audit trail |
| `k_sheetpress_site_settings` | Site configuration key-value store |

## 🔑 Demo Credentials

- **Email:** `demo@sheetpress.dev`
- **Password:** `password123`
- **Admin Password:** `Ksheet@2025!Admin` (enter at `/admin`)

## 📁 Project Structure

```
src/
├── app/
│   ├── api/          # API routes (posts, sheets, auth, admin)
│   ├── admin/        # Admin dashboard
│   ├── dashboard/    # User dashboard & post editor
│   ├── docs/         # Documentation pages
│   ├── explore/      # Post discovery
│   ├── login/        # Authentication
│   ├── signup/       # Registration
│   ├── profile/      # Public author profiles
│   └── [cat1]/[cat2]/[slug]/  # Post permalinks
├── components/       # Shared UI components
├── config/           # Site configuration
├── lib/              # Utilities, Supabase clients, Google Sheets
├── providers/        # Auth & Theme providers
├── schemas/          # Zod validation schemas
└── types/            # TypeScript type definitions
```

## 🔄 How Sync Works

1. **Supabase → Sheets:** When you create/edit a post via the web editor, it's saved to Supabase first, then replicated to your Google Sheet
2. **Sheets → Supabase:** Click "Sync Now" in the dashboard to pull changes from your Google Sheet into Supabase
3. **Conflict Resolution:** Supabase is the source of truth; sheet syncs update Supabase records by matching `post_id`

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- A Supabase project
- A Google Cloud service account with Sheets API enabled

### Setup

1. Clone the repo:
   ```bash
   git clone https://github.com/komputeks/k-sheetpress.git
   cd k-sheetpress
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Copy `.env.example` to `.env.local` and fill in your credentials

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000)

## 📄 License

MIT
