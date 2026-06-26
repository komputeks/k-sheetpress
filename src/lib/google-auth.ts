'use client';

import { supabase } from '@/lib/supabase-client';

const isMobile = () => /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

function buildGoogleUrl() {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  const redirectUri = `${window.location.origin}/auth/callback`;
  if (!clientId) return null;
  return `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=openid%20email%20profile&prompt=select_account`;
}

export function signInWithGoogle() {
  const url = buildGoogleUrl();
  if (!url) {
    console.warn('Google Client ID not configured');
    return;
  }
  window.location.href = url;
}

export async function handleGoogleCallback(code: string) {
  // Exchange code for session via our API
  const res = await fetch('/api/auth/callback', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code }),
  });
  const data = await res.json();
  if (data.session) {
    await supabase.auth.setSession({
      access_token: data.session.access_token,
      refresh_token: data.session.refresh_token,
    });
  }
  return data;
}
