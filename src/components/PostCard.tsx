'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Heart, MessageCircle, Calendar } from 'lucide-react';
import type { KSheetpressPost } from '@/types';
import { formatDate, truncate } from '@/lib/utils';

interface PostCardProps {
  post: KSheetpressPost & { author_username?: string; comments_count?: number };
}

export function PostCard({ post }: PostCardProps) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.post_likes);

  const handleLike = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const res = await fetch('/api/posts/like', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ post_id: post.id }),
      });
      if (res.ok) {
        setLiked(!liked);
        setLikeCount(liked ? likeCount - 1 : likeCount + 1);
      }
    } catch {}
  };

  const href = `/${post.cat1}/${post.cat2}/${post.post_slug}`;

  return (
    <article className="glass-card overflow-hidden hover:bg-white/10 transition-all duration-300 group">
      <Link href={href}>
        {post.featured_image && (
          <div className="aspect-video w-full overflow-hidden">
            <img
              src={post.featured_image}
              alt={post.post_title}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        )}
        <div className="p-5">
          <div className="mb-3 flex items-center gap-2 text-xs">
            <span className="rounded-full bg-brand-500/20 px-2.5 py-0.5 font-medium text-brand-400">
              {post.cat1}
            </span>
            <span className="text-white/20">/</span>
            <span className="rounded-full bg-white/5 px-2.5 py-0.5 font-medium text-white/60">
              {post.cat2}
            </span>
          </div>
          <h3 className="font-display text-lg font-semibold leading-snug text-white group-hover:text-brand-400 transition-colors">
            {post.post_title}
          </h3>
          <p className="mt-2 text-sm text-white/50 line-clamp-2">
            {post.post_excerpt || truncate(post.post_description || post.post_content, 140)}
          </p>
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center gap-3 text-xs text-white/40">
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {formatDate(post.created_at)}
              </span>
              {post.author_username && (
                <span className="hover:text-brand-400 transition-colors">
                  @{post.author_username}
                </span>
              )}
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleLike}
                className={`flex items-center gap-1 text-xs transition-colors ${liked ? 'text-red-400' : 'text-white/40 hover:text-red-400'}`}
              >
                <Heart className={`h-3.5 w-3.5 ${liked ? 'fill-current' : ''}`} />
                {likeCount}
              </button>
              <span className="flex items-center gap-1 text-xs text-white/40">
                <MessageCircle className="h-3.5 w-3.5" />
                {post.comments_count || 0}
              </span>
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
}
