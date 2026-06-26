export const SITE_CONFIG = {
  name: 'K-SheetPress',
  description: 'Blog CMS with bi-directional Google Sheets & Supabase sync',
  url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  serviceAccountEmail: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || '',
  postsPerPage: 12,
  maxPostsPerPage: 50,
} as const;
