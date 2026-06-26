import { NextRequest, NextResponse } from 'next/server';
import supabaseServer from '@/lib/supabase-server';
import { createUserClient } from '@/lib/supabase-user';
import { slugify } from '@/lib/utils';

// GET /api/posts - List posts
export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const mine = url.searchParams.get('mine');
    const author = url.searchParams.get('author');
    const cat1 = url.searchParams.get('cat1');
    const cat2 = url.searchParams.get('cat2');
    const search = url.searchParams.get('search');
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = Math.min(parseInt(url.searchParams.get('limit') || '12'), 50);
    const offset = (page - 1) * limit;

    let query = supabaseServer
      .from('k_sheetpress_posts')
      .select('*', { count: 'exact' });

    if (mine === 'true') {
      const token = req.headers.get('authorization')?.replace('Bearer ', '');
      if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      const userClient = createUserClient(token);
      const { data: { user } } = await userClient.auth.getUser(token);
      if (!user) return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
      query = query.eq('user_id', user.id);
    } else if (author) {
      query = query.eq('post_status', 'published');
      const { data: profile } = await supabaseServer
        .from('k_sheetpress_profiles')
        .select('user_id')
        .eq('username', author)
        .single();
      if (profile) query = query.eq('user_id', profile.user_id);
      else return NextResponse.json({ posts: [], total: 0, page, totalPages: 0 });
    } else {
      query = query.eq('post_status', 'published');
    }

    if (cat1) query = query.eq('cat1', cat1);
    if (cat2) query = query.eq('cat2', cat2);
    if (search) {
      query = query.or(`post_title.ilike.%${search}%,post_description.ilike.%${search}%`);
    }

    const { data, error, count } = await query
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error('Supabase query error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Fetch profiles for authors
    const userIds = [...new Set((data || []).map((p: any) => p.user_id))];
    let profileMap = new Map();
    if (userIds.length > 0) {
      const { data: profiles } = await supabaseServer
        .from('k_sheetpress_profiles')
        .select('user_id, username, display_name')
        .in('user_id', userIds);
      profileMap = new Map((profiles || []).map((p: any) => [p.user_id, p]));
    }

    const posts = (data || []).map((post: any) => ({
      ...post,
      author_username: profileMap.get(post.user_id)?.username,
      author_display_name: profileMap.get(post.user_id)?.display_name,
    }));

    return NextResponse.json({
      posts,
      total: count || 0,
      page,
      totalPages: Math.ceil((count || 0) / limit),
    });
  } catch (err) {
    console.error('GET /api/posts error:', err);
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Unknown error' }, { status: 500 });
  }
}

// POST /api/posts - Create a new post
export async function POST(req: NextRequest) {
  try {
    const token = req.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const userClient = createUserClient(token);
    const { data: { user } } = await userClient.auth.getUser(token);
    if (!user) return NextResponse.json({ error: 'Invalid token' }, { status: 401 });

    const body = await req.json();
    const slug = slugify(body.post_title);

    const { data: existing } = await supabaseServer
      .from('k_sheetpress_posts')
      .select('id')
      .eq('user_id', user.id)
      .eq('post_slug', slug)
      .maybeSingle();

    const finalSlug = existing ? `${slug}-${Date.now()}` : slug;

    const { data, error } = await supabaseServer
      .from('k_sheetpress_posts')
      .insert({
        user_id: user.id,
        post_title: body.post_title,
        post_slug: finalSlug,
        cat1: body.cat1 || 'uncategorized',
        cat2: body.cat2 || 'general',
        post_description: body.post_description || '',
        post_excerpt: body.post_excerpt || '',
        post_content: body.post_content,
        post_tags: body.post_tags || [],
        post_status: body.post_status || 'draft',
        post_likes: 0,
        featured_image: body.featured_image || null,
      })
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data, { status: 201 });
  } catch (err) {
    console.error('POST /api/posts error:', err);
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Failed to create post' }, { status: 500 });
  }
}
