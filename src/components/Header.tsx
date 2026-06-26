'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/providers/AuthProvider';
import { FileSpreadsheet, LogOut, LayoutDashboard, User, ChevronDown, Settings, Edit3, Menu, X } from 'lucide-react';

export function Header() {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleSignOut = async () => {
    setDropdownOpen(false);
    await signOut();
    router.push('/');
  };

  const username = user?.user_metadata?.username || user?.email?.split('@')[0] || 'user';

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-surface-950/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-accent-500 text-white font-bold font-display text-sm">
            K
          </div>
          <span className="font-display text-lg font-bold hidden sm:inline">K-SheetPress</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/" className="text-sm font-medium text-white/60 transition-colors hover:text-white">Home</Link>
          <Link href="/explore" className="text-sm font-medium text-white/60 transition-colors hover:text-white">Explore</Link>
          <Link href="/docs/user-manual" className="text-sm font-medium text-white/60 transition-colors hover:text-white">Docs</Link>
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-2">
          {loading ? (
            <div className="skeleton h-9 w-9" />
          ) : user ? (
            <>
              {/* Desktop: Dashboard link + Avatar dropdown */}
              <div className="hidden md:flex items-center gap-2">
                <Link href="/dashboard" className="btn-ghost gap-1.5 text-xs">
                  <LayoutDashboard className="h-3.5 w-3.5" />
                  Dashboard
                </Link>
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-500/20 text-brand-400 hover:bg-brand-500/30 transition-colors"
                  >
                    <User className="h-4 w-4" />
                  </button>
                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 rounded-xl border border-white/10 bg-surface-900/95 backdrop-blur-xl py-2 shadow-2xl">
                      <div className="px-4 py-2 border-b border-white/10">
                        <p className="text-sm font-medium text-white truncate">{user.email}</p>
                        <p className="text-xs text-white/40">@{username}</p>
                      </div>
                      <Link href="/dashboard" onClick={() => setDropdownOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-white/70 hover:text-white hover:bg-white/5 transition-colors">
                        <LayoutDashboard className="h-4 w-4" /> Dashboard
                      </Link>
                      <Link href={`/profile/${username}`} onClick={() => setDropdownOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-white/70 hover:text-white hover:bg-white/5 transition-colors">
                        <User className="h-4 w-4" /> View Profile
                      </Link>
                      <Link href="/dashboard/settings" onClick={() => setDropdownOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-white/70 hover:text-white hover:bg-white/5 transition-colors">
                        <Edit3 className="h-4 w-4" /> Edit Profile
                      </Link>
                      <Link href="/dashboard/settings" onClick={() => setDropdownOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-white/70 hover:text-white hover:bg-white/5 transition-colors">
                        <Settings className="h-4 w-4" /> Settings
                      </Link>
                      <div className="border-t border-white/10 mt-1 pt-1">
                        <button onClick={handleSignOut} className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors">
                          <LogOut className="h-4 w-4" /> Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Mobile: Avatar only (tap for dropdown) */}
              <div className="md:hidden relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-500/20 text-brand-400 hover:bg-brand-500/30 transition-colors"
                >
                  <User className="h-4 w-4" />
                </button>
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-xl border border-white/10 bg-surface-900/95 backdrop-blur-xl py-2 shadow-2xl z-50">
                    <div className="px-4 py-2 border-b border-white/10">
                      <p className="text-sm font-medium text-white truncate">{user.email}</p>
                      <p className="text-xs text-white/40">@{username}</p>
                    </div>
                    <Link href="/dashboard" onClick={() => setDropdownOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-white/70 hover:text-white hover:bg-white/5">
                      <LayoutDashboard className="h-4 w-4" /> Dashboard
                    </Link>
                    <Link href={`/profile/${username}`} onClick={() => setDropdownOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-white/70 hover:text-white hover:bg-white/5">
                      <User className="h-4 w-4" /> View Profile
                    </Link>
                    <Link href="/dashboard/settings" onClick={() => setDropdownOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-white/70 hover:text-white hover:bg-white/5">
                      <Edit3 className="h-4 w-4" /> Edit Profile
                    </Link>
                    <div className="border-t border-white/10 mt-1 pt-1">
                      <button onClick={handleSignOut} className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10">
                        <LogOut className="h-4 w-4" /> Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              {/* Desktop: Sign In button */}
              <Link href="/login" className="hidden md:inline-flex btn-primary text-xs">
                Sign In
              </Link>
              {/* Mobile: Avatar that goes to login */}
              <Link href="/login" className="md:hidden flex h-9 w-9 items-center justify-center rounded-xl bg-white/5 text-white/40 hover:text-white hover:bg-white/10 transition-colors">
                <User className="h-4 w-4" />
              </Link>
            </>
          )}

          {/* Mobile hamburger for nav links */}
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden flex h-9 w-9 items-center justify-center rounded-xl text-white/40 hover:text-white hover:bg-white/5 transition-colors">
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile nav dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-white/10 bg-surface-950/95 backdrop-blur-xl">
          <nav className="flex flex-col px-4 py-3 gap-1">
            <Link href="/" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2.5 text-sm font-medium text-white/60 hover:text-white hover:bg-white/5 rounded-lg transition-colors">Home</Link>
            <Link href="/explore" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2.5 text-sm font-medium text-white/60 hover:text-white hover:bg-white/5 rounded-lg transition-colors">Explore</Link>
            <Link href="/docs/user-manual" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2.5 text-sm font-medium text-white/60 hover:text-white hover:bg-white/5 rounded-lg transition-colors">Docs</Link>
          </nav>
        </div>
      )}
    </header>
  );
}
