import React from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  Truck,
  RotateCcw,
  Headphones,
  CheckCircle2,
  CreditCard,
  Mail,
  ExternalLink,
} from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      {/* 4 Customer Trust & Quality Pillars */}
      <div className="border-b border-slate-100 bg-slate-50 py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex items-start gap-3.5">
              <div className="rounded-xl bg-indigo-50 p-2.5 text-indigo-600 shrink-0">
                <Truck className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                  Free Express Delivery
                </h4>
                <p className="mt-1 text-xs text-slate-500 leading-relaxed">
                  Complimentary 2-day tracked shipping on all qualified orders over $100.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="rounded-xl bg-emerald-50 p-2.5 text-emerald-600 shrink-0">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                  100% Certified Authentic
                </h4>
                <p className="mt-1 text-xs text-slate-500 leading-relaxed">
                  Direct brand authorizations with genuine serialized factory warranties.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="rounded-xl bg-indigo-50 p-2.5 text-indigo-600 shrink-0">
                <RotateCcw className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                  30-Day Risk-Free Returns
                </h4>
                <p className="mt-1 text-xs text-slate-500 leading-relaxed">
                  Hassle-free return policy with prepaid return labels and zero restocking fees.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="rounded-xl bg-purple-50 p-2.5 text-purple-600 shrink-0">
                <Headphones className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                  Dedicated Concierge Care
                </h4>
                <p className="mt-1 text-xs text-slate-500 leading-relaxed">
                  Expert hardware specialists available 7 days a week for setup and sizing.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Column */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <span className="text-base font-black tracking-tight text-slate-900">SHOPFLOW</span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              ShopFlow is a premier retailer of curated personal computing, high-fidelity audio, technical apparel, and ergonomic workspace furniture.
            </p>
            <div className="pt-1 flex items-center gap-2 text-xs text-emerald-700 font-semibold">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              <span>Authorized Premier Dealer</span>
            </div>
          </div>

          {/* Shop Departments */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">
              Shop Departments
            </h3>
            <ul className="space-y-2 text-xs text-slate-600">
              <li>
                <Link href="/" className="hover:text-indigo-600 transition-colors">
                  All Featured Collections
                </Link>
              </li>
              <li>
                <Link href="/?category=electronics" className="hover:text-indigo-600 transition-colors">
                  Consumer Electronics &amp; Computing
                </Link>
              </li>
              <li>
                <Link href="/?category=apparel" className="hover:text-indigo-600 transition-colors">
                  Technical Performance Apparel
                </Link>
              </li>
              <li>
                <Link href="/?category=home" className="hover:text-indigo-600 transition-colors">
                  Home Essentials &amp; Ergonomics
                </Link>
              </li>
              <li>
                <Link href="/?sortBy=newest" className="hover:text-indigo-600 transition-colors">
                  New Arrivals &amp; Hardware Drops
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">
              Customer Care
            </h3>
            <ul className="space-y-2 text-xs text-slate-600">
              <li>
                <Link href="/orders" className="hover:text-indigo-600 transition-colors">
                  Track Your Order
                </Link>
              </li>
              <li>
                <Link href="/checkout" className="hover:text-indigo-600 transition-colors">
                  Shipping &amp; Delivery FAQ
                </Link>
              </li>
              <li>
                <Link href="/orders" className="hover:text-indigo-600 transition-colors">
                  Returns &amp; Exchange Portal
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-indigo-600 transition-colors">
                  Member Rewards &amp; VIP Club
                </Link>
              </li>
              <li>
                <Link href="/orders" className="hover:text-indigo-600 transition-colors">
                  Warranty &amp; Product Protection
                </Link>
              </li>
            </ul>
          </div>

          {/* Payment & Security */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">
              Guaranteed Safe Checkout
            </h3>
            <p className="text-xs text-slate-500 mb-3 leading-relaxed">
              All transactions are encrypted with industry-standard 256-bit SSL protocols.
            </p>
            <div className="flex flex-wrap gap-2 text-[11px] font-semibold text-slate-700">
              <span className="rounded-md border border-slate-200 bg-slate-50 px-2 py-1">Visa</span>
              <span className="rounded-md border border-slate-200 bg-slate-50 px-2 py-1">Mastercard</span>
              <span className="rounded-md border border-slate-200 bg-slate-50 px-2 py-1">American Express</span>
              <span className="rounded-md border border-slate-200 bg-slate-50 px-2 py-1">Apple Pay</span>
              <span className="rounded-md border border-slate-200 bg-slate-50 px-2 py-1">Google Pay</span>
              <span className="rounded-md border border-slate-200 bg-slate-50 px-2 py-1">PayPal</span>
            </div>
          </div>
        </div>

        {/* Bottom Copyright & Legal Links */}
        <div className="mt-10 border-t border-slate-100 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>© {new Date().getFullYear()} ShopFlow Retail Inc. All rights reserved.</p>
          <div className="flex items-center gap-6 text-slate-500">
            <span className="hover:text-indigo-600 transition-colors cursor-pointer">Privacy Policy</span>
            <span className="hover:text-indigo-600 transition-colors cursor-pointer">Terms of Service</span>
            <span className="hover:text-indigo-600 transition-colors cursor-pointer">Cookie Preferences</span>
            <span className="hover:text-indigo-600 transition-colors cursor-pointer">Accessibility</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
