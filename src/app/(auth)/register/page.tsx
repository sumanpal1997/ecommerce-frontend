import { Metadata } from 'next';
import { RegisterForm } from '@/features/auth/components/RegisterForm';

export const metadata: Metadata = {
  title: 'Create Account - ShopFlow',
  description: 'Create a new customer account to place orders and manage your profile',
};

export default function RegisterPage() {
  return <RegisterForm />;
}
