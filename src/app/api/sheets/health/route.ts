import { NextRequest, NextResponse } from 'next/server';
import supabaseServer from '@/lib/supabase-server';
import { getGoogleSheetsClient } from '@/lib/google-sheets';
import { createUserClient } from '@/lib/supabase-user';

/**
 * GET /api/sheets/health
 * Checks whether the service account can still access the user's spreadsheet.
 * Returns { accessible: true } or { accessible: false, reason: "..." }
 */
export async function GET(req: NextRequest) {
  try {
    const token = req.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) return NextResponse.json({ accessible: false, reason: 'Unauthorized' }, { status: 401 });

    const userClient = createUserClient(token);
    const { data: { user } } = await userClient.auth.getUser(token);
    if (!user) return NextResponse.json({ accessible: false, reason: 'Invalid token' }, { status: 401 });

    // Get user's sheet record
    const { data: sheet } = await supabaseServer
      .from('k_sheetpress_user_sheets')
      .select('spreadsheet_id')
      .eq('user_id', user.id)
      .eq('is_initialized', true)
      .maybeSingle();

    if (!sheet) {
      return NextResponse.json({ accessible: false, reason: 'no_sheet' });
    }

    // Try to read just the header row from the sheet
    try {
      const sheets = getGoogleSheetsClient();
      await sheets.spreadsheets.values.get({
        spreadsheetId: sheet.spreadsheet_id,
        range: 'A1:O1',
      });
      return NextResponse.json({ accessible: true });
    } catch (sheetErr: any) {
      const msg = sheetErr?.message || String(sheetErr);
      let reason = 'unknown';

      if (msg.includes('404') || msg.includes('not found')) {
        reason = 'not_found';
      } else if (msg.includes('403') || msg.includes('forbidden') || msg.includes('permission')) {
        reason = 'permission_denied';
      }

      return NextResponse.json({ accessible: false, reason });
    }
  } catch (err) {
    console.error('GET /api/sheets/health error:', err);
    return NextResponse.json({ accessible: false, reason: 'server_error' }, { status: 500 });
  }
}
