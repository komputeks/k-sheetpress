import type { Metadata } from 'next';
import { AuthProvider } from '@/providers/AuthProvider';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'K-SheetPress — Blog CMS with Google Sheets Sync',
    template: '%s | K-SheetPress',
  },
  description: 'A modern blog CMS that syncs bi-directionally between Google Sheets and Supabase. Write in Sheets, publish instantly.',
  keywords: ['blog', 'cms', 'google sheets', 'supabase', 'sync', 'markdown'],
  authors: [{ name: 'K-SheetPress' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'K-SheetPress',
    title: 'K-SheetPress — Blog CMS with Google Sheets Sync',
    description: 'A modern blog CMS that syncs bi-directionally between Google Sheets and Supabase.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'K-SheetPress — Blog CMS with Google Sheets Sync',
    description: 'A modern blog CMS that syncs bi-directionally between Google Sheets and Supabase.',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#4f46e5" />
      </head>
      <body className="min-h-screen antialiased">
        <AuthProvider>
          <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
