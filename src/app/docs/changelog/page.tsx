import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Changelog',
  description: 'K-SheetPress changelog and release history',
};

export default function ChangelogPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 prose prose-sm dark:prose-invert max-w-none prose-headings:font-heading">
      <h1>Changelog</h1>

      <h2>v1.0.0 — Initial Release</h2>
      <p className="text-sm text-surface-muted-foreground">June 2025</p>
      <ul>
        <li>Bi-directional sync between Google Sheets and Supabase</li>
        <li>Google Service Account integration for seamless sheet access</li>
        <li>Post creation and editing via web interface</li>
        <li>Markdown support with live preview</li>
        <li>Category-based permalink structure: /cat1/cat2/slug</li>
        <li>Public author profiles with paginated post listings</li>
        <li>Post likes and comments system</li>
        <li>Search and filter on explore page</li>
        <li>Dark/light theme with system preference detection</li>
        <li>SEO-optimized with OpenGraph, Twitter cards, and structured data</li>
        <li>Responsive design for mobile and desktop</li>
      </ul>

      <h3>Architecture Decisions</h3>
      <ul>
        <li><strong>Next.js App Router over Pages Router</strong>: Server Components, streaming, and better data fetching patterns</li>
        <li><strong>Supabase over raw PostgreSQL</strong>: Built-in auth, RLS, and real-time capabilities</li>
        <li><strong>Google Sheets as CMS interface</strong>: Familiar interface for non-technical users, no new UI to learn</li>
        <li><strong>Service Account over OAuth</strong>: Simpler setup — users just share a spreadsheet with an email</li>
      </ul>

      <h3>Anti-patterns Avoided</h3>
      <ul>
        <li><strong>No client-side database queries</strong>: All data access through API routes with proper auth</li>
        <li><strong>No mock/hardcoded data</strong>: Everything comes from Supabase</li>
        <li><strong>No Vite</strong>: Using Next.js as mandated by project requirements</li>
        <li><strong>No fat controllers</strong>: Business logic separated into lib/ modules</li>
      </ul>
    </div>
  );
}
