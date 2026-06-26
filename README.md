# K-SheetPress

**Blog CMS with bi-directional Google Sheets & Supabase sync**

K-SheetPress is a modern blog CMS that lets you write and manage posts from Google Sheets while powering your blog with Supabase for lightning-fast performance. Edit in Sheets, publish everywhere.

## ✨ Features

- 🔀 **Bi-directional Sync** — Edit posts in Google Sheets or the web editor; changes replicate both ways
- 📊 **Google Sheets as CMS** — Service account integration; just share a spreadsheet with an email
- ⚡ **Supabase Backend** — Fast PostgreSQL reads/writes with Row Level Security
- ✍️ **Markdown Editor** — Full Markdown support with live preview
- 🤖 **AI Post Generation** — Generate posts with OpenAI (bring your own key or admin sets default)
- 📧 **SMTP Email** — Configure Resend, Brevo, or Mailgun in the admin panel
- 🔗 **Clean Permalinks** — SEO-friendly URL structure: `/category/subcategory/post-slug`
- 👤 **Public Author Profiles** — Paginated, searchable post listings per author
- ❤️ **Likes & Comments** — Built-in engagement system
- 🌙 **Dark Theme** — Modern dark UI with glass morphism effects
- 📱 **Responsive Design** — Works beautifully on mobile and desktop
- 🔐 **Authentication** — Email/password + Google sign-in
- 📖 **Documentation** — Landing copy, user manual, changelog, roadmap
- 🛡️ **Admin Dashboard** — Analytics, sync logs, SMTP settings, AI settings

## 🏗️ Tech Stack

- **Next.js 16** (App Router, Server Components)
- **React 19** + TypeScript 5
- **Tailwind CSS 4**
- **Supabase** (PostgreSQL, Auth, Storage)
- **Google Sheets API** (Service Account)
- **Vercel** (Deployment)

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- A Supabase project
- A Google Cloud project with Sheets API enabled
- A Google Service Account with access to the Sheets API

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
NEXT_PUBLIC_APP_URL=https://your-domain.com
NEXT_PUBLIC_APP_NAME=K-SheetPress
NEXT_PUBLIC_ADMIN_EMAILS=admin@example.com
```

### Installation

```bash
git clone https://github.com/komputeks/k-sheetpress.git
cd k-sheetpress
npm install
npm run dev
```

### Database Setup

The app uses these Supabase tables (all prefixed with `k_sheetpress_`):

| Table | Purpose |
|-------|---------|
| `k_sheetpress_posts` | Blog posts with categories, tags, markdown content |
| `k_sheetpress_profiles` | Author profiles with usernames |
| `k_sheetpress_comments` | Post comments |
| `k_sheetpress_likes` | Post likes |
| `k_sheetpress_user_sheets` | Google Sheet connections per user |
| `k_sheetpress_sync_log` | Sync audit trail |
| `k_sheetpress_site_settings` | Site configuration (SMTP, AI keys, etc.) |

### Demo Account

- **Email:** `demo@sheetpress.dev`
- **Password:** `password123`

## 📁 Project Structure

```
src/
├── app/
│   ├── api/           # API routes (posts, sheets, auth, admin, ai)
│   ├── admin/         # Admin dashboard
│   ├── dashboard/     # User dashboard & post editor
│   ├── docs/          # Documentation pages
│   ├── explore/       # Post discovery
│   ├── login/         # Authentication
│   ├── signup/        # Registration
│   └── [cat1]/[cat2]/[slug]/  # Post permalinks
├── components/        # Reusable UI components
├── config/            # Site configuration
├── lib/               # Supabase clients, Google Sheets, utilities
├── providers/         # Auth & Theme providers
├── schemas/           # Zod validation schemas
└── types/             # TypeScript interfaces
```

## 🔄 How Sync Works

1. **Supabase → Sheets**: When you create or edit a post via the web editor, it's saved to Supabase and automatically synced to your Google Sheet
2. **Sheets → Supabase**: When you edit in Google Sheets, click "Sync Now" in your dashboard to pull changes into Supabase

## 📄 License

MIT

---

🌐 **Live Demo:** [k-sheetpress.vercel.app](https://k-sheetpress-qspt3pop0-xpatworld2021s-projects.vercel.app)

Built with ❤️ by [komputeks](https://github.com/komputeks)
