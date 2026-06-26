'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/providers/AuthProvider';
import supabase from '@/lib/supabase-client';
import { Loader2, Users, FileText, RefreshCw, AlertTriangle, Activity, Settings } from 'lucide-react';

export function AdminPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [checking, setChecking] = useState(true);
  const [stats, setStats] = useState({ totalPosts: 0, totalAuthors: 0 });
  const [syncLogs, setSyncLogs] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'posts' | 'sync' | 'settings'>('overview');

  useEffect(() => { if (!authLoading && !user) router.push('/login'); }, [user, authLoading, router]);
  useEffect(() => { if (user) checkAdmin(); }, [user]);

  const checkAdmin = async () => {
    try {
      const { data } = await supabase.from('k_sheetpress_profiles' as any).select('username').eq('user_id', user!.id).maybeSingle();
      const adminUsernames = ['komputeks', 'admin', 'demo'];
      const profileData = data as { username: string } | null;
      setIsAdmin(!!profileData && adminUsernames.includes(profileData.username));
    } catch { setIsAdmin(false); } finally { setChecking(false); }
  };

  useEffect(() => { if (isAdmin) fetchAdminData(); }, [isAdmin]);

  const fetchAdminData = async () => {
    try {
      const [statsRes, logsRes] = await Promise.all([fetch('/api/stats'), fetch('/api/admin/sync-logs')]);
      if (statsRes.ok) setStats(await statsRes.json());
      if (logsRes.ok) setSyncLogs(await logsRes.json());
    } catch {}
  };

  if (authLoading || checking) return <div className="flex min-h-[60vh] items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-brand-400" /></div>;
  if (!isAdmin) return <div className="relative min-h-screen flex items-center justify-center"><div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-brand-900/20 via-surface-950 to-surface-950" /><div className="relative z-10 text-center"><AlertTriangle className="mx-auto h-12 w-12 text-red-400" /><h1 className="mt-4 font-display text-2xl font-bold">Access Denied</h1><p className="mt-2 text-white/60">You don't have admin access.</p></div></div>;

  return (
    <div className="relative min-h-screen">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-brand-900/20 via-surface-950 to-surface-950" />
      <div className="relative z-10 mx-auto max-w-7xl px-6 py-8">
        <h1 className="font-display text-2xl font-bold">Admin Dashboard</h1>
        <p className="mt-1 text-sm text-white/60">Manage your K-SheetPress instance</p>
        <div className="mt-6 flex gap-1 rounded-xl bg-white/5 p-1">
          {[{ id: 'overview', label: 'Overview', icon: Activity }, { id: 'sync', label: 'Sync Logs', icon: RefreshCw }, { id: 'settings', label: 'Settings', icon: Settings }].map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-300 ${activeTab === tab.id ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white'}`}>
              <tab.icon className="h-4 w-4" />{tab.label}
            </button>
          ))}
        </div>
        <div className="mt-6">
          {activeTab === 'overview' && (
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="glass-card flex items-center gap-4 p-5">
                <div className="rounded-xl bg-brand-500/20 p-3 text-brand-400"><FileText className="h-5 w-5" /></div>
                <div><p className="text-2xl font-bold">{stats.totalPosts}</p><p className="text-xs text-white/40">Published Posts</p></div>
              </div>
              <div className="glass-card flex items-center gap-4 p-5">
                <div className="rounded-xl bg-green-500/20 p-3 text-green-400"><Users className="h-5 w-5" /></div>
                <div><p className="text-2xl font-bold">{stats.totalAuthors}</p><p className="text-xs text-white/40">Authors</p></div>
              </div>
            </div>
          )}
          {activeTab === 'sync' && (
            <div className="glass-card p-6">
              <h3 className="font-display text-lg font-semibold mb-4">Sync Logs</h3>
              {syncLogs.length === 0 ? <p className="text-sm text-white/40">No sync logs yet.</p> : (
                <div className="overflow-x-auto"><table className="w-full text-sm">
                  <thead><tr className="border-b border-white/10"><th className="pb-2 text-left font-medium text-white/60">Time</th><th className="pb-2 text-left font-medium text-white/60">Direction</th><th className="pb-2 text-left font-medium text-white/60">Status</th><th className="pb-2 text-left font-medium text-white/60">Records</th><th className="pb-2 text-left font-medium text-white/60">Error</th></tr></thead>
                  <tbody>{syncLogs.map((log: any) => (
                    <tr key={log.id} className="border-b border-white/5">
                      <td className="py-2 text-white/80">{new Date(log.created_at).toLocaleString()}</td>
                      <td className="py-2"><span className="rounded-full bg-white/5 px-2 py-0.5 text-xs text-white/60">{log.direction}</span></td>
                      <td className="py-2"><span className={`rounded-full px-2 py-0.5 text-xs ${log.status === 'success' ? 'bg-green-500/20 text-green-400' : log.status === 'error' ? 'bg-red-500/20 text-red-400' : 'bg-amber-500/20 text-amber-400'}`}>{log.status}</span></td>
                      <td className="py-2 text-white/80">{log.records_processed}</td>
                      <td className="py-2 text-xs text-white/40">{log.error_message || '-'}</td>
                    </tr>
                  ))}</tbody>
                </table></div>
              )}
            </div>
          )}
          {activeTab === 'settings' && (
            <div className="glass-card p-6"><h3 className="font-display text-lg font-semibold mb-4">Site Settings</h3><p className="text-sm text-white/40">Site settings management coming soon. Configure via environment variables.</p></div>
          )}
        </div>
      </div>
    </div>
  );
}
