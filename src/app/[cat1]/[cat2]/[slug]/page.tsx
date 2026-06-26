import type { Metadata } from 'next';
import { PostDetailPage } from './PostDetailPage';

export async function generateMetadata({ params }: { params: Promise<{ cat1: string; cat2: string; slug: string }> }): Promise<Metadata> {
  const { cat1, cat2, slug } = await params;
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/posts/by-slug?cat1=${cat1}&cat2=${cat2}&slug=${slug}`, { next: { revalidate: 60 } });
    if (!res.ok) return { title: 'Post Not Found' };
    const post = await res.json();
    return {
      title: post.post_title,
      description: post.post_excerpt || post.post_description,
      openGraph: {
        title: post.post_title,
        description: post.post_excerpt || post.post_description,
        type: 'article',
        publishedTime: post.created_at,
        modifiedTime: post.updated_at,
        authors: [post.author_display_name || post.author_username],
        tags: post.post_tags,
        images: post.featured_image ? [{ url: post.featured_image }] : undefined,
      },
      twitter: {
        card: 'summary_large_image',
        title: post.post_title,
        description: post.post_excerpt || post.post_description,
      },
    };
  } catch {
    return { title: 'Post' };
  }
}

export default function PostPageRoute({ params }: { params: Promise<{ cat1: string; cat2: string; slug: string }> }) {
  return <PostDetailPage params={params} />;
}
