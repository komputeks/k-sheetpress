import type { Metadata } from 'next';
import { ProfilePage } from './ProfilePage';

export async function generateMetadata({ params }: { params: Promise<{ username: string }> }): Promise<Metadata> {
  const { username } = await params;
  return {
    title: `@${username}`,
    description: `Posts by ${username} on K-SheetPress`,
  };
}

export default function ProfileRoute({ params }: { params: Promise<{ username: string }> }) {
  return <ProfilePage params={params} />;
}
