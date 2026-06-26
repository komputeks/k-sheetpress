import type { Metadata } from 'next';
import { PostEditorPage } from './PostEditorPage';

export const metadata: Metadata = {
  title: 'New Post',
};

export default function NewPostRoute() {
  return <PostEditorPage />;
}
