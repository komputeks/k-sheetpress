'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { PostCard } from '@/components/PostCard';
import { SearchBar } from '@/components/SearchBar';
import { Pagination } from '@/components/Pagination';
import { PostListSkeleton } from '@/components/Skeleton';
import { FileText } from 'lucide-react';

export function ExplorePage() {
  const searchParams = useSearchParams();
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(parseInt(searchParams.get('page') || '1'));
  const [totalPages, setTotalPages] = useState(0);
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [cat1, setCat1] = useState(searchParams.get('cat1') || '');
  const [cat2, setCat2] = useState(searchParams.get('cat2') || '');

  useEffect(() => { fetchPosts(); }, [page, search, cat1, cat2]);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: '12' });
      if (search) params.set('search', search);
      if (cat1) params.set('cat1', cat1);
      if (cat2) params.set('cat2', cat2);
      const res = await fetch(`/api/posts?${params}`);
      if (res.ok) { const data = await res.json(); setPosts(data.posts || []); setTotal(data.total || 0); setTotalPages(data.totalPages || 0); }
    } catch (err) { console.error('Fetch error:', err); }
    finally { setLoading(false); }
  };

  const handleSearch = (query: string) => { setSearch(query); setPage(1); };

  return (
    <div className="relative min-h-screen">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-brand-900/20 via-surface-950 to-surface-950" />
      <div className="relative z-10 mx-auto max-w-7xl px-6 py-8">
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold">Explore</h1>
          <p className="mt-2 text-white/60">Discover posts from K-SheetPress authors</p>
        </div>
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="flex-1"><SearchBar defaultValue={search} onSearch={handleSearch} /></div>
          <div className="flex gap-2">
            {cat1 && <button onClick={() => { setCat1(''); setCat2(''); setPage(1); }} className="rounded-full bg-brand-500/20 px-3 py-1 text-xs font-medium text-brand-400 hover:bg-brand-500/30 transition-colors">{cat1} ×</button>}
            {cat2 && <button onClick={() => { setCat2(''); setPage(1); }} className="rounded-full bg-white/5 px-3 py-1 text-xs font-medium text-white/60 hover:bg-white/10 transition-colors">{cat2} ×</button>}
          </div>
        </div>
        {loading ? <PostListSkeleton /> : posts.length === 0 ? (
          <div className="glass-card p-12 text-center">
            <FileText className="mx-auto h-12 w-12 text-white/20" />
            <h3 className="mt-4 font-display text-lg font-semibold">No posts found</h3>
            <p className="mt-1 text-sm text-white/40">{search ? 'Try a different search term' : 'Be the first to publish!'}</p>
          </div>
        ) : (
          <><div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{posts.map((post) => <PostCard key={post.id} post={post} />)}</div>
          <Pagination currentPage={page} totalPages={totalPages} basePath="/explore" searchParams={{ search, cat1, cat2 }} /></>
        )}
      </div>
    </div>
  );
}
