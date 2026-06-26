'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { PostCard } from '@/components/PostCard';
import { Pagination } from '@/components/Pagination';
import { PostListSkeleton, Skeleton } from '@/components/Skeleton';
import type { KSheetpressProfile } from '@/types';
import { User, Globe, Calendar, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { formatDate } from '@/lib/utils';

export function ProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = useParams<{ username: string }>();
  const [profile, setProfile] = useState<KSheetpressProfile | null>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [total, setTotal] = useState(0);

  useEffect(() => { fetchProfile(); fetchPosts(); }, [username]);
  useEffect(() => { fetchPosts(); }, [page]);

  const fetchProfile = async () => { try { const res = await fetch(`/api/profile/${username}`); if (res.ok) setProfile(await res.json()); } catch {} };
  const fetchPosts = async () => {
    setLoading(true);
    try { const res = await fetch(`/api/posts?author=${username}&page=${page}&limit=12`); if (res.ok) { const data = await res.json(); setPosts(data.posts || []); setTotal(data.total || 0); setTotalPages(data.totalPages || 0); } } catch {} finally { setLoading(false); }
  };

  return (
    <div className="relative min-h-screen">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-brand-900/20 via-surface-950 to-surface-950" />
      <div className="relative z-10 mx-auto max-w-7xl px-6 py-8">
        <Link href="/explore" className="btn-ghost gap-2 text-xs mb-6"><ArrowLeft className="h-4 w-4" /> Back to Explore</Link>
        <div className="mb-8 flex items-start gap-6">
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-brand-500/20">
            {profile?.avatar_url ? <img src={profile.avatar_url} alt={profile.display_name || profile.username} className="h-full w-full rounded-2xl object-cover" /> : <User className="h-10 w-10 text-brand-400" />}
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold">{profile?.display_name || `@${username}`}</h1>
            <p className="text-sm text-white/60">@{username}</p>
            {profile?.bio && <p className="mt-2 text-sm text-white/80">{profile.bio}</p>}
            <div className="mt-2 flex items-center gap-4 text-xs text-white/40">
              {profile?.website && <a href={profile.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-brand-400 transition-colors"><Globe className="h-3 w-3" /> Website</a>}
              {profile?.created_at && <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> Joined {formatDate(profile.created_at)}</span>}
              <span>{total} posts</span>
            </div>
          </div>
        </div>
        {loading ? <PostListSkeleton /> : posts.length === 0 ? (
          <div className="glass-card p-12 text-center"><p className="text-white/40">No published posts yet.</p></div>
        ) : (
          <><div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{posts.map((post) => <PostCard key={post.id} post={post} />)}</div>
          <Pagination currentPage={page} totalPages={totalPages} basePath={`/profile/${username}`} /></>
        )}
      </div>
    </div>
  );
}
