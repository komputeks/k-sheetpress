import { NextRequest, NextResponse } from 'next/server';
import supabaseServer from '@/lib/supabase-server';
import { readSheetRows } from '@/lib/google-sheets';
import { createUserClient } from '@/lib/supabase-user';
import { slugify } from '@/lib/utils';

// POST /api/sheets/sync - Sync from Google Sheet to Supabase
export async function POST(req: NextRequest) {
  try {
    const token = req.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const userClient = createUserClient(token);
    const { data: { user } } = await userClient.auth.getUser(token);
    if (!user) return NextResponse.json({ error: 'Invalid token' }, { status: 401 });

    // Get user's sheet
    const { data: sheet } = await supabaseServer
      .from('k_sheetpress_user_sheets')
      .select('*')
      .eq('user_id', user.id)
      .eq('is_initialized', true)
      .maybeSingle();

    if (!sheet) return NextResponse.json({ error: 'No initialized sheet found' }, { status: 400 });

    // Read rows from Google Sheet
    const sheetRows = await readSheetRows(sheet.spreadsheet_id);

    let synced = 0;
    let errors = 0;

    for (const row of sheetRows) {
      try {
        if (!row.post_title || !row.post_content) continue; // Skip empty rows

        const postId = row.post_id;
        const slug = slugify(row.post_title);
        const tags = row.post_tags ? row.post_tags.split(',').map((t: string) => t.trim()).filter(Boolean) : [];

        if (postId && postId !== 'sample-001') {
          // Update existing post
          const { error } = await supabaseServer
            .from('k_sheetpress_posts')
            .update({
              post_title: row.post_title,
              post_slug: slug,
              cat1: row.cat1 || 'uncategorized',
              cat2: row.cat2 || 'general',
              post_description: row.post_description || '',
              post_excerpt: row.post_excerpt || '',
              post_content: row.post_content,
              post_tags: tags,
              post_status: row.post_status || 'draft',
              featured_image: row.featured_image || null,
              updated_at: new Date().toISOString(),
            })
            .eq('id', postId)
            .eq('user_id', user.id);

          if (error) {
            console.error('Update error:', error);
            errors++;
          } else {
            synced++;
          }
        } else if (row.post_title && row.post_content) {
          // New post from sheet (no post_id or sample)
          const { data: existing } = await supabaseServer
            .from('k_sheetpress_posts')
            .select('id')
            .eq('user_id', user.id)
            .eq('post_slug', slug)
            .maybeSingle();

          if (!existing) {
            const { error } = await supabaseServer
              .from('k_sheetpress_posts')
              .insert({
                user_id: user.id,
                post_title: row.post_title,
                post_slug: slug,
                cat1: row.cat1 || 'uncategorized',
                cat2: row.cat2 || 'general',
                post_description: row.post_description || '',
                post_excerpt: row.post_excerpt || '',
                post_content: row.post_content,
                post_tags: tags,
                post_status: row.post_status || 'draft',
                post_likes: parseInt(row.post_likes) || 0,
                featured_image: row.featured_image || null,
              });

            if (error) {
              console.error('Insert error:', error);
              errors++;
            } else {
              synced++;
            }
          }
        }
      } catch (rowErr) {
        console.error('Row sync error:', rowErr);
        errors++;
      }
    }

    // Update last synced
    await supabaseServer
      .from('k_sheetpress_user_sheets')
      .update({ last_synced_at: new Date().toISOString() })
      .eq('id', sheet.id);

    // Log sync
    await supabaseServer.from('k_sheetpress_sync_log').insert({
      user_id: user.id,
      direction: 'sheet_to_supabase',
      status: errors > 0 ? 'partial' : 'success',
      records_processed: synced,
      error_message: errors > 0 ? `${errors} rows failed` : null,
    });

    return NextResponse.json({ synced, errors, total: sheetRows.length });
  } catch (err) {
    console.error('POST /api/sheets/sync error:', err);
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Sync failed' }, { status: 500 });
  }
}
