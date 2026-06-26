import Link from 'next/link';
import { FileSpreadsheet } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-surface-950">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link href="/" className="flex items-center gap-3 font-display text-lg font-bold">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand-500 to-accent-500 text-white text-sm font-bold">K</div>
              K-SheetPress
            </Link>
            <p className="mt-3 text-sm text-white/40">
              Blog CMS with bi-directional Google Sheets & Supabase sync.
            </p>
          </div>
          <div>
            <h4 className="font-display text-sm font-semibold uppercase tracking-wider text-white/80">Product</h4>
            <ul className="mt-3 space-y-2">
              <li><Link href="/explore" className="text-sm text-white/40 hover:text-white transition-colors">Explore</Link></li>
              <li><Link href="/docs/user-manual" className="text-sm text-white/40 hover:text-white transition-colors">User Manual</Link></li>
              <li><Link href="/docs/changelog" className="text-sm text-white/40 hover:text-white transition-colors">Changelog</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-display text-sm font-semibold uppercase tracking-wider text-white/80">Resources</h4>
            <ul className="mt-3 space-y-2">
              <li><Link href="/docs/landing-copy" className="text-sm text-white/40 hover:text-white transition-colors">Landing Copy</Link></li>
              <li><Link href="/docs/roadmap" className="text-sm text-white/40 hover:text-white transition-colors">Roadmap</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-display text-sm font-semibold uppercase tracking-wider text-white/80">Legal</h4>
            <ul className="mt-3 space-y-2">
              <li><Link href="/privacy" className="text-sm text-white/40 hover:text-white transition-colors">Privacy</Link></li>
              <li><Link href="/terms" className="text-sm text-white/40 hover:text-white transition-colors">Terms</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-white/10 pt-8 text-center text-sm text-white/30">
          © {new Date().getFullYear()} K-SheetPress. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
