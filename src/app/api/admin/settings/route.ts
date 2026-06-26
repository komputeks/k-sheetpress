import { NextRequest, NextResponse } from 'next/server';
import supabaseServer from '@/lib/supabase-server';

// GET /api/admin/settings - Get all site settings
export async function GET(req: NextRequest) {
  try {
    const { data, error } = await supabaseServer
      .from('k_sheetpress_site_settings')
      .select('*')
      .order('key', { ascending: true });

    if (error) throw error;

    // Convert array to object for easier use
    const settings: Record<string, string> = {};
    (data || []).forEach((row: any) => {
      settings[row.key] = row.value;
    });

    return NextResponse.json(settings);
  } catch (err) {
    console.error('GET /api/admin/settings error:', err);
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
  }
}

// PUT /api/admin/settings - Update site settings
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();

    for (const [key, value] of Object.entries(body)) {
      const { error } = await supabaseServer
        .from('k_sheetpress_site_settings')
        .upsert(
          { key, value: String(value), updated_at: new Date().toISOString() },
          { onConflict: 'key' }
        );
      if (error) console.error(`Failed to upsert setting ${key}:`, error);
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('PUT /api/admin/settings error:', err);
    return NextResponse.json({ error: 'Failed to save settings' }, { status: 500 });
  }
}
