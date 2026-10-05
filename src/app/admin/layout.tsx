'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  ShoppingBag,
  Boxes,
  ExternalLink,
  ShieldCheck,
  LogOut,
  AlertTriangle,
  Loader2,
  ChevronRight,
  TrendingUp,
  Package,
} from 'lucide-react';
import { useAuth } from '@/features/auth/context/auth-context';
import { Button } from '@/components/ui/Button';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading, isAuthenticated, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Loading state
  if (!mounted || isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
        <p className="text-sm font-medium text-slate-400">
          Verifying administrative credentials...
        </p>
      </div>
    );
  }

  // Unauthorized state: user is either not logged in or not an ADMIN
  if (!isAuthenticated || user?.role !== 'ADMIN') {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-8 text-center space-y-5 shadow-2xl">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-500/10 text-rose-500 border border-rose-500/20">
            <AlertTriangle className="h-7 w-7" />
          </div>

          <div className="space-y-2">
            <h1 className="text-xl font-bold text-white tracking-tight">
              Administrative Access Required
            </h1>
            <p className="text-xs text-slate-400 leading-relaxed">
              This portal is restricted to authorized store operators. Please sign in with an Administrator account to access the back-office console.
            </p>
          </div>

          <div className="rounded-xl bg-slate-800/80 p-3 text-left text-xs font-mono text-slate-300 border border-slate-700/60 space-y-1">
            <div className="text-[11px] text-slate-400 uppercase tracking-wider font-sans font-semibold">
              Admin Test Account:
            </div>
            <div>Email: <strong className="text-indigo-400 font-bold">admin@shopflow.dev</strong></div>
            <div>Password: <strong className="text-indigo-400 font-bold">Password123!</strong></div>
          </div>

          <div className="flex flex-col gap-2 pt-2">
            <Link href="/login?redirect=/admin">
              <Button className="w-full bg-indigo-600 hover:bg-indigo-700 font-bold">
                Sign In as Administrator
              </Button>
            </Link>
            <Link href="/">
              <Button variant="ghost" className="w-full text-slate-400 hover:text-white">
                Return to Storefront
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const navItems = [
    {
      label: 'Executive Dashboard',
      href: '/admin',
      icon: LayoutDashboard,
      active: pathname === '/admin',
    },
    {
      label: 'Orders & Fulfillment',
      href: '/admin/orders',
      icon: ShoppingBag,
      active: pathname.startsWith('/admin/orders'),
    },
    {
      label: 'Inventory & Warehouse',
      href: '/admin/inventory',
      icon: Boxes,
      active: pathname.startsWith('/admin/inventory'),
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 shrink-0 border-b md:border-b-0 md:border-r border-slate-800/80 bg-slate-900/90 flex flex-col">
        {/* Admin Brand Header */}
        <div className="p-5 border-b border-slate-800/80 flex items-center justify-between">
          <Link href="/admin" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-500 text-white shadow-md shadow-indigo-600/30">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <div className="text-sm font-black tracking-tight text-white flex items-center gap-1.5">
                <span>SHOPFLOW</span>
                <span className="text-[10px] bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 rounded px-1 py-0.2 font-mono font-bold">
                  OPS
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium">Control Center</p>
            </div>
          </Link>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 p-3 space-y-1">
          <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
            Operations &amp; Catalog
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  item.active
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="h-4 w-4 shrink-0" />
                  <span>{item.label}</span>
                </div>
                {item.active && <ChevronRight className="h-3.5 w-3.5" />}
              </Link>
            );
          })}

          <div className="pt-4 mt-4 border-t border-slate-800/80">
            <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Consumer View
            </div>
            <Link
              href="/"
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800/60 transition-all group"
            >
              <div className="flex items-center gap-3">
                <ExternalLink className="h-4 w-4 shrink-0 text-slate-500 group-hover:text-indigo-400 transition-colors" />
                <span>Storefront Preview</span>
              </div>
              <span className="text-[10px] text-slate-500 bg-slate-800 px-1.5 py-0.5 rounded">
                Live
              </span>
            </Link>
          </div>
        </div>

        {/* User Badge & Logout */}
        <div className="p-3 border-t border-slate-800/80">
          <div className="flex items-center justify-between p-2 rounded-xl bg-slate-800/40 border border-slate-800">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white font-bold text-xs shrink-0">
                {user.firstName ? user.firstName[0].toUpperCase() : 'A'}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-white truncate">
                  {user.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : user.email}
                </p>
                <p className="text-[10px] text-indigo-400 font-mono font-semibold">
                  STORE OPERATOR
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={async () => {
                await logout();
                router.push('/login');
              }}
              className="p-1.5 text-slate-400 hover:text-rose-400 transition-colors rounded-lg hover:bg-slate-800 cursor-pointer"
              title="Sign out of Admin Session"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Back-Office Content Area */}
      <main className="flex-1 min-w-0 overflow-y-auto bg-slate-950">
        {/* Top Operational Status Bar */}
        <div className="border-b border-slate-800/80 bg-slate-900/50 px-6 py-2.5 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-slate-400">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-medium text-slate-300">Warehouse &amp; Order Pipeline: Online</span>
          </div>
          <div className="flex items-center gap-3 text-slate-400 text-[11px]">
            <span>Environment: <strong className="text-slate-200">Localhost Studio</strong></span>
            <span>•</span>
            <span>Security: <strong className="text-emerald-400">Zero-Trust Enforced</strong></span>
          </div>
        </div>

        <div className="p-6 sm:p-8 lg:p-10 max-w-7xl mx-auto space-y-8">
          {children}
        </div>
      </main>
    </div>
  );
}
