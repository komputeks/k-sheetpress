'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/providers/AuthProvider';
import { supabase } from '@/lib/supabase-client';
import { ArrowLeft, Loader2, Eye, Edit3, Sparkles, Settings } from 'lucide-react';
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

  // AI generation state
  const [showAiModal, setShowAiModal] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiKey, setAiKey] = useState('');
  const [aiGenerating, setAiGenerating] = useState(false);
  const [aiError, setAiError] = useState('');
  const [defaultAiKey, setDefaultAiKey] = useState('');

  // Load default AI key from settings
  useEffect(() => {
    fetch('/api/admin/settings')
      .then(r => r.ok ? r.json() : {})
      .then((s: any) => setDefaultAiKey(s?.default_ai_key || ''))
      .catch(() => {});
  }, []);

  const handleAiGenerate = async () => {
    if (!aiPrompt.trim()) return;
    setAiGenerating(true);
    setAiError('');
    try {
      const keyToUse = aiKey || defaultAiKey;
      if (!keyToUse) {
        setAiError('No API key available. Enter your OpenAI API key or ask the admin to set a default key.');
        setAiGenerating(false);
        return;
      }
      const res = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: aiPrompt, apiKey: keyToUse, provider: 'openai' }),
      });
      const data = await res.json();
      if (res.ok) {
        setContent(data.content);
        if (data.title && !title) setTitle(data.title);
        setShowAiModal(false);
        setAiPrompt('');
      } else {
        setAiError(data.error || 'AI generation failed');
      }
    } catch {
      setAiError('AI generation failed. Check your network connection.');
    } finally {
      setAiGenerating(false);
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
      const { data: { session } } = await supabase.auth.getSession();
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (session?.access_token) headers['Authorization'] = `Bearer ${session.access_token}`;

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
      setError('Failed to save post');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <div className="mb-6 flex items-center justify-between">
        <Link href="/dashboard" className="flex items-center gap-2 text-sm text-white/40 hover:text-white transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to Dashboard
        </Link>
        <div className="flex gap-2">
          <button type="button" onClick={() => setShowAiModal(true)} className="btn-secondary text-xs gap-1.5">
            <Sparkles className="h-3.5 w-3.5" /> AI Generate
          </button>
          <button type="button" onClick={() => setShowPreview(!showPreview)} className="btn-secondary text-xs">
            {showPreview ? <Edit3 className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
            {showPreview ? 'Edit' : 'Preview'}
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {error && (
          <div className="mb-4 rounded-xl bg-red-500/10 border border-red-500/20 p-3 text-sm text-red-400">{error}</div>
        )}

        <div className="space-y-6">
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Post title..." className="w-full border-0 bg-transparent font-display text-3xl font-bold placeholder:text-white/20 focus:outline-none" required />

          <div className="grid gap-4 sm:grid-cols-3">
            <div><label className="mb-1.5 block text-xs font-medium text-white/40">Category 1 *</label><input type="text" value={cat1} onChange={(e) => setCat1(e.target.value)} placeholder="e.g. technology" className="input-field" required /></div>
            <div><label className="mb-1.5 block text-xs font-medium text-white/40">Category 2 *</label><input type="text" value={cat2} onChange={(e) => setCat2(e.target.value)} placeholder="e.g. web-dev" className="input-field" required /></div>
            <div><label className="mb-1.5 block text-xs font-medium text-white/40">Tags (comma-separated)</label><input type="text" value={tags} onChange={(e) => setTags(e.target.value)} placeholder="react, nextjs" className="input-field" /></div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div><label className="mb-1.5 block text-xs font-medium text-white/40">Description</label><input type="text" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Short description for SEO" className="input-field" /></div>
            <div><label className="mb-1.5 block text-xs font-medium text-white/40">Excerpt</label><input type="text" value={excerpt} onChange={(e) => setExcerpt(e.target.value)} placeholder="Brief excerpt for listing" className="input-field" /></div>
          </div>

          <div><label className="mb-1.5 block text-xs font-medium text-white/40">Featured Image URL</label><input type="url" value={featuredImage} onChange={(e) => setFeaturedImage(e.target.value)} placeholder="https://example.com/image.jpg" className="input-field" /></div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-white/40">Content (Markdown)</label>
            {showPreview ? (
              <div className="min-h-[400px] rounded-xl border border-white/10 bg-white/5 p-6"><MarkdownPreview content={content} /></div>
            ) : (
              <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="Write your post content in Markdown..." className="input-field min-h-[400px] font-mono text-sm" required />
            )}
          </div>

          <div className="flex items-center justify-between border-t border-white/10 pt-4">
            <select value={status} onChange={(e) => setStatus(e.target.value as 'draft' | 'published')} className="input-field w-auto">
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
            <div className="flex gap-3">
              <Link href="/dashboard" className="btn-secondary">Cancel</Link>
              <button type="submit" disabled={saving} className="btn-primary">{saving ? <Loader2 className="h-4 w-4 animate-spin" /> : status === 'published' ? 'Publish' : 'Save Draft'}</button>
            </div>
          </div>
        </div>
      </form>

      {/* AI Generation Modal */}
      {showAiModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="glass-card w-full max-w-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="rounded-xl bg-brand-500/20 p-2 text-brand-400"><Sparkles className="h-5 w-5" /></div>
              <div>
                <h3 className="font-display text-lg font-semibold">AI Post Generator</h3>
                <p className="text-xs text-white/40">Describe what you want to write about</p>
              </div>
            </div>
            {aiError && <div className="mb-4 rounded-xl bg-red-500/10 border border-red-500/20 p-3 text-sm text-red-400">{aiError}</div>}
            <textarea value={aiPrompt} onChange={(e) => setAiPrompt(e.target.value)} placeholder="E.g., Write a comprehensive guide about building REST APIs with Next.js, including best practices and code examples..." rows={4} className="input-field mb-3" />
            {!defaultAiKey && (
              <div className="mb-3">
                <label className="mb-1.5 block text-xs font-medium text-white/40">Your OpenAI API Key</label>
                <input type="password" value={aiKey} onChange={(e) => setAiKey(e.target.value)} placeholder="sk-..." className="input-field text-xs" />
                <p className="mt-1 text-xs text-white/30">Your key is used only for this request and is never stored.</p>
              </div>
            )}
            <div className="flex justify-end gap-3">
              <button type="button" onClick={() => { setShowAiModal(false); setAiError(''); }} className="btn-secondary text-xs">Cancel</button>
              <button type="button" onClick={handleAiGenerate} disabled={aiGenerating || !aiPrompt.trim()} className="btn-primary text-xs">
                {aiGenerating ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <><Sparkles className="h-3.5 w-3.5" /> Generate</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
