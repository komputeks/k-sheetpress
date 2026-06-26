import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Roadmap',
  description: 'K-SheetPress feature roadmap',
};

export default function RoadmapPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 prose prose-sm dark:prose-invert max-w-none prose-headings:font-heading">
      <h1>Roadmap</h1>

      <h2>Coming Soon</h2>
      <ul>
        <li><strong>Real-time sync</strong>: Automatic Sheet → Supabase sync via Google Drive API push notifications</li>
        <li><strong>Image uploads</strong>: Supabase Storage integration for featured images and post media</li>
        <li><strong>Admin dashboard</strong>: Full CMS admin with analytics, user management, and content moderation</li>
        <li><strong>SMTP email</strong>: Email notifications for new comments, likes, and sync events</li>
        <li><strong>Webhook support</strong>: Notify external services on post create/update/delete</li>
      </ul>

      <h2>Planned</h2>
      <ul>
        <li><strong>Multi-language support</strong>: i18n for global audiences</li>
        <li><strong>Custom domains</strong>: Point your own domain to your K-SheetPress blog</li>
        <li><strong>Themes</strong>: Choose from multiple blog layout themes</li>
        <li><strong>Analytics dashboard</strong>: View counts, referrers, and reader demographics</li>
        <li><strong>PWA offline support</strong>: Read posts offline with service worker caching</li>
        <li><strong>RSS & Atom feeds</strong>: Auto-generated feeds for each author and category</li>
        <li><strong>Import/Export</strong>: Migrate from WordPress, Medium, Ghost, and other platforms</li>
      </ul>

      <h2>Performance Improvements</h2>
      <ul>
        <li>Edge caching with Vercel CDN for sub-50ms TTFB</li>
        <li>Incremental Static Regeneration for popular posts</li>
        <li>Image optimization with next/image and Supabase transformations</li>
        <li>Database query optimization and connection pooling</li>
      </ul>

      <h2>Security Enhancements</h2>
      <ul>
        <li>Rate limiting on API routes using Upstash Redis</li>
        <li>CSRF protection on mutations</li>
        <li>Content Security Policy headers</li>
        <li>Two-factor authentication option</li>
        <li>Automated vulnerability scanning in CI/CD</li>
      </ul>
    </div>
  );
}
