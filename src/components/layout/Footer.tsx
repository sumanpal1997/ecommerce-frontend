import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Cpu, Database, Lock, RefreshCw } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      {/* Educational Tech Architecture Bar */}
      <div className="border-b border-slate-100 bg-slate-50 py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="flex items-start gap-3">
              <div className="rounded-lg bg-indigo-50 p-2.5 text-indigo-600">
                <Cpu className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                  Modular Monolith
                </h4>
                <p className="mt-1 text-xs text-slate-500">
                  Bounded contexts ready for independent microservice extraction.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="rounded-lg bg-indigo-50 p-2.5 text-indigo-600">
                <Database className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                  Atomic Stock Guard
                </h4>
                <p className="mt-1 text-xs text-slate-500">
                  Storage-engine level atomic conditional updates eliminate overselling.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="rounded-lg bg-indigo-50 p-2.5 text-indigo-600">
                <Lock className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                  Zero-Trust Pricing
                </h4>
                <p className="mt-1 text-xs text-slate-500">
                  Every subtotal is evaluated strictly server-side against live catalog models.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="rounded-lg bg-indigo-50 p-2.5 text-indigo-600">
                <RefreshCw className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                  Dual-Token Security
                </h4>
                <p className="mt-1 text-xs text-slate-500">
                  In-memory access tokens with HttpOnly refresh cookies prevent XSS theft.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <span className="text-base font-bold text-slate-900">SHOPFLOW</span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Enterprise-grade e-commerce engineering showcase. Built with Next.js 16, React 19, TypeScript, Tailwind CSS, Express, MongoDB, and Mongoose.
            </p>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">
              Catalog Domains
            </h3>
            <ul className="space-y-2 text-xs text-slate-600">
              <li>
                <Link href="/" className="hover:text-indigo-600 transition-colors">
                  All Collections
                </Link>
              </li>
              <li>
                <Link href="/?category=electronics" className="hover:text-indigo-600 transition-colors">
                  Consumer Electronics
                </Link>
              </li>
              <li>
                <Link href="/?category=apparel" className="hover:text-indigo-600 transition-colors">
                  Apparel & Fashion
                </Link>
              </li>
              <li>
                <Link href="/?category=home" className="hover:text-indigo-600 transition-colors">
                  Home Essentials
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">
              Customer Account
            </h3>
            <ul className="space-y-2 text-xs text-slate-600">
              <li>
                <Link href="/login" className="hover:text-indigo-600 transition-colors">
                  Sign In
                </Link>
              </li>
              <li>
                <Link href="/register" className="hover:text-indigo-600 transition-colors">
                  Create Account
                </Link>
              </li>
              <li>
                <Link href="/checkout" className="hover:text-indigo-600 transition-colors">
                  Order History & Checkout
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">
              System Design Highlights
            </h3>
            <ul className="space-y-1 text-xs text-slate-500">
              <li>• In-Memory Prefix Trie Search (&lt;1ms)</li>
              <li>• Materialized Category Paths</li>
              <li>• $O(M + N)$ Hash Map Cart Merge</li>
              <li>• Finite Order State Machine</li>
              <li>• Distributed Request Tracing</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-slate-100 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>© {new Date().getFullYear()} ShopFlow Inc. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span>Next.js 16 + React 19</span>
            <span>Express 5 + TypeScript</span>
            <span>MongoDB + Mongoose 9</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
