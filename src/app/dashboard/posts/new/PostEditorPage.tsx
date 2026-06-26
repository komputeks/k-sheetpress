'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/providers/AuthProvider';
import { supabase } from '@/lib/supabase-client';
import { ArrowLeft, Loader2, Eye, Edit3 } from 'lucide-react';
import dynamic from 'next/dynamic';
import Link from 'next/link';

const MarkdownPreview = dynamic(() => import('@/components/MarkdownPreview'), { ssr: false });

export function PostEditorPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [cat1, setCat1] = useState('');
  const [cat2, setCat2] = useState('');
  const [description, setDescription] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [status, setStatus] = useState<'draft' | 'published'>('draft');
  const [featuredImage, setFeaturedImage] = useState('');
  const [saving, setSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim() || !cat1.trim() || !cat2.trim()) {
      setError('Title, content, and categories are required');
      return;
    }
    setSaving(true);
    setError('');
    try {
      // Get auth token
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData.session?.access_token || '';
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch('/api/posts', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          post_title: title,
          cat1,
          cat2,
          post_description: description,
          post_excerpt: excerpt,
          post_content: content,
          post_tags: tags.split(',').map(t => t.trim()).filter(Boolean),
          post_status: status,
          featured_image: featuredImage || null,
        }),
      });
      if (res.ok) {
        router.push('/dashboard');
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to save post');
      }
    } catch {
      setError('Failed to save post. Check your network connection.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <div className="mb-6 flex items-center justify-between">
        <Link href="/dashboard" className="flex items-center gap-2 text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)]">
          <ArrowLeft className="h-4 w-4" /> Back to Dashboard
        </Link>
        <button
          type="button"
          onClick={() => setShowPreview(!showPreview)}
          className="btn-secondary text-xs"
        >
          {showPreview ? <Edit3 className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
          {showPreview ? 'Edit' : 'Preview'}
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        {error && (
          <div className="mb-4 rounded-lg bg-accent-50 p-3 text-sm text-accent-700 dark:bg-accent-950 dark:text-accent-300">
            {error}
          </div>
        )}

        <div className="space-y-6">
          {/* Title */}
          <div>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Post title..."
              className="w-full border-0 bg-transparent font-heading text-3xl font-bold placeholder:text-[var(--muted-foreground)] focus:outline-none"
              required
            />
          </div>

          {/* Categories & Tags */}
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-[var(--muted-foreground)]">Category 1 *</label>
              <input type="text" value={cat1} onChange={(e) => setCat1(e.target.value)} placeholder="e.g. technology" className="input-field" required />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-[var(--muted-foreground)]">Category 2 *</label>
              <input type="text" value={cat2} onChange={(e) => setCat2(e.target.value)} placeholder="e.g. web-dev" className="input-field" required />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-[var(--muted-foreground)]">Tags (comma-separated)</label>
              <input type="text" value={tags} onChange={(e) => setTags(e.target.value)} placeholder="react, nextjs, typescript" className="input-field" />
            </div>
          </div>

          {/* Description & Excerpt */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-[var(--muted-foreground)]">Description</label>
              <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Short description for SEO" className="input-field" />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-[var(--muted-foreground)]">Excerpt</label>
              <input type="text" value={excerpt} onChange={(e) => setExcerpt(e.target.value)} placeholder="Brief excerpt for listing" className="input-field" />
            </div>
          </div>

          {/* Featured Image */}
          <div>
            <label className="mb-1.5 block text-xs font-medium text-[var(--muted-foreground)]">Featured Image URL</label>
            <input type="url" value={featuredImage} onChange={(e) => setFeaturedImage(e.target.value)} placeholder="https://example.com/image.jpg" className="input-field" />
          </div>

          {/* Content */}
          <div>
            <label className="mb-1.5 block text-xs font-medium text-[var(--muted-foreground)]">Content (Markdown)</label>
            {showPreview ? (
              <div className="min-h-[400px] rounded-lg border border-[var(--border)] bg-[var(--card)] p-6">
                <MarkdownPreview content={content} />
              </div>
            ) : (
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your post content in Markdown..."
                className="input-field min-h-[400px] font-mono text-sm"
                required
              />
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between border-t border-[var(--border)] pt-4">
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as 'draft' | 'published')}
              className="input-field w-auto"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
            <div className="flex gap-3">
              <Link href="/dashboard" className="btn-secondary">Cancel</Link>
              <button type="submit" disabled={saving} className="btn-primary">
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : status === 'published' ? 'Publish' : 'Save Draft'}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
