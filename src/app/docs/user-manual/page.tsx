import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'User Manual',
  description: 'How to use K-SheetPress',
};

export default function UserManualPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 prose prose-sm dark:prose-invert max-w-none prose-headings:font-heading">
      <h1>User Manual</h1>

      <h2>Getting Started</h2>
      <h3>Step 1: Create an Account</h3>
      <p>
        Sign up with your Google account or email. If you use Google sign-in, your profile is created automatically.
        With email, you'll verify your address and choose a username.
      </p>

      <h3>Step 2: Create a Google Spreadsheet</h3>
      <p>
        Go to <a href="https://sheets.new" target="_blank" rel="noopener noreferrer">sheets.new</a> to create
        a new, empty Google Spreadsheet. You can name it anything — K-SheetPress will rename it for you.
      </p>

      <h3>Step 3: Share with the Service Account</h3>
      <p>
        Click the "Share" button in your spreadsheet and add the K-SheetPress service account email as an Editor.
        You'll find this email in your dashboard. This allows K-SheetPress to read and write your spreadsheet.
      </p>

      <h3>Step 4: Initialize Your Sheet</h3>
      <p>
        Copy the spreadsheet ID from your URL (the long string between <code>/d/</code> and <code>/edit</code>),
        paste it in the dashboard, and click "Initialize Sheet". This will:
      </p>
      <ul>
        <li>Rename your spreadsheet to "K-SheetPress - your-username"</li>
        <li>Add column headers (post_id, post_title, post_slug, cat1, cat2, etc.)</li>
        <li>Create a sample post to get you started</li>
        <li>Format the header row with styling</li>
      </ul>

      <h2>Writing Posts</h2>
      <h3>From the Web Editor</h3>
      <p>
        Click "New Post" in your dashboard. Fill in the title, categories, content (Markdown supported),
        and any optional fields. When you save, the post is stored in Supabase and automatically
        synced to your Google Sheet.
      </p>

      <h3>From Google Sheets</h3>
      <p>
        Add a new row in your spreadsheet. Fill in the columns:
      </p>
      <ul>
        <li><strong>post_id</strong>: Leave blank for new posts (auto-generated)</li>
        <li><strong>post_title</strong>: Your post title</li>
        <li><strong>post_slug</strong>: Auto-generated from title, or set manually</li>
        <li><strong>cat1</strong>: Primary category (e.g., "technology")</li>
        <li><strong>cat2</strong>: Subcategory (e.g., "web-dev")</li>
        <li><strong>post_description</strong>: SEO description</li>
        <li><strong>post_excerpt</strong>: Brief excerpt for listings</li>
        <li><strong>post_content</strong>: Full post content (Markdown)</li>
        <li><strong>post_tags</strong>: Comma-separated tags</li>
        <li><strong>post_status</strong>: "draft" or "published"</li>
      </ul>
      <p>
        After editing in Sheets, click "Sync Now" in your dashboard to pull changes into Supabase.
      </p>

      <h2>Permalink Structure</h2>
      <p>
        Every published post gets a clean URL: <code>/cat1/cat2/post-slug</code>.
        For example, a post with cat1="technology", cat2="web-dev", and slug="hello-world" would be
        accessible at <code>/technology/web-dev/hello-world</code>.
      </p>

      <h2>Your Public Profile</h2>
      <p>
        Every author has a public profile at <code>/profile/username</code> that lists all their
        published posts with search and pagination.
      </p>

      <h2>Syncing</h2>
      <p>
        K-SheetPress supports bi-directional sync:
      </p>
      <ul>
        <li><strong>Supabase → Sheets</strong>: Automatic when you create or edit a post via the web editor</li>
        <li><strong>Sheets → Supabase</strong>: Click "Sync Now" in the dashboard to pull changes</li>
      </ul>
    </div>
  );
}
