'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ShoppingBag, User, LogOut, Menu, X, ShieldCheck } from 'lucide-react';
import { useAuth } from '@/features/auth/context/auth-context';
import { useCart } from '@/features/cart/context/cart-context';
import { SearchBar } from '@/features/products/components/SearchBar';
import { Button } from '@/components/ui/Button';

export function Header() {
  const { user, isAuthenticated, logout } = useAuth();
  const { cart, openCart } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const itemCount = cart?.itemCount || 0;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/95 backdrop-blur-md">
      {/* Top educational announcement banner */}
      <div className="bg-slate-900 px-4 py-1.5 text-center text-xs text-slate-300 font-medium tracking-wide">
        <span className="hidden sm:inline">Production-Grade Modular Monolith | </span>
        <span>Free Shipping on orders over $100</span>
        <span className="hidden md:inline"> | Real-time Inventory Concurrency Guards</span>
      </div>

      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8 h-16">
        {/* Brand Logo */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-sm shadow-indigo-200">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold tracking-tight text-slate-900 leading-none">
                SHOPFLOW
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-widest text-indigo-600 leading-none mt-0.5">
                ENTERPRISE
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-600">
            <Link href="/" className="hover:text-indigo-600 transition-colors">
              Catalog
            </Link>
            <Link href="/?category=electronics" className="hover:text-indigo-600 transition-colors">
              Electronics
            </Link>
            <Link href="/?category=apparel" className="hover:text-indigo-600 transition-colors">
              Apparel
            </Link>
            <Link href="/?category=home" className="hover:text-indigo-600 transition-colors">
              Home
            </Link>
          </nav>
        </div>

        {/* Search Bar (Desktop & Tablet) */}
        <div className="hidden sm:flex flex-1 justify-center max-w-md mx-4">
          <SearchBar />
        </div>

        {/* Right Action Icons & Auth */}
        <div className="flex items-center gap-3">
          {/* User Profile / Auth */}
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
                    </button>

                    {userDropdownOpen && (
                      <div
                        className="absolute right-0 mt-2 w-52 rounded-xl border border-slate-200 bg-white py-1.5 shadow-lg z-50 animate-fadeIn"
                        onMouseLeave={() => setUserDropdownOpen(false)}
                      >
                        <div className="px-4 py-2 border-b border-slate-100">
                          <p className="text-xs font-semibold text-slate-900 truncate">
                            {displayName}
                          </p>
                          <p className="text-[11px] text-slate-500 truncate">
                            {user.email}
                          </p>
                          <span className="inline-block mt-1 rounded bg-indigo-50 px-1.5 py-0.5 text-[10px] font-semibold text-indigo-700">
                            {user.role}
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
            className="relative flex items-center justify-center rounded-xl border border-slate-200 bg-white p-2.5 text-slate-700 hover:border-indigo-600 hover:text-indigo-600 transition-colors shadow-2xs"
            aria-label={`Open shopping cart with ${itemCount} items`}
          >
            <ShoppingBag className="h-5 w-5" />
            {itemCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-[11px] font-bold text-white shadow-xs animate-scaleIn">
                {itemCount > 99 ? '99+' : itemCount}
              </span>
            )}
          </button>

          {/* Mobile Menu Toggle Button */}
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

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-t border-slate-200 bg-white px-4 py-4 space-y-4">
          <SearchBar />

          <nav className="flex flex-col space-y-2 pt-2">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm font-medium text-slate-700 py-1.5 hover:text-indigo-600"
            >
              All Products
            </Link>
            <Link
              href="/?category=electronics"
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm font-medium text-slate-700 py-1.5 hover:text-indigo-600"
            >
              Electronics
            </Link>
            <Link
              href="/?category=apparel"
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm font-medium text-slate-700 py-1.5 hover:text-indigo-600"
            >
              Apparel
            </Link>
            <Link
              href="/?category=home"
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm font-medium text-slate-700 py-1.5 hover:text-indigo-600"
            >
              Home & Kitchen
            </Link>
          </nav>

          {!isAuthenticated && (
            <div className="pt-2 border-t border-slate-100 flex gap-2">
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
