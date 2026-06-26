import { Suspense } from 'react';
import { AuthCallbackHandler } from './AuthCallbackHandler';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Auth Callback',
};

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center">
        <div className="text-center">
          <div className="skeleton mx-auto h-8 w-8 rounded-full" />
          <p className="mt-4 text-sm text-surface-muted-foreground">Completing sign in...</p>
        </div>
      </div>
    }>
      <AuthCallbackHandler />
    </Suspense>
  );
}
