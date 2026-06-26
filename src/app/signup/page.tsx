import type { Metadata } from 'next';
import { SignUpPage } from './SignUpPage';

export const metadata: Metadata = {
  title: 'Sign Up',
  description: 'Create your K-SheetPress account',
};

export default function SignUpRoute() {
  return <SignUpPage />;
}
