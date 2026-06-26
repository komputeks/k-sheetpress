import { NextResponse } from 'next/server';
import supabaseServer from '@/lib/supabase-server';

// GET /api/stats - Public site stats
export async function GET() {
  try {
    const [postsRes, usersRes] = await Promise.all([
      supabaseServer.from('k_sheetpress_posts').select('id', { count: 'exact', head: true }).eq('post_status', 'published'),
      supabaseServer.from('k_sheetpress_profiles').select('id', { count: 'exact', head: true }),
    ]);

    return NextResponse.json({
      totalPosts: postsRes.count || 0,
      totalAuthors: usersRes.count || 0,
    });
  } catch (err) {
    console.error('GET /api/stats error:', err);
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}
