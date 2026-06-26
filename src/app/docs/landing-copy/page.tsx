import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Landing Copy',
  description: 'The story behind K-SheetPress',
};

export default function LandingCopyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 prose prose-sm dark:prose-invert max-w-none prose-headings:font-heading">
      <h1>Landing Copy</h1>
      <h2>The Problem We Solve</h2>
      <p>
        Blogging platforms are either too simple or too complex. WordPress needs hosting, plugins, and constant maintenance.
        Static site generators require developer skills. And most CMS platforms lock you into their interface.
      </p>
      <p>
        But you already know how to use a spreadsheet. You probably use Google Sheets every day for planning,
        tracking, and organizing. What if you could manage your blog the same way?
      </p>
      <h2>Our Solution</h2>
      <p>
        K-SheetPress bridges the gap between the simplicity of a spreadsheet and the power of a modern web platform.
        Write your posts in Google Sheets, and they automatically appear on your blog. Edit them on the web,
        and your spreadsheet stays in sync. It's bi-directional, real-time, and surprisingly fast.
      </p>
      <h2>Why It Works</h2>
      <p>
        Under the hood, K-SheetPress uses Supabase (PostgreSQL) for lightning-fast reads and writes,
        while Google Sheets serves as your friendly content editor. The service account integration
        means you just share a spreadsheet with an email address — no OAuth dance, no API keys to manage.
      </p>
      <p>
        Every post gets a clean, SEO-friendly permalink: <code>/category/subcategory/post-slug</code>.
        Markdown support means you can write rich content. And the built-in editor gives you a web-based
        alternative when you don't have Sheets open.
      </p>
      <h2>Built for Real Writers</h2>
      <p>
        We didn't build K-SheetPress for developers. We built it for writers, content creators, and teams
        who want to focus on their words, not their tools. The spreadsheet is just a familiar interface
        for what's actually a powerful publishing engine underneath.
      </p>
    </div>
  );
}
