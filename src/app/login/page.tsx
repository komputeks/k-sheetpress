import type { Metadata } from 'next';
import { LoginPage } from './LoginPage';

export const metadata: Metadata = {
  title: 'Sign In',
  description: 'Sign in to your K-SheetPress account',
};

export default function LoginPageRoute() {
  return <LoginPage />;
}
