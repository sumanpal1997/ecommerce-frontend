'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, usePathname } from 'next/navigation';
import {
  ShoppingBag,
  User,
  LogOut,
  Menu,
  X,
  ShieldCheck,
  ChevronDown,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '@/features/auth/context/auth-context';
import { useCart } from '@/features/cart/context/cart-context';
import { SearchBar } from '@/features/products/components/SearchBar';
import { Button } from '@/components/ui/Button';

function HeaderNavLinks() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const currentCategory = searchParams.get('category') || '';

  const navItems = [
    { label: 'All Catalog', href: '/', isActive: pathname === '/' && !currentCategory },
    { label: 'Electronics', href: '/?category=electronics', isActive: currentCategory === 'electronics' },
    { label: 'Apparel', href: '/?category=apparel', isActive: currentCategory === 'apparel' },
    { label: 'Home & Living', href: '/?category=home', isActive: currentCategory === 'home' },
  ];

  return (
    <nav className="hidden lg:flex items-center gap-6 text-sm font-medium">
      {navItems.map((item) => (
        <Link
          key={item.label}
          href={item.href}
          className={`transition-colors py-1 relative ${
            item.isActive
              ? 'text-indigo-600 font-semibold'
              : 'text-slate-600 hover:text-indigo-600'
          }`}
        >
          {item.label}
          {item.isActive && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 rounded-full" />
          )}
        </Link>
      ))}
    </nav>
  );
}

