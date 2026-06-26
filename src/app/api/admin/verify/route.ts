import { NextRequest, NextResponse } from 'next/server';
import supabaseServer from '@/lib/supabase-server';

// POST /api/admin/verify - Verify admin password
export async function POST(req: NextRequest) {
  try {
    const { password } = await req.json();
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminPassword) {
      return NextResponse.json({ error: 'Admin password not configured' }, { status: 500 });
    }

    if (password === adminPassword) {
      return NextResponse.json({ authorized: true });
    }

    return NextResponse.json({ authorized: false }, { status: 401 });
  } catch (err) {
    console.error('POST /api/admin/verify error:', err);
    return NextResponse.json({ error: 'Verification failed' }, { status: 500 });
  }
}
