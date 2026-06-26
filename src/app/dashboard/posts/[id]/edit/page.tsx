import type { Metadata } from 'next';
import { EditPostPage } from './EditPostPage';

export const metadata: Metadata = {
  title: 'Edit Post',
};

export default function EditPostRoute() {
  return <EditPostPage />;
}
