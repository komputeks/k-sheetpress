'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { Heart, MessageCircle, Calendar, User, Tag, Share2, Loader2 } from 'lucide-react';
import { Skeleton } from '@/components/Skeleton';
import { formatDate } from '@/lib/utils';

const MarkdownPreview = dynamic(() => import('@/components/MarkdownPreview'), { ssr: false });

interface PostData {
  id: string; post_title: string; post_slug: string; cat1: string; cat2: string;
  post_description: string; post_excerpt: string; post_content: string;
  post_tags: string[]; post_status: string; post_likes: number;
  featured_image: string | null; created_at: string; updated_at: string;
  author_username: string; author_display_name: string;
  author_avatar: string | null; author_bio: string | null; comments_count: number;
}

export function PostDetailPage({ params }: { params: Promise<{ cat1: string; cat2: string; slug: string }> }) {
  const { cat1, cat2, slug } = useParams<{ cat1: string; cat2: string; slug: string }>();
  const [post, setPost] = useState<PostData | null>(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [comments, setComments] = useState<any[]>([]);
  const [commentName, setCommentName] = useState('');
  const [commentContent, setCommentContent] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);

  useEffect(() => { fetchPost(); }, [cat1, cat2, slug]);

  const fetchPost = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/posts/by-slug?cat1=${cat1}&cat2=${cat2}&slug=${slug}`);
      if (res.ok) { const data = await res.json(); setPost(data); setLikeCount(data.post_likes || 0); fetchComments(data.id); }
    } catch {} finally { setLoading(false); }
  };

  const fetchComments = async (postId: string) => { try { const res = await fetch(`/api/comments?post_id=${postId}`); if (res.ok) setComments(await res.json()); } catch {} };

  const handleLike = async () => {
    try { const res = await fetch('/api/posts/like', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ post_id: post?.id }) });
      if (res.ok) { setLiked(!liked); setLikeCount(liked ? likeCount - 1 : likeCount + 1); } } catch {}
  };

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault(); if (!post || !commentName.trim() || !commentContent.trim()) return;
    setSubmittingComment(true);
    try { const res = await fetch('/api/comments', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ post_id: post.id, author_name: commentName, content: commentContent }) });
      if (res.ok) { setCommentContent(''); fetchComments(post.id); } } catch {} finally { setSubmittingComment(false); }
  };

  const handleShare = async () => { if (navigator.share) await navigator.share({ title: post?.post_title, url: window.location.href }); else { await navigator.clipboard.writeText(window.location.href); alert('Link copied!'); } };

  if (loading) return <div className="relative min-h-screen"><div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-brand-900/20 via-surface-950 to-surface-950" /><div className="relative z-10 mx-auto max-w-3xl px-6 py-8"><Skeleton className="mb-4 h-4 w-32" /><Skeleton className="mb-2 h-10 w-3/4" /><Skeleton className="mb-8 h-6 w-1/2" /><Skeleton className="mb-4 h-64 w-full" /></div></div>;
  if (!post) return <div className="relative min-h-screen flex items-center justify-center"><div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-brand-900/20 via-surface-950 to-surface-950" /><div className="relative z-10 text-center"><h1 className="font-display text-2xl font-bold">Post not found</h1><Link href="/" className="btn-primary mt-6">Go Home</Link></div></div>;

  return (
    <article className="relative min-h-screen">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-brand-900/20 via-surface-950 to-surface-950" />
      <div className="relative z-10 mx-auto max-w-3xl px-6 py-8">
        <nav className="mb-6 flex items-center gap-2 text-sm text-white/40">
          <Link href="/" className="hover:text-white transition-colors">Home</Link><span>/</span>
          <Link href={`/explore?cat1=${post.cat1}`} className="hover:text-white transition-colors">{post.cat1}</Link><span>/</span>
          <Link href={`/explore?cat1=${post.cat1}&cat2=${post.cat2}`} className="hover:text-white transition-colors">{post.cat2}</Link><span>/</span>
          <span className="text-white">{post.post_slug}</span>
        </nav>
        <header className="mb-8">
          <div className="mb-3 flex items-center gap-2 text-xs">
            <span className="rounded-full bg-brand-500/20 px-2.5 py-0.5 font-medium text-brand-400">{post.cat1}</span>
            <span className="text-white/20">/</span>
            <span className="rounded-full bg-white/5 px-2.5 py-0.5 font-medium text-white/60">{post.cat2}</span>
          </div>
          <h1 className="font-display text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">{post.post_title}</h1>
          {post.post_excerpt && <p className="mt-3 text-lg text-white/60">{post.post_excerpt}</p>}
          <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-white/40">
            <Link href={`/profile/${post.author_username}`} className="flex items-center gap-2 hover:text-brand-400 transition-colors">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-500/20"><User className="h-4 w-4 text-brand-400" /></div>
              {post.author_display_name || `@${post.author_username}`}
            </Link>
            <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" />{formatDate(post.created_at)}</span>
            <span className="flex items-center gap-1"><MessageCircle className="h-3.5 w-3.5" />{post.comments_count} comments</span>
          </div>
          {post.post_tags && post.post_tags.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">{post.post_tags.map((tag) => (
              <span key={tag} className="inline-flex items-center gap-1 rounded-full bg-white/5 px-2.5 py-0.5 text-xs font-medium text-white/60"><Tag className="h-3 w-3" />{tag}</span>
            ))}</div>
          )}
        </header>
        {post.featured_image && <div className="mb-8 overflow-hidden rounded-2xl"><img src={post.featured_image} alt={post.post_title} className="w-full object-cover" /></div>}
        <div className="mb-8 prose prose-invert prose-sm max-w-none prose-headings:font-display prose-a:text-brand-400">
          <MarkdownPreview content={post.post_content} />
        </div>
        <div className="mb-12 flex items-center gap-4 border-t border-white/10 pt-6">
          <button onClick={handleLike} className={`flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-medium transition-all duration-300 ${liked ? 'border-red-500/30 bg-red-500/10 text-red-400' : 'border-white/10 hover:bg-white/5 text-white/60'}`}>
            <Heart className={`h-4 w-4 ${liked ? 'fill-current' : ''}`} />{likeCount} {likeCount === 1 ? 'Like' : 'Likes'}
          </button>
          <button onClick={handleShare} className="flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2 text-sm font-medium text-white/60 transition-all duration-300 hover:bg-white/5">
            <Share2 className="h-4 w-4" /> Share
          </button>
        </div>
        <section className="border-t border-white/10 pt-8">
          <h2 className="font-display text-xl font-semibold">Comments ({comments.length})</h2>
          <form onSubmit={handleComment} className="mt-6 space-y-4">
            <input type="text" value={commentName} onChange={(e) => setCommentName(e.target.value)} placeholder="Your name" required className="input-field max-w-xs" />
            <textarea value={commentContent} onChange={(e) => setCommentContent(e.target.value)} placeholder="Write a comment..." required rows={3} className="input-field" />
            <button type="submit" disabled={submittingComment} className="btn-primary text-sm">{submittingComment ? 'Posting...' : 'Post Comment'}</button>
          </form>
          <div className="mt-8 space-y-4">
            {comments.map((comment: any) => (
              <div key={comment.id} className="glass-card p-4">
                <div className="flex items-center justify-between"><span className="text-sm font-semibold">{comment.author_name}</span><span className="text-xs text-white/40">{formatDate(comment.created_at)}</span></div>
                <p className="mt-2 text-sm text-white/80">{comment.content}</p>
              </div>
            ))}
            {comments.length === 0 && <p className="text-sm text-white/40">No comments yet. Be the first!</p>}
          </div>
        </section>
      </div>
    </article>
  );
}
