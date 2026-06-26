'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/providers/AuthProvider';
import supabase from '@/lib/supabase-client';
import { Loader2, Users, FileText, RefreshCw, AlertTriangle, Activity, Settings, Mail, Sparkles, Save, CheckCircle, Lock, ShieldCheck } from 'lucide-react';

export function AdminPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [checking, setChecking] = useState(true);
  const [adminPassword, setAdminPassword] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [verifyError, setVerifyError] = useState('');
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

  useEffect(() => {
    if (!authLoading && !user) router.push('/login');
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) checkAdmin();
  }, [user]);

  // Check if user is admin by email or username
  const checkAdmin = async () => {
    try {
      const { data } = await supabase
        .from('k_sheetpress_profiles' as any)
        .select('username')
        .eq('user_id', user!.id)
        .maybeSingle();

      const adminEmails = (process.env.NEXT_PUBLIC_ADMIN_EMAILS || '').split(',').filter(Boolean);
      const profileData = data as { username: string } | null;
      const isAdminByEmail = adminEmails.includes(user!.email || '');
      const isAdminByUsername = profileData && ['komputeks', 'admin', 'demo'].includes(profileData.username);

      if (isAdminByEmail || isAdminByUsername) {
        setIsAdmin(true);
      }
    } catch {
      setIsAdmin(false);
    } finally {
      setChecking(false);
    }
  };

  // Verify admin password
  const handlePasswordVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setVerifying(true);
    setVerifyError('');
    try {
      const res = await fetch('/api/admin/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: adminPassword }),
      });
      const data = await res.json();
      if (data.authorized) {
        setIsAdmin(true);
      } else {
        setVerifyError('Invalid admin password');
      }
    } catch {
      setVerifyError('Verification failed');
    } finally {
      setVerifying(false);
    }
  };

  useEffect(() => {
    if (isAdmin) fetchAdminData();
  }, [isAdmin]);

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
        setSmtpHost(s.smtp_host || '');
        setSmtpPort(s.smtp_port || '587');
        setSmtpUser(s.smtp_user || '');
        setSmtpPass(s.smtp_pass ? '••••••••' : '');
        setSmtpFrom(s.smtp_from || '');
        setSmtpProvider(s.smtp_provider || 'resend');
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

  if (authLoading || checking) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-brand-600" />
      </div>
    );
  }

  // Show admin password gate if not yet authorized
  if (!isAdmin) {
    return (
      <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <div className="text-center mb-6">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-600 text-white">
              <ShieldCheck className="h-7 w-7" />
            </div>
            <h1 className="font-heading text-2xl font-bold">Admin Access</h1>
            <p className="mt-2 text-sm text-[var(--muted-foreground)]">
              Enter the admin password to continue
            </p>
          </div>
          <form onSubmit={handlePasswordVerify} className="card">
            {verifyError && (
              <div className="mb-4 rounded-lg bg-accent-50 p-3 text-sm text-accent-700 dark:bg-accent-950 dark:text-accent-300">
                {verifyError}
              </div>
            )}
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted-foreground)]" />
              <input
                type="password"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                placeholder="Admin password"
                required
                className="input-field pl-10"
                autoFocus
              />
            </div>
            <button type="submit" disabled={verifying} className="btn-primary mt-4 w-full">
              {verifying ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Verify & Enter'}
            </button>
          </form>
          <p className="mt-4 text-center text-xs text-[var(--muted-foreground)]">
            Contact the site owner if you need admin access.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold">Admin Dashboard</h1>
          <p className="mt-1 text-sm text-[var(--muted-foreground)]">Manage your K-SheetPress instance</p>
        </div>
        {saved && (
          <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
            <CheckCircle className="h-4 w-4" /> Saved
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="mb-6 flex gap-1 rounded-lg bg-[var(--muted)] p-1 overflow-x-auto">
        {[
          { id: 'overview', label: 'Overview', icon: Activity },
          { id: 'sync', label: 'Sync Logs', icon: RefreshCw },
          { id: 'smtp', label: 'SMTP Email', icon: Mail },
          { id: 'ai', label: 'AI Settings', icon: Sparkles },
          { id: 'settings', label: 'Settings', icon: Settings },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-[var(--card)] text-[var(--foreground)] shadow-sm'
                : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
            }`}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div>
        {activeTab === 'overview' && (
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="card flex items-center gap-4">
              <div className="rounded-lg bg-brand-50 p-3 text-brand-600 dark:bg-brand-950 dark:text-brand-400">
                <FileText className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.totalPosts}</p>
                <p className="text-xs text-[var(--muted-foreground)]">Published Posts</p>
              </div>
            </div>
            <div className="card flex items-center gap-4">
              <div className="rounded-lg bg-green-50 p-3 text-green-600 dark:bg-green-950 dark:text-green-400">
                <Users className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.totalAuthors}</p>
                <p className="text-xs text-[var(--muted-foreground)]">Authors</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'sync' && (
          <div className="card">
            <h3 className="font-heading text-lg font-semibold mb-4">Sync Logs</h3>
            {syncLogs.length === 0 ? (
              <p className="text-sm text-[var(--muted-foreground)]">No sync logs yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[var(--border)]">
                      <th className="pb-2 text-left font-medium">Time</th>
                      <th className="pb-2 text-left font-medium">Direction</th>
                      <th className="pb-2 text-left font-medium">Status</th>
                      <th className="pb-2 text-left font-medium">Records</th>
                      <th className="pb-2 text-left font-medium">Error</th>
                    </tr>
                  </thead>
                  <tbody>
                    {syncLogs.map((log: any) => (
                      <tr key={log.id} className="border-b border-[var(--border)]">
                        <td className="py-2">{new Date(log.created_at).toLocaleString()}</td>
                        <td className="py-2">
                          <span className="rounded-full bg-[var(--muted)] px-2 py-0.5 text-xs">{log.direction}</span>
                        </td>
                        <td className="py-2">
                          <span className={`rounded-full px-2 py-0.5 text-xs ${
                            log.status === 'success' ? 'bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300'
                            : log.status === 'error' ? 'bg-accent-50 text-accent-700 dark:bg-accent-950 dark:text-accent-300'
                            : 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                          }`}>{log.status}</span>
                        </td>
                        <td className="py-2">{log.records_processed}</td>
                        <td className="py-2 text-xs text-[var(--muted-foreground)]">{log.error_message || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === 'smtp' && (
          <div className="card">
            <h3 className="font-heading text-lg font-semibold mb-2">SMTP Email Settings</h3>
            <p className="text-sm text-[var(--muted-foreground)] mb-6">Configure email sending for notifications and password resets.</p>
            <div className="space-y-4 max-w-xl">
              <div>
                <label className="mb-1.5 block text-sm font-medium">Provider</label>
                <select value={smtpProvider} onChange={(e) => setSmtpProvider(e.target.value)} className="input-field">
                  <option value="resend">Resend</option>
                  <option value="brevo">Brevo (Sendinblue)</option>
                  <option value="mailgun">Mailgun</option>
                  <option value="custom">Custom SMTP</option>
                </select>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-medium">SMTP Host</label>
                  <input type="text" value={smtpHost} onChange={(e) => setSmtpHost(e.target.value)} placeholder="smtp.resend.com" className="input-field" />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium">Port</label>
                  <input type="text" value={smtpPort} onChange={(e) => setSmtpPort(e.target.value)} placeholder="587" className="input-field" />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-medium">Username / API Key</label>
                  <input type="text" value={smtpUser} onChange={(e) => setSmtpUser(e.target.value)} placeholder="your-api-key" className="input-field" />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium">Password</label>
                  <input type="password" value={smtpPass} onChange={(e) => setSmtpPass(e.target.value)} placeholder="••••••••" className="input-field" />
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium">From Email</label>
                <input type="email" value={smtpFrom} onChange={(e) => setSmtpFrom(e.target.value)} placeholder="noreply@yourdomain.com" className="input-field" />
              </div>
              <button
                onClick={() => saveSettings({
                  smtp_host: smtpHost,
                  smtp_port: smtpPort,
                  smtp_user: smtpUser,
                  smtp_pass: smtpPass === '••••••••' ? '' : smtpPass,
                  smtp_from: smtpFrom,
                  smtp_provider: smtpProvider,
                })}
                disabled={saving}
                className="btn-primary"
              >
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Save className="h-4 w-4" /> Save SMTP Settings</>}
              </button>
            </div>
          </div>
        )}

        {activeTab === 'ai' && (
          <div className="card">
            <h3 className="font-heading text-lg font-semibold mb-2">AI Post Generation</h3>
            <p className="text-sm text-[var(--muted-foreground)] mb-6">Set a default AI key for all users, or let users bring their own keys.</p>
            <div className="space-y-4 max-w-xl">
              <div>
                <label className="mb-1.5 block text-sm font-medium">Default AI Provider</label>
                <select value={defaultAiProvider} onChange={(e) => setDefaultAiProvider(e.target.value)} className="input-field">
                  <option value="openai">OpenAI</option>
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium">Default API Key (optional)</label>
                <input type="password" value={defaultAiKey} onChange={(e) => setDefaultAiKey(e.target.value)} placeholder="sk-..." className="input-field" />
                <p className="mt-1 text-xs text-[var(--muted-foreground)]">If set, all users can generate posts without their own key.</p>
              </div>
              <button
                onClick={() => saveSettings({
                  default_ai_key: defaultAiKey === '••••••••' ? '' : defaultAiKey,
                  default_ai_provider: defaultAiProvider,
                })}
                disabled={saving}
                className="btn-primary"
              >
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Save className="h-4 w-4" /> Save AI Settings</>}
              </button>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="card">
            <h3 className="font-heading text-lg font-semibold mb-4">Site Settings</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between py-2 border-b border-[var(--border)]">
                <span className="text-[var(--muted-foreground)]">Site Name</span>
                <span>{settings.site_name || 'K-SheetPress'}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-[var(--border)]">
                <span className="text-[var(--muted-foreground)]">Allow Registration</span>
                <span>{settings.allow_registration !== 'false' ? 'Yes' : 'No'}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-[var(--border)]">
                <span className="text-[var(--muted-foreground)]">Posts Per Page</span>
                <span>{settings.posts_per_page || '12'}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-[var(--border)]">
                <span className="text-[var(--muted-foreground)]">Service Account Email</span>
                <span className="font-mono text-xs">{settings.service_account_email || 'Not set'}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
