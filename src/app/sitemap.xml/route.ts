import { NextResponse } from 'next/server';

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://k-k-sheetpress-q28gpdkea-xpatworld2021s-projects.vercel.app';
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${baseUrl}/explore</loc>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${baseUrl}/docs/user-manual</loc>
    <changefreq>weekly</changefreq>
    <priority>0.5</priority>
  </url>
  <url>
    <loc>${baseUrl}/docs/changelog</loc>
    <changefreq>weekly</changefreq>
    <priority>0.3</priority>
  </url>
</urlset>`;

  return new NextResponse(sitemap, {
    headers: { 'Content-Type': 'application/xml' },
  });
}
