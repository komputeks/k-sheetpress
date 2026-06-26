'use client';

import Link from 'next/link';
import { useAuth } from '@/providers/AuthProvider';
import { FileSpreadsheet, LogOut, LayoutDashboard, User } from 'lucide-react';

export function Header() {
  const { user, loading, signOut } = useAuth();

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-surface-950/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-accent-500 text-white font-bold font-display">
            K
          </div>
          <span className="font-display text-xl font-bold">K-SheetPress</span>
        </Link>

        <nav className="hidden items-center gap-6 sm:flex">
          <Link href="/" className="text-sm font-medium text-white/60 transition-colors hover:text-white">
            Home
          </Link>
          <Link href="/explore" className="text-sm font-medium text-white/60 transition-colors hover:text-white">
            Explore
          </Link>
          <Link href="/docs/user-manual" className="text-sm font-medium text-white/60 transition-colors hover:text-white">
            Docs
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          {loading ? (
            <div className="skeleton h-9 w-20" />
          ) : user ? (
            <div className="flex items-center gap-2">
              <Link href="/dashboard" className="btn-ghost gap-1.5 text-xs">
                <LayoutDashboard className="h-3.5 w-3.5" />
                Dashboard
              </Link>
              <Link
                href={`/profile/${user.user_metadata?.username || user.id}`}
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-500/20 text-brand-400"
              >
                <User className="h-4 w-4" />
              </Link>
              <button
                onClick={signOut}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-white/40 transition-colors hover:bg-white/5 hover:text-white"
                title="Sign out"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <Link href="/login" className="btn-primary text-xs">
              Sign In
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
