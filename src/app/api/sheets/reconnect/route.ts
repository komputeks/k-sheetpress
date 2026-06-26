import { NextRequest, NextResponse } from 'next/server';
import supabaseServer from '@/lib/supabase-server';
import { initializeSheet, appendSheetRow, SHEET_COLUMNS } from '@/lib/google-sheets';
import { createUserClient } from '@/lib/supabase-user';

/**
 * POST /api/sheets/reconnect
 * Connects a new spreadsheet and copies all existing Supabase posts into it.
 * Body: { spreadsheet_url_or_id: string }
 */
export async function POST(req: NextRequest) {
  try {
    const token = req.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const userClient = createUserClient(token);
    const { data: { user } } = await userClient.auth.getUser(token);
    if (!user) return NextResponse.json({ error: 'Invalid token' }, { status: 401 });

    const body = await req.json();
    const rawInput = body.spreadsheet_url_or_id || body.spreadsheet_id || '';

    // Extract spreadsheet ID
    const urlMatch = rawInput.trim().match(/\/spreadsheets\/d\/([a-zA-Z0-9_-]+)/);
    const spreadsheetId = urlMatch ? urlMatch[1] : (/^[a-zA-Z0-9_-]{20,}$/.test(rawInput.trim()) ? rawInput.trim() : null);

    if (!spreadsheetId) {
      return NextResponse.json(
        { error: 'Could not extract spreadsheet ID. Paste the full Google Sheets URL or the spreadsheet ID.' },
        { status: 400 }
      );
    }

    // Get user profile
    const { data: profile } = await supabaseServer
      .from('k_sheetpress_profiles')
      .select('username')
      .eq('user_id', user.id)
      .maybeSingle();

    const username = profile?.username || user.email?.split('@')[0] || 'user';

    // Step 1: Initialize the new sheet (headers + sample row)
    const initResult = await initializeSheet(spreadsheetId, username);
    if (!initResult.success) {
      return NextResponse.json({ error: initResult.error }, { status: 400 });
    }

    // Step 2: Fetch all existing posts from Supabase for this user
    const { data: posts, error: postsError } = await supabaseServer
      .from('k_sheetpress_posts')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: true });

    if (postsError) throw postsError;

    // Step 3: Copy each post into the new sheet
    let copied = 0;
    let copyErrors = 0;

    for (const post of posts || []) {
      try {
        const rowData: Record<string, string> = {
          post_id: post.id,
          post_title: post.post_title,
          post_slug: post.post_slug,
          cat1: post.cat1 || 'uncategorized',
          cat2: post.cat2 || 'general',
          post_description: post.post_description || '',
          post_excerpt: post.post_excerpt || '',
          post_content: post.post_content || '',
          post_tags: Array.isArray(post.post_tags) ? post.post_tags.join(',') : '',
          post_status: post.post_status || 'draft',
          post_likes: String(post.post_likes || 0),
          post_comments_count: '0',
          featured_image: post.featured_image || '',
          created_at: post.created_at,
          updated_at: post.updated_at,
        };
        await appendSheetRow(spreadsheetId, rowData);
        copied++;
      } catch (rowErr) {
        console.error('Row copy error:', rowErr);
        copyErrors++;
      }
    }

    // Step 4: Update the sheet record in the database
    const spreadsheetUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`;

    const { data: existingSheet } = await supabaseServer
      .from('k_sheetpress_user_sheets')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();

    let sheet;
    if (existingSheet) {
      const { data, error } = await supabaseServer
        .from('k_sheetpress_user_sheets')
        .update({
          spreadsheet_id: spreadsheetId,
          spreadsheet_url: spreadsheetUrl,
          is_initialized: true,
          last_synced_at: new Date().toISOString(),
        })
        .eq('id', existingSheet.id)
        .select()
        .single();
      if (error) throw error;
      sheet = data;
    } else {
      const { data, error } = await supabaseServer
        .from('k_sheetpress_user_sheets')
        .insert({
          user_id: user.id,
          spreadsheet_id: spreadsheetId,
          spreadsheet_url: spreadsheetUrl,
          is_initialized: true,
          last_synced_at: new Date().toISOString(),
        })
        .select()
        .single();
      if (error) throw error;
      sheet = data;
    }

    // Log the reconnect
    await supabaseServer.from('k_sheetpress_sync_log').insert({
      user_id: user.id,
      direction: 'supabase_to_sheet',
      status: copyErrors > 0 ? 'partial' : 'success',
      records_processed: copied,
      error_message: copyErrors > 0 ? `${copyErrors} rows failed to copy` : null,
    });

    return NextResponse.json({
      sheet,
      success: true,
      copied,
      copyErrors,
      totalPosts: (posts || []).length,
    });
  } catch (err) {
    console.error('POST /api/sheets/reconnect error:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to reconnect sheet' },
      { status: 500 }
    );
  }
}
