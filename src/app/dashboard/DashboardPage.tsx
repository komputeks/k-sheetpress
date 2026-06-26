'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/providers/AuthProvider';
import { supabase } from '@/lib/supabase-client';
import { PostCardSkeleton } from '@/components/Skeleton';
import { PostCard } from '@/components/PostCard';
import type { KSheetpressPost, KSheetpressUserSheet, KSheetpressProfile } from '@/types';
import {
  FileSpreadsheet,
  Plus,
  RefreshCw,
  ExternalLink,
  Copy,
  Check,
  FileText,
  Loader2,
  AlertTriangle,
} from 'lucide-react';
import { SITE_CONFIG } from '@/config/site';

/** Helper: get the current user's access token from the Supabase session */
async function getAuthToken(): Promise<string> {
  try {
    const { data } = await supabase.auth.getSession();
    return data.session?.access_token || '';
  } catch {
    return '';
  }
}

/** Helper: build auth headers for API calls */
async function authHeaders(): Promise<Record<string, string>> {
  const token = await getAuthToken();
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
}

export function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [posts, setPosts] = useState<KSheetpressPost[]>([]);
  const [sheet, setSheet] = useState<KSheetpressUserSheet | null>(null);
  const [profile, setProfile] = useState<KSheetpressProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [syncing, setSyncing] = useState(false);
  const [initializing, setInitializing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [sheetIdInput, setSheetIdInput] = useState('');

  // Redirect unauthenticated users to login
  useEffect(() => {
    if (!authLoading && !user) {
      router.replace('/login');
    }
  }, [user, authLoading, router]);

  // Fetch dashboard data when user is available
  const fetchData = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const headers = await authHeaders();

      const [postsRes, sheetRes, profileRes] = await Promise.all([
        fetch('/api/posts?mine=true', { headers }).catch(() => null),
        fetch('/api/sheets', { headers }).catch(() => null),
        fetch('/api/profile', { headers }).catch(() => null),
      ]);

      // Parse posts
      if (postsRes?.ok) {
        try {
          const data = await postsRes.json();
          setPosts(Array.isArray(data?.posts) ? data.posts : Array.isArray(data) ? data : []);
        } catch { setPosts([]); }
      } else { setPosts([]); }

      // Parse sheet
      if (sheetRes?.ok) {
        try {
          const data = await sheetRes.json();
          setSheet(data && typeof data === 'object' && data.spreadsheet_id ? data : null);
        } catch { setSheet(null); }
      } else { setSheet(null); }

      // Parse profile — auto-create if missing
      if (profileRes?.ok) {
        try {
          const data = await profileRes.json();
          if (data && typeof data === 'object' && data.username) {
            setProfile(data);
          } else {
            // No profile yet — create one automatically
            const username = user.email?.split('@')[0]?.toLowerCase().replace(/[^a-z0-9_-]/g, '') || 'user';
            const createRes = await fetch('/api/profile', {
              method: 'POST',
              headers,
              body: JSON.stringify({ username }),
            });
            if (createRes.ok) {
              const newProfile = await createRes.json();
              setProfile(newProfile);
            } else {
              setProfile(null);
            }
          }
        } catch { setProfile(null); }
      } else { setProfile(null); }

    } catch (err) {
      console.error('Dashboard fetch error:', err);
      setError('Failed to load dashboard data. Please refresh the page.');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) fetchData();
  }, [user, fetchData]);

  const handleInitializeSheet = async () => {
    setInitializing(true);
    setError(null);
    try {
      const headers = await authHeaders();
      const res = await fetch('/api/sheets/init', {
        method: 'POST',
        headers,
        body: JSON.stringify({ spreadsheet_id: sheetIdInput }),
      });
      const data = await res.json();
      if (res.ok) {
        setSheet(data.sheet);
        setSheetIdInput('');
        alert('Sheet initialized successfully!');
      } else {
        setError(data.error || 'Failed to initialize sheet');
      }
    } catch {
      setError('Failed to initialize sheet. Check your network connection.');
    } finally {
      setInitializing(false);
    }
  };

  const handleSync = async () => {
    setSyncing(true);
    setError(null);
    try {
      const headers = await authHeaders();
      const res = await fetch('/api/sheets/sync', { method: 'POST', headers });
      const data = await res.json();
      if (res.ok) {
        alert(`Sync complete! ${data.synced || 0} records processed.`);
        fetchData();
      } else {
        setError(data.error || 'Sync failed');
      }
    } catch {
      setError('Sync failed. Check your network connection.');
    } finally {
      setSyncing(false);
    }
  };

  const copyServiceAccount = () => {
    navigator.clipboard.writeText(SITE_CONFIG.serviceAccountEmail);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Loading state
  if (authLoading || (!user && !authLoading)) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-brand-600" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold sm:text-3xl">Dashboard</h1>
          <p className="mt-1 text-sm text-[var(--muted-foreground)]">
            Welcome back, {profile?.display_name || profile?.username || user.email}
          </p>
        </div>
        <div className="flex gap-3">
          {sheet?.is_initialized && (
            <Link href="/dashboard/posts/new" className="btn-primary">
              <Plus className="h-4 w-4" /> New Post
            </Link>
          )}
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="mb-6 flex items-center gap-3 rounded-xl border border-accent-200 bg-accent-50 p-4 dark:border-accent-800 dark:bg-accent-950">
          <AlertTriangle className="h-5 w-5 shrink-0 text-accent-600 dark:text-accent-400" />
          <p className="text-sm text-accent-700 dark:text-accent-300">{error}</p>
          <button onClick={() => setError(null)} className="ml-auto text-xs text-accent-500 hover:text-accent-700">Dismiss</button>
        </div>
      )}

      {/* Sheet Setup Section - shown when no sheet is connected */}
      {!sheet?.is_initialized && !loading && (
        <div className="mb-8 rounded-xl border border-brand-200 bg-brand-50 p-6 dark:border-brand-800 dark:bg-brand-950">
          <div className="flex items-start gap-4">
            <div className="rounded-lg bg-brand-100 p-3 text-brand-600 dark:bg-brand-900 dark:text-brand-400">
              <FileSpreadsheet className="h-6 w-6" />
            </div>
            <div className="flex-1">
              <h2 className="font-heading text-lg font-semibold">Set up your Google Sheet</h2>
              <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                Follow these steps to connect your Google Sheet for bi-directional sync.
              </p>

              <div className="mt-4 space-y-4">
                <div className="flex items-start gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-600 text-xs font-bold text-white">1</span>
                  <div>
                    <p className="text-sm font-medium">Create an empty Google Spreadsheet</p>
                    <a
                      href="https://sheets.new"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-brand-600 hover:underline"
                    >
                      Create new sheet <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-600 text-xs font-bold text-white">2</span>
                  <div>
                    <p className="text-sm font-medium">Share the spreadsheet with our service account (as Editor)</p>
                    <div className="mt-1 flex items-center gap-2">
                      <code className="rounded-md bg-white px-2 py-1 text-xs dark:bg-black">{SITE_CONFIG.serviceAccountEmail}</code>
                      <button onClick={copyServiceAccount} className="text-xs text-brand-600 hover:text-brand-700">
                        {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-600 text-xs font-bold text-white">3</span>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Paste your Spreadsheet ID or URL and initialize</p>
                    <p className="mt-0.5 text-xs text-[var(--muted-foreground)]">
                      The ID is the long string in your sheet URL: docs.google.com/spreadsheets/d/<strong>THIS_IS_THE_ID</strong>/edit
                    </p>
                    <div className="mt-2 flex gap-2">
                      <input
                        type="text"
                        value={sheetIdInput}
                        onChange={(e) => setSheetIdInput(e.target.value)}
                        placeholder="Paste spreadsheet ID or full URL here..."
                        className="input-field max-w-md text-xs"
                      />
                      <button
                        onClick={handleInitializeSheet}
                        disabled={initializing || !sheetIdInput}
                        className="btn-primary text-xs"
                      >
                        {initializing ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : 'Initialize Sheet'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sheet Connected Banner */}
      {sheet?.is_initialized && (
        <div className="mb-8 flex items-center justify-between rounded-xl border border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-950">
          <div className="flex items-center gap-3">
            <FileSpreadsheet className="h-5 w-5 text-green-600" />
            <div>
              <p className="text-sm font-medium text-green-800 dark:text-green-200">Sheet connected & initialized</p>
              <a
                href={sheet.spreadsheet_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-green-600 hover:underline"
              >
                Open in Google Sheets <ExternalLink className="inline h-3 w-3" />
              </a>
            </div>
          </div>
          <button onClick={handleSync} disabled={syncing} className="btn-secondary text-xs">
            {syncing ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <RefreshCw className="h-3.5 w-3.5" />}
            Sync Now
          </button>
        </div>
      )}

      {/* Quick Stats */}
      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <div className="card flex items-center gap-4">
          <div className="rounded-lg bg-brand-50 p-3 text-brand-600 dark:bg-brand-950 dark:text-brand-400">
            <FileText className="h-5 w-5" />
          </div>
          <div>
            <p className="text-2xl font-bold">{posts.length}</p>
            <p className="text-xs text-[var(--muted-foreground)]">Total Posts</p>
          </div>
        </div>
        <div className="card flex items-center gap-4">
          <div className="rounded-lg bg-green-50 p-3 text-green-600 dark:bg-green-950 dark:text-green-400">
            <FileText className="h-5 w-5" />
          </div>
          <div>
            <p className="text-2xl font-bold">{posts.filter(p => p.post_status === 'published').length}</p>
            <p className="text-xs text-[var(--muted-foreground)]">Published</p>
          </div>
        </div>
        <div className="card flex items-center gap-4">
          <div className="rounded-lg bg-amber-50 p-3 text-amber-600 dark:bg-amber-950 dark:text-amber-400">
            <FileText className="h-5 w-5" />
          </div>
          <div>
            <p className="text-2xl font-bold">{posts.filter(p => p.post_status === 'draft').length}</p>
            <p className="text-xs text-[var(--muted-foreground)]">Drafts</p>
          </div>
        </div>
      </div>

      {/* Posts List */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-heading text-xl font-semibold">Your Posts</h2>
        {sheet?.is_initialized && (
          <Link href="/dashboard/posts/new" className="btn-secondary text-xs">
            <Plus className="h-3.5 w-3.5" /> New Post
          </Link>
        )}
      </div>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => <PostCardSkeleton key={i} />)}
        </div>
      ) : posts.length === 0 ? (
        <div className="rounded-xl border border-dashed border-[var(--border)] p-12 text-center">
          <FileText className="mx-auto h-12 w-12 text-[var(--muted-foreground)]" />
          <h3 className="mt-4 font-heading text-lg font-semibold">No posts yet</h3>
          <p className="mt-1 text-sm text-[var(--muted-foreground)]">
            {sheet?.is_initialized
              ? 'Create your first post or add rows in Google Sheets'
              : 'Set up your Google Sheet first to start writing'}
          </p>
          {sheet?.is_initialized && (
            <Link href="/dashboard/posts/new" className="btn-primary mt-4">
              <Plus className="h-4 w-4" /> Create Post
            </Link>
          )}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <PostCard key={post.id} post={post as any} />
          ))}
        </div>
      )}
    </div>
  );
}
