import { NextRequest, NextResponse } from 'next/server';
import supabaseServer from '@/lib/supabase-server';

// GET /api/posts/by-slug - Find post by cat1/cat2/slug
export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const cat1 = url.searchParams.get('cat1');
    const cat2 = url.searchParams.get('cat2');
    const slug = url.searchParams.get('slug');

    if (!cat1 || !cat2 || !slug) {
      return NextResponse.json({ error: 'cat1, cat2, and slug are required' }, { status: 400 });
    }

    const { data, error } = await supabaseServer
      .from('k_sheetpress_posts')
      .select('*')
      .eq('cat1', cat1)
      .eq('cat2', cat2)
      .eq('post_slug', slug)
      .eq('post_status', 'published')
      .maybeSingle();

    if (error) throw error;
    if (!data) return NextResponse.json({ error: 'Post not found' }, { status: 404 });

    // Fetch author profile separately
    const { data: profile } = await supabaseServer
      .from('k_sheetpress_profiles')
      .select('username, display_name, avatar_url, bio')
      .eq('user_id', data.user_id)
      .maybeSingle();

    // Get comments count
    const { count: commentsCount } = await supabaseServer
      .from('k_sheetpress_comments')
      .select('*', { count: 'exact', head: true })
      .eq('post_id', data.id);

    const post = {
      ...data,
      author_username: profile?.username,
      author_display_name: profile?.display_name,
      author_avatar: profile?.avatar_url,
      author_bio: profile?.bio,
      comments_count: commentsCount || 0,
    };

    return NextResponse.json(post);
  } catch (err) {
    console.error('GET /api/posts/by-slug error:', err);
    return NextResponse.json({ error: 'Failed to fetch post' }, { status: 500 });
  }
}
