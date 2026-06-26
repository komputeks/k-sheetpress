import { NextRequest, NextResponse } from 'next/server';
import supabaseServer from '@/lib/supabase-server';

// GET /api/admin/settings - Get site settings
export async function GET() {
  try {
    const { data, error } = await supabaseServer
      .from('k_sheetpress_site_settings')
      .select('*');

    if (error) throw error;

    // Convert array of {key, value} to object
    const settings: Record<string, string> = {};
    for (const row of data || []) {
      settings[row.key] = row.value;
    }

    return NextResponse.json(settings);
  } catch (err) {
    console.error('GET /api/admin/settings error:', err);
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
  }
}

// PUT /api/admin/settings - Update site settings
export async function PUT(req: NextRequest) {
  try {
    const updates = await req.json();

    for (const [key, value] of Object.entries(updates)) {
      if (!value) continue; // Skip empty values
      const { error } = await supabaseServer
        .from('k_sheetpress_site_settings')
        .upsert({
          key,
          value: String(value),
          updated_at: new Date().toISOString(),
        }, { onConflict: 'key' });

      if (error) console.error('Settings upsert error for', key, error);
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('PUT /api/admin/settings error:', err);
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
  }
}
