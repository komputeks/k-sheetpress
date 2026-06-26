import Link from 'next/link';
import { ArrowRight, FileSpreadsheet, RefreshCw, Zap, Shield, Globe } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="relative">
      {/* Background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-brand-900/20 via-surface-950 to-surface-950" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-600/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent-500/20 rounded-full blur-3xl" />

      {/* Hero */}
      <section className="relative z-10 px-6 pt-24 pb-32">
        <div className="mx-auto max-w-7xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/5 px-4 py-1.5 text-sm font-medium text-brand-300 backdrop-blur-sm border border-white/10">
            <FileSpreadsheet className="h-4 w-4" />
            Powered by Google Sheets + Supabase
          </div>
          <h1 className="font-display text-5xl font-bold leading-tight sm:text-7xl">
            <span className="gradient-text">Write in Sheets.</span>
            <br />
            <span className="text-white">Publish Everywhere.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-white/60 sm:text-xl">
            K-SheetPress is a modern blog CMS that syncs bi-directionally between Google Sheets and Supabase. Edit your posts in a spreadsheet, and they publish instantly.
          </p>
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link href="/login" className="btn-primary px-8 py-3.5 text-base">
              Get Started Free
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/docs/user-manual" className="btn-secondary px-8 py-3.5 text-base">
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="relative z-10 px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <h2 className="font-display text-3xl font-bold sm:text-4xl">Why K-SheetPress?</h2>
            <p className="mt-4 text-lg text-white/60">The easiest way to manage blog content with the tools you already know.</p>
          </div>
          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: FileSpreadsheet, title: 'Google Sheets Native', desc: 'Edit your posts directly in Google Sheets. No new interface to learn — just open a spreadsheet and start writing.', color: 'brand' },
              { icon: RefreshCw, title: 'Bi-directional Sync', desc: 'Changes in Sheets appear in your blog instantly. Edits on the web sync back to your spreadsheet. Always in sync.', color: 'accent' },
              { icon: Zap, title: 'Supabase Powered', desc: 'Fast reads and writes powered by Supabase PostgreSQL. Your content loads instantly for every visitor.', color: 'green' },
              { icon: Shield, title: 'Secure & Reliable', desc: 'Row-level security, service account authentication, and automatic conflict resolution keep your data safe.', color: 'amber' },
              { icon: Globe, title: 'SEO Optimized', desc: 'Clean permalink structure, OpenGraph metadata, sitemaps, and RSS feeds. Your posts rank higher.', color: 'pink' },
              { icon: FileSpreadsheet, title: 'Markdown Support', desc: 'Write in Markdown right inside Sheets or the built-in editor. Full formatting support with live preview.', color: 'purple' },
            ].map((feature) => {
              const colorMap: Record<string, string> = {
                brand: 'bg-brand-500/20 text-brand-400',
                accent: 'bg-accent-500/20 text-accent-400',
                green: 'bg-green-500/20 text-green-400',
                amber: 'bg-amber-500/20 text-amber-400',
                pink: 'bg-pink-500/20 text-pink-400',
                purple: 'bg-purple-500/20 text-purple-400',
              };
              return (
                <div key={feature.title} className="glass-card p-6 hover:bg-white/10 transition-all duration-300">
                  <div className={`mb-4 inline-flex rounded-xl p-3 ${colorMap[feature.color]}`}>
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-display text-lg font-semibold">{feature.title}</h3>
                  <p className="mt-2 text-sm text-white/60">{feature.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="relative z-10 px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <h2 className="font-display text-3xl font-bold sm:text-4xl">How It Works</h2>
          </div>
          <div className="mt-16 grid gap-8 sm:grid-cols-3">
            {[
              { step: '1', title: 'Create a Sheet', desc: 'Sign in, create an empty Google Spreadsheet, and share it with our service account.' },
              { step: '2', title: 'Initialize', desc: 'Click "Initialize Sheet" — we set up columns, headers, and a sample post automatically.' },
              { step: '3', title: 'Write & Publish', desc: 'Add posts in Sheets or the editor. Content syncs bi-directionally. Your blog is live!' },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-accent-500 text-xl font-bold text-white">
                  {item.step}
                </div>
                <h3 className="font-display text-lg font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm text-white/60">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 px-6 py-20">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="font-display text-3xl font-bold sm:text-4xl">Ready to start blogging with Sheets?</h2>
          <p className="mt-4 text-lg text-white/60">Join writers who manage their content with the tools they already love.</p>
          <Link href="/login" className="btn-primary mt-8 px-8 py-3.5 text-base">
            Get Started Free <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
