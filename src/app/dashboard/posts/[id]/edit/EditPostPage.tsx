'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/providers/AuthProvider';
import { ArrowLeft, Loader2, Eye, Edit3, Trash2 } from 'lucide-react';
import dynamic from 'next/dynamic';
import Link from 'next/link';

const MarkdownPreview = dynamic(() => import('@/components/MarkdownPreview'), { ssr: false });

export function EditPostPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const { user, session } = useAuth();
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
  const [deleting, setDeleting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showPreview, setShowPreview] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (id) fetchPost();
  }, [id]);

  const fetchPost = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/posts/${id}`);
      if (res.ok) {
        const post = await res.json();
        setTitle(post.post_title || '');
        setCat1(post.cat1 || '');
        setCat2(post.cat2 || '');
        setDescription(post.post_description || '');
        setExcerpt(post.post_excerpt || '');
        setContent(post.post_content || '');
        setTags((post.post_tags || []).join(', '));
        setStatus(post.post_status || 'draft');
        setFeaturedImage(post.featured_image || '');
      } else {
        setError('Post not found');
      }
    } catch {
      setError('Failed to load post');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim() || !cat1.trim() || !cat2.trim()) {
      setError('Title, content, and categories are required');
      return;
    }
    setSaving(true);
    setError('');
    try {
      const token = session?.access_token;
      const res = await fetch(`/api/posts/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
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
        setError(data.error || 'Failed to update post');
      }
    } catch {
      setError('Failed to update post');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this post? This cannot be undone.')) return;
    setDeleting(true);
    try {
      const token = session?.access_token;
      const res = await fetch(`/api/posts/${id}`, {
        method: 'DELETE',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (res.ok) {
        router.push('/dashboard');
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to delete post');
      }
    } catch {
      setError('Failed to delete post');
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
        <div className="space-y-4 animate-pulse">
          <div className="h-8 w-48 rounded bg-surface-muted" />
          <div className="h-10 w-3/4 rounded bg-surface-muted" />
          <div className="h-8 w-1/2 rounded bg-surface-muted" />
          <div className="h-64 w-full rounded bg-surface-muted" />
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <div className="mb-6 flex items-center justify-between">
        <Link href="/dashboard" className="flex items-center gap-2 text-sm text-surface-muted-foreground hover:text-surface-foreground">
          <ArrowLeft className="h-4 w-4" /> Back to Dashboard
        </Link>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setShowPreview(!showPreview)}
            className="btn-secondary text-xs"
          >
            {showPreview ? <Edit3 className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
            {showPreview ? 'Edit' : 'Preview'}
          </button>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-medium text-red-700 transition-colors hover:bg-red-100 disabled:opacity-50 dark:border-red-800 dark:bg-red-950 dark:text-red-300 dark:hover:bg-red-900"
          >
            {deleting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
            Delete
          </button>
        </div>
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
              className="w-full border-0 bg-transparent font-heading text-3xl font-bold placeholder:text-surface-muted-foreground focus:outline-none"
              required
            />
          </div>

          {/* Categories & Tags */}
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-surface-muted-foreground">Category 1 *</label>
              <input type="text" value={cat1} onChange={(e) => setCat1(e.target.value)} placeholder="e.g. technology" className="input-field" required />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-surface-muted-foreground">Category 2 *</label>
              <input type="text" value={cat2} onChange={(e) => setCat2(e.target.value)} placeholder="e.g. web-dev" className="input-field" required />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-surface-muted-foreground">Tags (comma-separated)</label>
              <input type="text" value={tags} onChange={(e) => setTags(e.target.value)} placeholder="react, nextjs, typescript" className="input-field" />
            </div>
          </div>

          {/* Description & Excerpt */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-surface-muted-foreground">Description</label>
              <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Short description for SEO" className="input-field" />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-surface-muted-foreground">Excerpt</label>
              <input type="text" value={excerpt} onChange={(e) => setExcerpt(e.target.value)} placeholder="Brief excerpt for listing" className="input-field" />
            </div>
          </div>

          {/* Featured Image */}
          <div>
            <label className="mb-1.5 block text-xs font-medium text-surface-muted-foreground">Featured Image URL</label>
            <input type="url" value={featuredImage} onChange={(e) => setFeaturedImage(e.target.value)} placeholder="https://example.com/image.jpg" className="input-field" />
          </div>

          {/* Content */}
          <div>
            <label className="mb-1.5 block text-xs font-medium text-surface-muted-foreground">Content (Markdown)</label>
            {showPreview ? (
              <div className="min-h-[400px] rounded-lg border border-surface-border bg-surface-card p-6">
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
          <div className="flex items-center justify-between border-t border-surface-border pt-4">
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
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
