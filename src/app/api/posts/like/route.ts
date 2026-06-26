import { NextRequest, NextResponse } from 'next/server';
import supabaseServer from '@/lib/supabase-server';

// POST /api/posts/like - Like a post
export async function POST(req: NextRequest) {
  try {
    const { post_id } = await req.json();
    if (!post_id) return NextResponse.json({ error: 'post_id required' }, { status: 400 });

    // Increment likes count
    const { data: post } = await supabaseServer
      .from('k_sheetpress_posts')
      .select('post_likes')
      .eq('id', post_id)
      .single();

    if (!post) return NextResponse.json({ error: 'Post not found' }, { status: 404 });

    const { error } = await supabaseServer
      .from('k_sheetpress_posts')
      .update({ post_likes: (post.post_likes || 0) + 1 })
      .eq('id', post_id);

    if (error) throw error;

    return NextResponse.json({ ok: true, likes: (post.post_likes || 0) + 1 });
  } catch (err) {
    console.error('POST /api/posts/like error:', err);
    return NextResponse.json({ error: 'Failed to like post' }, { status: 500 });
  }
}
