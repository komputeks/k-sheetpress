import { NextResponse } from 'next/server';
import supabaseServer from '@/lib/supabase-server';

// GET /api/admin/sync-logs - Get recent sync logs
export async function GET() {
  try {
    const { data, error } = await supabaseServer
      .from('k_sheetpress_sync_log')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) throw error;
    return NextResponse.json(data || []);
  } catch (err) {
    console.error('GET /api/admin/sync-logs error:', err);
    return NextResponse.json({ error: 'Failed to fetch logs' }, { status: 500 });
  }
}
