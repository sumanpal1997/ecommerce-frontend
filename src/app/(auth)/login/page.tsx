import { Metadata } from 'next';
import { LoginForm } from '@/features/auth/components/LoginForm';

export const metadata: Metadata = {
  title: 'Sign In - ShopFlow',
  description: 'Sign in to access your customer account and orders',
};

export default function LoginPage() {
  return <LoginForm />;
}
