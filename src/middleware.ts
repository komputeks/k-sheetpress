import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Middleware to prevent dynamic route [cat1]/[cat2]/[slug] from intercepting
 * API routes and other reserved paths. Next.js should handle this automatically,
 * but the catch-all route can sometimes take precedence.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Reserved path prefixes that should NOT be caught by [cat1]/[cat2]/[slug]
  const reservedPrefixes = [
    '/api/',
    '/_next/',
    '/dashboard/',
    '/admin/',
    '/login',
    '/signup',
    '/explore',
    '/docs/',
    '/profile/',
    '/auth/',
    '/privacy',
    '/terms',
    '/sitemap',
    '/feed',
    '/favicon',
    '/manifest',
  ];

  // If the path starts with a reserved prefix, let it through normally
  for (const prefix of reservedPrefixes) {
    if (pathname.startsWith(prefix)) {
      return NextResponse.next();
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|favicon.svg|manifest.json|uploads|sw.js|workbox-*.js).*)'],
};
