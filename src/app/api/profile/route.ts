import { NextRequest, NextResponse } from 'next/server';
import supabaseServer from '@/lib/supabase-server';
import { createUserClient } from '@/lib/supabase-user';

// GET /api/profile - Get current user's profile
export async function GET(req: NextRequest) {
  try {
    const token = req.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const userClient = createUserClient(token);
    const { data: { user } } = await userClient.auth.getUser(token);
    if (!user) return NextResponse.json({ error: 'Invalid token' }, { status: 401 });

    const { data } = await supabaseServer
      .from('k_sheetpress_profiles')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();

    return NextResponse.json(data || null);
  } catch (err) {
    console.error('GET /api/profile error:', err);
    return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 });
  }
}

// POST /api/profile - Create or update profile
export async function POST(req: NextRequest) {
  try {
    const token = req.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const userClient = createUserClient(token);
    const { data: { user } } = await userClient.auth.getUser(token);
    if (!user) return NextResponse.json({ error: 'Invalid token' }, { status: 401 });

    const body = await req.json();

    const { data: existing } = await supabaseServer
      .from('k_sheetpress_profiles')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();

    if (existing) {
      const { data, error } = await supabaseServer
        .from('k_sheetpress_profiles')
        .update({
          username: body.username || existing.username,
          display_name: body.display_name || existing.display_name,
          bio: body.bio !== undefined ? body.bio : existing.bio,
          website: body.website !== undefined ? body.website : existing.website,
          updated_at: new Date().toISOString(),
        })
        .eq('id', existing.id)
        .select()
        .single();
      if (error) throw error;
      return NextResponse.json(data);
    } else {
      const { data, error } = await supabaseServer
        .from('k_sheetpress_profiles')
        .insert({
          user_id: user.id,
          username: body.username || user.email?.split('@')[0] || 'user',
          display_name: body.display_name || null,
          bio: body.bio || null,
          website: body.website || null,
        })
        .select()
        .single();
      if (error) throw error;
      return NextResponse.json(data, { status: 201 });
    }
  } catch (err) {
    console.error('POST /api/profile error:', err);
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Failed to save profile' }, { status: 500 });
  }
}
