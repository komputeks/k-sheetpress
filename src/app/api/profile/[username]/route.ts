import { NextRequest, NextResponse } from 'next/server';
import supabaseServer from '@/lib/supabase-server';

// GET /api/profile/[username] - Get a public profile by username
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    const { username } = await params;
    const { data, error } = await supabaseServer
      .from('k_sheetpress_profiles')
      .select('*')
      .eq('username', username)
      .single();

    if (error || !data) return NextResponse.json({ error: 'Profile not found' }, { status: 404 });

    return NextResponse.json(data);
  } catch (err) {
    console.error('GET /api/profile/[username] error:', err);
    return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 });
  }
}
