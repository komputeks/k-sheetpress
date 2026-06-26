import { NextRequest, NextResponse } from 'next/server';
import supabaseServer from '@/lib/supabase-server';
import { initializeSheet } from '@/lib/google-sheets';
import { createUserClient } from '@/lib/supabase-user';

/**
 * Extracts a Google Spreadsheet ID from a full URL or a bare ID.
 * Accepts:
 *  - https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/edit#gid=0
 *  - https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/edit
 *  - https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/copy
 *  - SPREADSHEET_ID  (bare 44-char ID)
 */
function extractSpreadsheetId(input: string): string | null {
  const trimmed = input.trim();

  // Try URL pattern first
  const urlMatch = trimmed.match(/\/spreadsheets\/d\/([a-zA-Z0-9_-]+)/);
  if (urlMatch) return urlMatch[1];

  // Bare ID — Google Sheets IDs are typically 44 chars, but let's be flexible
  if (/^[a-zA-Z0-9_-]{20,}$/.test(trimmed)) return trimmed;

  return null;
}

// GET /api/sheets - Get user's sheet info
export async function GET(req: NextRequest) {
  try {
    const token = req.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const userClient = createUserClient(token);
    const { data: { user } } = await userClient.auth.getUser(token);
    if (!user) return NextResponse.json({ error: 'Invalid token' }, { status: 401 });

    const { data } = await supabaseServer
      .from('k_sheetpress_user_sheets')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();

    return NextResponse.json(data || null);
  } catch (err) {
    console.error('GET /api/sheets error:', err);
    return NextResponse.json({ error: 'Failed to fetch sheet' }, { status: 500 });
  }
}

// POST /api/sheets/init - Initialize a user's Google Sheet
export async function POST(req: NextRequest) {
  try {
    const token = req.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const userClient = createUserClient(token);
    const { data: { user } } = await userClient.auth.getUser(token);
    if (!user) return NextResponse.json({ error: 'Invalid token' }, { status: 401 });

    const body = await req.json();
    const rawInput = body.spreadsheet_url || body.spreadsheet_id || '';

    // Extract spreadsheet ID from URL or bare ID
    const spreadsheetId = extractSpreadsheetId(rawInput);
    if (!spreadsheetId) {
      return NextResponse.json(
        { error: 'Could not extract spreadsheet ID. Paste the full Google Sheets URL or the spreadsheet ID.' },
        { status: 400 }
      );
    }

    // Get user profile for username
    const { data: profile } = await supabaseServer
      .from('k_sheetpress_profiles')
      .select('username')
      .eq('user_id', user.id)
      .maybeSingle();

    const username = profile?.username || user.email?.split('@')[0] || 'user';

    // Initialize the sheet with headers and sample data
    const result = await initializeSheet(spreadsheetId, username);
    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    // Save sheet info to database
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

    return NextResponse.json({ sheet, success: true });
  } catch (err) {
    console.error('POST /api/sheets/init error:', err);
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Failed to initialize sheet' }, { status: 500 });
  }
}
