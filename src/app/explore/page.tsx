import type { Metadata } from 'next';
import { Suspense } from 'react';
import { ExplorePage } from './ExplorePage';

export const metadata: Metadata = {
  title: 'Explore Posts',
  description: 'Discover blog posts from K-SheetPress authors',
};

export default function ExploreRoute() {
  return (
    <Suspense>
      <ExplorePage />
    </Suspense>
  );
}
