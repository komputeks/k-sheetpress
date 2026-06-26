'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/providers/AuthProvider';
import supabase from '@/lib/supabase-client';
import { Loader2, Users, FileText, RefreshCw, AlertTriangle, Activity, Settings, Mail, Sparkles, Save, CheckCircle } from 'lucide-react';

export function AdminPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [checking, setChecking] = useState(true);
  const [stats, setStats] = useState({ totalPosts: 0, totalAuthors: 0 });
  const [syncLogs, setSyncLogs] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'sync' | 'settings' | 'smtp' | 'ai'>('overview');
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // SMTP form state
  const [smtpHost, setSmtpHost] = useState('');
  const [smtpPort, setSmtpPort] = useState('587');
  const [smtpUser, setSmtpUser] = useState('');
  const [smtpPass, setSmtpPass] = useState('');
  const [smtpFrom, setSmtpFrom] = useState('');
  const [smtpProvider, setSmtpProvider] = useState('resend');

  // AI form state
  const [defaultAiKey, setDefaultAiKey] = useState('');
  const [defaultAiProvider, setDefaultAiProvider] = useState('openai');

  useEffect(() => { if (!authLoading && !user) router.push('/login'); }, [user, authLoading, router]);
  useEffect(() => { if (user) checkAdmin(); }, [user]);

  const checkAdmin = async () => {
    try {
      const { data } = await supabase.from('k_sheetpress_profiles' as any).select('username').eq('user_id', user!.id).maybeSingle();
      const adminEmails = (process.env.NEXT_PUBLIC_ADMIN_EMAILS || 'xpatworld2021@gmail.com').split(',');
      const profileData = data as { username: string } | null;
      const isAdminByEmail = adminEmails.includes(user!.email || '');
      const isAdminByUsername = profileData && ['komputeks', 'admin', 'demo'].includes(profileData.username);
      setIsAdmin(!!(isAdminByEmail || isAdminByUsername));
    } catch { setIsAdmin(false); } finally { setChecking(false); }
  };

  useEffect(() => { if (isAdmin) fetchAdminData(); }, [isAdmin]);

  const fetchAdminData = async () => {
    try {
      const [statsRes, logsRes, settingsRes] = await Promise.all([
        fetch('/api/stats'),
        fetch('/api/admin/sync-logs'),
        fetch('/api/admin/settings'),
      ]);
      if (statsRes.ok) setStats(await statsRes.json());
      if (logsRes.ok) setSyncLogs(await logsRes.json());
      if (settingsRes.ok) {
        const s = await settingsRes.json();
        setSettings(s);
        // Populate SMTP fields
        setSmtpHost(s.smtp_host || '');
        setSmtpPort(s.smtp_port || '587');
        setSmtpUser(s.smtp_user || '');
        setSmtpPass(s.smtp_pass ? '••••••••' : '');
        setSmtpFrom(s.smtp_from || '');
        setSmtpProvider(s.smtp_provider || 'resend');
        // Populate AI fields
        setDefaultAiKey(s.default_ai_key ? '••••••••' : '');
        setDefaultAiProvider(s.default_ai_provider || 'openai');
      }
    } catch {}
  };

  const saveSettings = async (updates: Record<string, string>) => {
    setSaving(true);
    setSaved(false);
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } catch {} finally {
      setSaving(false);
    }
  };

  if (authLoading || checking) return <div className="flex min-h-[60vh] items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-brand-400" /></div>;
  if (!isAdmin) return <div className="relative min-h-screen flex items-center justify-center"><div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-brand-900/20 via-surface-950 to-surface-950" /><div className="relative z-10 text-center"><AlertTriangle className="mx-auto h-12 w-12 text-red-400" /><h1 className="mt-4 font-display text-2xl font-bold">Access Denied</h1><p className="mt-2 text-white/60">You don't have admin access.</p></div></div>;

  return (
    <div className="relative min-h-screen">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-brand-900/20 via-surface-950 to-surface-950" />
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-display text-2xl font-bold">Admin Dashboard</h1>
            <p className="mt-1 text-sm text-white/60">Manage your K-SheetPress instance</p>
          </div>
          {saved && <div className="flex items-center gap-2 text-sm text-green-400"><CheckCircle className="h-4 w-4" /> Saved</div>}
        </div>

        <div className="flex gap-1 rounded-xl bg-white/5 p-1 overflow-x-auto">
          {[
            { id: 'overview', label: 'Overview', icon: Activity },
            { id: 'sync', label: 'Sync Logs', icon: RefreshCw },
            { id: 'smtp', label: 'SMTP Email', icon: Mail },
            { id: 'ai', label: 'AI Settings', icon: Sparkles },
            { id: 'settings', label: 'Settings', icon: Settings },
          ].map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-300 whitespace-nowrap ${activeTab === tab.id ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white'}`}>
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

          {activeTab === 'smtp' && (
            <div className="glass-card p-6">
              <h3 className="font-display text-lg font-semibold mb-2">SMTP Email Settings</h3>
              <p className="text-sm text-white/40 mb-6">Configure email sending for notifications, password resets, and more.</p>
              <div className="space-y-4 max-w-xl">
                <div>
                  <label className="mb-2 block text-sm font-medium text-white/80">Provider</label>
                  <select value={smtpProvider} onChange={(e) => setSmtpProvider(e.target.value)} className="input-field">
                    <option value="resend">Resend</option>
                    <option value="brevo">Brevo (Sendinblue)</option>
                    <option value="mailgun">Mailgun</option>
                    <option value="custom">Custom SMTP</option>
                  </select>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-white/80">SMTP Host</label>
                    <input type="text" value={smtpHost} onChange={(e) => setSmtpHost(e.target.value)} placeholder={smtpProvider === 'resend' ? 'smtp.resend.com' : smtpProvider === 'brevo' ? 'smtp-relay.brevo.com' : 'smtp.example.com'} className="input-field" />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-white/80">Port</label>
                    <input type="text" value={smtpPort} onChange={(e) => setSmtpPort(e.target.value)} placeholder="587" className="input-field" />
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-white/80">Username / API Key</label>
                    <input type="text" value={smtpUser} onChange={(e) => setSmtpUser(e.target.value)} placeholder="your-api-key" className="input-field" />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-white/80">Password</label>
                    <input type="password" value={smtpPass} onChange={(e) => setSmtpPass(e.target.value)} placeholder="\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022" className="input-field" />
                  </div>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-white/80">From Email</label>
                  <input type="email" value={smtpFrom} onChange={(e) => setSmtpFrom(e.target.value)} placeholder="noreply@yourdomain.com" className="input-field" />
                </div>
                <button onClick={() => saveSettings({ smtp_host: smtpHost, smtp_port: smtpPort, smtp_user: smtpUser, smtp_pass: smtpPass === '••••••••' ? '' : smtpPass, smtp_from: smtpFrom, smtp_provider: smtpProvider })} disabled={saving} className="btn-primary">
                  {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Save className="h-4 w-4" /> Save SMTP Settings</>}
                </button>
              </div>
            </div>
          )}

          {activeTab === 'ai' && (
            <div className="glass-card p-6">
              <h3 className="font-display text-lg font-semibold mb-2">AI Post Generation</h3>
              <p className="text-sm text-white/40 mb-6">Set a default AI key for all users, or let users bring their own keys. Users can always override this in their settings.</p>
              <div className="space-y-4 max-w-xl">
                <div>
                  <label className="mb-2 block text-sm font-medium text-white/80">Default AI Provider</label>
                  <select value={defaultAiProvider} onChange={(e) => setDefaultAiProvider(e.target.value)} className="input-field">
                    <option value="openai">OpenAI</option>
                  </select>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-white/80">Default API Key (optional)</label>
                  <input type="password" value={defaultAiKey} onChange={(e) => setDefaultAiKey(e.target.value)} placeholder="sk-..." className="input-field" />
                  <p className="mt-1 text-xs text-white/30">If set, all users can generate posts without their own key. Leave empty to require users to provide their own.</p>
                </div>
                <button onClick={() => saveSettings({ default_ai_key: defaultAiKey === '••••••••' ? '' : defaultAiKey, default_ai_provider: defaultAiProvider })} disabled={saving} className="btn-primary">
                  {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Save className="h-4 w-4" /> Save AI Settings</>}
                </button>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="glass-card p-6">
              <h3 className="font-display text-lg font-semibold mb-4">Site Settings</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between py-2 border-b border-white/10">
                  <span className="text-white/60">Site Name</span>
                  <span className="text-white/80">{settings.site_name || 'K-SheetPress'}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-white/10">
                  <span className="text-white/60">Allow Registration</span>
                  <span className="text-white/80">{settings.allow_registration !== 'false' ? 'Yes' : 'No'}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-white/10">
                  <span className="text-white/60">Posts Per Page</span>
                  <span className="text-white/80">{settings.posts_per_page || '12'}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-white/10">
                  <span className="text-white/60">Service Account Email</span>
                  <span className="text-white/80 font-mono text-xs">{settings.service_account_email || 'Not set'}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
