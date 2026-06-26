import type { Metadata } from 'next';
import { DashboardPage } from './DashboardPage';
import { ErrorBoundary } from '@/components/ErrorBoundary';

export const metadata: Metadata = {
  title: 'Dashboard',
};

export default function DashboardRoute() {
  return (
    <ErrorBoundary>
      <DashboardPage />
    </ErrorBoundary>
  );
}
