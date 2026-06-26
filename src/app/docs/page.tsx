import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Documentation',
  description: 'K-SheetPress documentation and guides',
};

export default function DocsPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <h1 className="font-heading text-3xl font-bold">Documentation</h1>
      <p className="mt-4 text-lg text-surface-muted-foreground">
        Everything you need to know about K-SheetPress.
      </p>
      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        {[
          { title: 'Landing Copy', desc: 'Our story and what makes K-SheetPress special', href: '/docs/landing-copy' },
          { title: 'User Manual', desc: 'Step-by-step guide to using K-SheetPress', href: '/docs/user-manual' },
          { title: 'Changelog', desc: 'What\'s new and what\'s changed', href: '/docs/changelog' },
          { title: 'Roadmap', desc: 'What we\'re building next', href: '/docs/roadmap' },
        ].map((doc) => (
          <a key={doc.href} href={doc.href} className="card group hover:border-accent-300 dark:hover:border-accent-700">
            <h3 className="font-heading text-lg font-semibold group-hover:text-accent-600 dark:group-hover:text-accent-400">{doc.title}</h3>
            <p className="mt-2 text-sm text-surface-muted-foreground">{doc.desc}</p>
          </a>
        ))}
      </div>
    </div>
  );
}
