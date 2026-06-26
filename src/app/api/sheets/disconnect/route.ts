import { NextRequest, NextResponse } from 'next/server';
import supabaseServer from '@/lib/supabase-server';
import { createUserClient } from '@/lib/supabase-user';

/**
 * DELETE /api/sheets/disconnect
 * Removes the sheet record and deletes all user's posts from Supabase.
 * The Google Sheet itself is NOT touched.
 */
export async function DELETE(req: NextRequest) {
  try {
    const token = req.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const userClient = createUserClient(token);
    const { data: { user } } = await userClient.auth.getUser(token);
    if (!user) return NextResponse.json({ error: 'Invalid token' }, { status: 401 });

    // Delete all user's posts
    const { error: postsError } = await supabaseServer
      .from('k_sheetpress_posts')
      .delete()
      .eq('user_id', user.id);
    if (postsError) throw postsError;

    // Delete all user's comments
    await supabaseServer
      .from('k_sheetpress_comments')
      .delete()
      .eq('user_id', user.id);

    // Delete all user's likes
    await supabaseServer
      .from('k_sheetpress_likes')
      .delete()
      .eq('user_id', user.id);

    // Delete the sheet record
    const { error: sheetError } = await supabaseServer
      .from('k_sheetpress_user_sheets')
      .delete()
      .eq('user_id', user.id);
    if (sheetError) throw sheetError;

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('DELETE /api/sheets/disconnect error:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to disconnect' },
      { status: 500 }
    );
  }
}
