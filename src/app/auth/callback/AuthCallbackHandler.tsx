'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export function AuthCallbackHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const handleCallback = async () => {
      // Check for hash fragment from Supabase OAuth
      const hashFragment = window.location.hash;
      if (hashFragment && hashFragment.includes('access_token')) {
        // Supabase auth automatically handles the hash fragment
        router.push('/dashboard');
        return;
      }

      // Check for error
      const error = searchParams.get('error');
      if (error) {
        console.error('Auth callback error:', error);
        router.push('/login?error=' + encodeURIComponent(searchParams.get('error_description') || 'Authentication failed'));
        return;
      }

      // Default: redirect to dashboard
      router.push('/dashboard');
    };

    handleCallback();
  }, [router, searchParams]);

  return (
    <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center">
      <div className="text-center">
        <Loader2 className="mx-auto h-8 w-8 animate-spin text-accent-600" />
        <p className="mt-4 text-sm text-surface-muted-foreground">Completing sign in...</p>
      </div>
    </div>
  );
}
