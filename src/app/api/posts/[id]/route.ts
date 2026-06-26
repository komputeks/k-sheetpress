import { NextRequest, NextResponse } from 'next/server';
import supabaseServer from '@/lib/supabase-server';
import { createUserClient } from '@/lib/supabase-user';
import { slugify } from '@/lib/utils';

// GET /api/posts/[id] - Get a single post
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { data, error } = await supabaseServer
      .from('k_sheetpress_posts')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    if (!data) return NextResponse.json({ error: 'Post not found' }, { status: 404 });

    // Fetch author profile separately
    const { data: profile } = await supabaseServer
      .from('k_sheetpress_profiles')
      .select('username, display_name, avatar_url')
      .eq('user_id', data.user_id)
      .maybeSingle();

    const post = {
      ...data,
      author_username: profile?.username,
      author_display_name: profile?.display_name,
      author_avatar: profile?.avatar_url,
    };

    return NextResponse.json(post);
  } catch (err) {
    console.error('GET /api/posts/[id] error:', err);
    return NextResponse.json({ error: 'Failed to fetch post' }, { status: 500 });
  }
}

// PUT /api/posts/[id] - Update a post
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const token = req.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const userClient = createUserClient(token);
    const { data: { user } } = await userClient.auth.getUser(token);
    if (!user) return NextResponse.json({ error: 'Invalid token' }, { status: 401 });

    const body = await req.json();
    const updates: Record<string, any> = { updated_at: new Date().toISOString() };

    if (body.post_title) { updates.post_title = body.post_title; updates.post_slug = slugify(body.post_title); }
    if (body.cat1 !== undefined) updates.cat1 = body.cat1;
    if (body.cat2 !== undefined) updates.cat2 = body.cat2;
    if (body.post_description !== undefined) updates.post_description = body.post_description;
    if (body.post_excerpt !== undefined) updates.post_excerpt = body.post_excerpt;
    if (body.post_content !== undefined) updates.post_content = body.post_content;
    if (body.post_tags !== undefined) updates.post_tags = body.post_tags;
    if (body.post_status !== undefined) updates.post_status = body.post_status;
    if (body.featured_image !== undefined) updates.featured_image = body.featured_image;

    const { data, error } = await supabaseServer
      .from('k_sheetpress_posts')
      .update(updates)
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) throw error;
    if (!data) return NextResponse.json({ error: 'Post not found or not owned' }, { status: 404 });

    // Sync to Google Sheet
    syncToSheet(user.id, data).catch(console.error);

    return NextResponse.json(data);
  } catch (err) {
    console.error('PUT /api/posts/[id] error:', err);
    return NextResponse.json({ error: 'Failed to update post' }, { status: 500 });
  }
}

// DELETE /api/posts/[id] - Delete a post
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const token = req.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const userClient = createUserClient(token);
    const { data: { user } } = await userClient.auth.getUser(token);
    if (!user) return NextResponse.json({ error: 'Invalid token' }, { status: 401 });

    const { error } = await supabaseServer
      .from('k_sheetpress_posts')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) throw error;

    // Delete from Google Sheet
    deleteFromSheet(user.id, id).catch(console.error);

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('DELETE /api/posts/[id] error:', err);
    return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 });
  }
}

async function syncToSheet(userId: string, post: any) {
  try {
    const { data: sheet } = await supabaseServer
      .from('k_sheetpress_user_sheets')
      .select('*')
      .eq('user_id', userId)
      .eq('is_initialized', true)
      .maybeSingle();
    if (!sheet) return;

    const { updateSheetRow } = await import('@/lib/google-sheets');
    const rowData = {
      post_id: post.id,
      post_title: post.post_title,
      post_slug: post.post_slug,
      cat1: post.cat1,
      cat2: post.cat2,
      post_description: post.post_description || '',
      post_excerpt: post.post_excerpt || '',
      post_content: post.post_content || '',
      post_tags: (post.post_tags || []).join(','),
      post_status: post.post_status,
      post_likes: String(post.post_likes || 0),
      post_comments_count: '0',
      featured_image: post.featured_image || '',
      created_at: post.created_at,
      updated_at: post.updated_at,
    };
    await updateSheetRow(sheet.spreadsheet_id, post.id, rowData);
  } catch (err) {
    console.error('Sheet sync error:', err);
  }
}

async function deleteFromSheet(userId: string, postId: string) {
  try {
    const { data: sheet } = await supabaseServer
      .from('k_sheetpress_user_sheets')
      .select('*')
      .eq('user_id', userId)
      .eq('is_initialized', true)
      .maybeSingle();
    if (!sheet) return;

    const { deleteSheetRow } = await import('@/lib/google-sheets');
    await deleteSheetRow(sheet.spreadsheet_id, postId);
  } catch (err) {
    console.error('Sheet delete error:', err);
  }
}
