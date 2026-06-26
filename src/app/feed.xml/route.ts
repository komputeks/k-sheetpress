import { NextResponse } from 'next/server';

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://k-k-sheetpress-q28gpdkea-xpatworld2021s-projects.vercel.app';
  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>K-SheetPress - Latest Posts</title>
    <description>Blog posts powered by K-SheetPress</description>
    <link>${baseUrl}</link>
    <atom:link href="${baseUrl}/feed.xml" rel="self" type="application/rss+xml"/>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
  </channel>
</rss>`;

  return new NextResponse(rss, {
    headers: { 'Content-Type': 'application/xml' },
  });
}
