import { NextResponse } from 'next/server';

/**
 * GET /api/config/service-account
 * Returns the service account email for the client-side dashboard.
 * This is safe to expose — it's just an email address users need to share their sheet with.
 */
export async function GET() {
  const serviceAccountEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || '';
  return NextResponse.json({ email: serviceAccountEmail });
}
