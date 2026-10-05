import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { QueryProvider } from '@/lib/query/query-provider';
import { AuthProvider } from '@/features/auth/context/auth-context';
import { CartProvider } from '@/features/cart/context/cart-context';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { CartDrawer } from '@/features/cart/components/CartDrawer';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'ShopFlow | Premium Curated Lifestyle & Modern Tech Store',
  description:
    'Discover premium lifestyle essentials, flagship technology, ergonomic office furniture, and artisan goods with complimentary 2-day delivery and certified authenticity.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen bg-slate-50 text-slate-900`}
      >
        <QueryProvider>
          <AuthProvider>
            <CartProvider>
              <Header />
              <main className="flex-1 w-full">{children}</main>
              <Footer />
              <CartDrawer />
            </CartProvider>
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
