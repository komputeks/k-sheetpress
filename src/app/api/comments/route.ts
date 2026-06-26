import { NextRequest, NextResponse } from 'next/server';
import supabaseServer from '@/lib/supabase-server';

// GET /api/comments - List comments for a post
export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const postId = url.searchParams.get('post_id');
    if (!postId) return NextResponse.json({ error: 'post_id required' }, { status: 400 });

    const { data, error } = await supabaseServer
      .from('k_sheetpress_comments')
      .select('*')
      .eq('post_id', postId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return NextResponse.json(data || []);
  } catch (err) {
    console.error('GET /api/comments error:', err);
    return NextResponse.json({ error: 'Failed to fetch comments' }, { status: 500 });
  }
}

// POST /api/comments - Create a comment
export async function POST(req: NextRequest) {
  try {
    const { post_id, author_name, content } = await req.json();
    if (!post_id || !author_name || !content) {
      return NextResponse.json({ error: 'post_id, author_name, and content are required' }, { status: 400 });
    }

    const { data, error } = await supabaseServer
      .from('k_sheetpress_comments')
      .insert({ post_id, author_name, content })
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data, { status: 201 });
  } catch (err) {
    console.error('POST /api/comments error:', err);
    return NextResponse.json({ error: 'Failed to create comment' }, { status: 500 });
  }
}