function MobileNavLinks({ onSelect }: { onSelect: () => void }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const currentCategory = searchParams.get('category') || '';

  const navItems = [
    { label: 'All Products', href: '/', isActive: pathname === '/' && !currentCategory },
    { label: 'Electronics (Audio, Computers, Wearables)', href: '/?category=electronics', isActive: currentCategory === 'electronics' },
    { label: 'Apparel & Footwear', href: '/?category=apparel', isActive: currentCategory === 'apparel' },
    { label: 'Home & Living (Kitchen & Office)', href: '/?category=home', isActive: currentCategory === 'home' },
  ];

  return (
    <nav className="flex flex-col space-y-2 pt-2">
      {navItems.map((item) => (
        <Link
          key={item.label}
          href={item.href}
          onClick={onSelect}
          className={`text-sm py-2 px-3 rounded-lg transition-colors ${
            item.isActive
              ? 'bg-indigo-50 text-indigo-700 font-semibold'
              : 'text-slate-700 hover:bg-slate-50'
          }`}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}

export function Header() {
  const { user, isAuthenticated, logout } = useAuth();
  const { cart, openCart } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const itemCount = cart?.itemCount || 0;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/95 backdrop-blur-md">
      {/* Top Promotional Bar */}
      <div className="bg-slate-900 px-4 py-2 text-center text-xs text-slate-300 font-medium tracking-wide">
        <div className="mx-auto max-w-7xl flex items-center justify-between">
          <span className="hidden md:inline-flex items-center gap-1.5 text-indigo-400">
            <Sparkles className="h-3.5 w-3.5" />
            <span>High-Concurrency Modular Monolith</span>
          </span>
          <p className="mx-auto md:mx-0">
            <strong>Free Express Shipping</strong> on all orders over $100 • Use code <span className="bg-indigo-600/40 text-indigo-300 px-1.5 py-0.5 rounded font-mono font-bold">SHOPFLOW10</span> for 10% off
          </p>
          <span className="hidden lg:inline text-slate-400">
            Atomic Inventory Guard • Zero Overselling
          </span>
        </div>
      </div>

      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8 h-16">
        {/* Brand Logo & Desktop Nav */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-sm shadow-indigo-200 group-hover:scale-105 transition-transform">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black tracking-tight text-slate-900 leading-none">
                SHOPFLOW
              </span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-600 leading-none mt-0.5">
                ENTERPRISE
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links wrapped in Suspense */}
          <Suspense fallback={<div className="h-4 w-48 bg-slate-100 rounded animate-pulse" />}>
            <HeaderNavLinks />
          </Suspense>
        </div>

        {/* Center Search Bar */}
        <div className="hidden sm:flex flex-1 justify-center max-w-md mx-2">
          <SearchBar />
        </div>

        {/* Right Actions: Auth & Cart */}
        <div className="flex items-center gap-3">
          {isAuthenticated && user ? (
            <div className="relative">
              {(() => {
                const displayName = user.firstName
                  ? `${user.firstName} ${user.lastName || ''}`.trim()
                  : user.email;
                const initial = user.firstName ? user.firstName[0].toUpperCase() : 'U';

                return (
                  <>
                    <button
                      type="button"
                      onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                      className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 py-1.5 px-3 text-xs font-medium text-slate-700 hover:bg-slate-100 transition-colors"
                      aria-label="User account menu"
                    >
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-600 text-white font-bold text-[11px]">
                        {initial}
                      </div>
                      <span className="hidden md:inline max-w-[120px] truncate">
                        {displayName}
                      </span>
                      <ChevronDown className="h-3 w-3 text-slate-400" />
                    </button>

                    {userDropdownOpen && (
                      <div
                        className="absolute right-0 mt-2 w-56 rounded-xl border border-slate-200 bg-white py-1.5 shadow-lg z-50 animate-fadeIn"
                        onMouseLeave={() => setUserDropdownOpen(false)}
                      >
                        <div className="px-4 py-2.5 border-b border-slate-100">
                          <p className="text-xs font-bold text-slate-900 truncate">
                            {displayName}
                          </p>
                          <p className="text-[11px] text-slate-500 truncate">
                            {user.email}
                          </p>
                          <span className="inline-block mt-1.5 rounded-full bg-indigo-50 px-2 py-0.5 text-[10px] font-semibold text-indigo-700">
                            {user.role} ACCOUNT
                          </span>
                        </div>

                        <Link
                          href="/checkout"
                          onClick={() => setUserDropdownOpen(false)}
                          className="block px-4 py-2 text-xs text-slate-700 hover:bg-slate-50"
                        >
                          Checkout & Orders
                        </Link>

                        <button
                          type="button"
                          onClick={async () => {
                            setUserDropdownOpen(false);
                            await logout();
                          }}
                          className="flex w-full items-center gap-2 px-4 py-2 text-left text-xs text-rose-600 hover:bg-rose-50"
                        >
                          <LogOut className="h-3.5 w-3.5" />
                          Sign Out
                        </button>
                      </div>
                    )}
                  </>
                );
              })()}
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-2">
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Sign In
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm">
                  Register
                </Button>
              </Link>
            </div>
          )}

          {/* Cart Icon Trigger */}
          <button
            type="button"
            onClick={openCart}
            className="relative flex items-center justify-center rounded-xl border border-slate-200 bg-white p-2.5 text-slate-700 hover:border-indigo-600 hover:text-indigo-600 transition-colors shadow-2xs group"
            aria-label={`Open shopping cart with ${itemCount} items`}
          >
            <ShoppingBag className="h-5 w-5 group-hover:scale-110 transition-transform" />
            {itemCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-[11px] font-bold text-white shadow-xs animate-scaleIn">
                {itemCount > 99 ? '99+' : itemCount}
              </span>
            )}
          </button>

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="sm:hidden rounded-lg p-2 text-slate-500 hover:bg-slate-100"
            aria-label="Toggle mobile navigation"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-t border-slate-200 bg-white px-4 py-4 space-y-4">
          <SearchBar />

          <Suspense fallback={<div className="h-10 bg-slate-100 rounded animate-pulse" />}>
            <MobileNavLinks onSelect={() => setMobileMenuOpen(false)} />
          </Suspense>

          {!isAuthenticated && (
            <div className="pt-3 border-t border-slate-100 flex gap-2">
              <Link href="/login" className="flex-1" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="outline" size="sm" className="w-full">
                  Sign In
                </Button>
              </Link>
              <Link href="/register" className="flex-1" onClick={() => setMobileMenuOpen(false)}>
                <Button size="sm" className="w-full">
                  Register
                </Button>
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
