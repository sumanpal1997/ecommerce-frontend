'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import {
  Package,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  Clock,
  CheckCircle2,
  AlertCircle,
  Truck,
  RotateCcw,
  Sparkles,
  CreditCard,
  User,
} from 'lucide-react';
import { orderApi } from '@/features/orders/services/order.api';
import { OrderCard } from '@/features/orders/components/OrderCard';
import { useAuth } from '@/features/auth/context/auth-context';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { formatCurrency } from '@/lib/utils/cn';

type FilterTab = 'ALL' | 'PENDING' | 'PAID' | 'DELIVERED';

export default function OrdersPage() {
  const { user, isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<FilterTab>('ALL');

  const { data, isLoading: isOrdersLoading, error, refetch } = useQuery({
    queryKey: ['my-orders'],
    queryFn: () => orderApi.getMyOrders(1, 50),
    enabled: isAuthenticated,
  });

  const orders = data?.orders || [];

  // Filter orders based on active tab
  const filteredOrders = orders.filter((order) => {
    switch (activeTab) {
      case 'PENDING':
        return order.status === 'PENDING_PAYMENT';
      case 'PAID':
        return ['PAID', 'PROCESSING', 'SHIPPED'].includes(order.status);
      case 'DELIVERED':
        return order.status === 'DELIVERED';
      case 'ALL':
      default:
        return true;
    }
  });

  // Calculate high-level summary metrics
  const pendingCount = orders.filter((o) => o.status === 'PENDING_PAYMENT').length;
  const activeProcessingCount = orders.filter((o) =>
    ['PAID', 'PROCESSING', 'SHIPPED'].includes(o.status),
  ).length;
  const deliveredCount = orders.filter((o) => o.status === 'DELIVERED').length;
  const totalLifetimeSpend = orders
    .filter((o) => o.status !== 'CANCELLED')
    .reduce((sum, o) => sum + (o.pricing?.totalAmount || 0), 0);

  // 1. Loading State
  if (isAuthLoading) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="space-y-4 animate-pulse">
          <div className="h-6 w-36 bg-slate-200 rounded" />
          <div className="h-10 w-64 bg-slate-200 rounded" />
          <div className="h-32 bg-slate-200 rounded-2xl mt-6" />
        </div>
      </div>
    );
  }

  // 2. Unauthenticated State
  if (!isAuthenticated) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white p-8 sm:p-12 text-center shadow-sm space-y-6">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
            <Package className="h-8 w-8" />
          </div>

          <div className="space-y-2 max-w-md mx-auto">
            <h1 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
              Sign In to View Orders
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              Your order history, delivery telemetry, and immutable line-item price freeze snapshots are tied to your verified customer account.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link href="/login?redirect=/orders">
              <Button size="md" className="px-6 font-bold">
                Sign In to Account
              </Button>
            </Link>
            <Link href="/register?redirect=/orders">
              <Button variant="outline" size="md" className="px-6 font-semibold">
                Create Account
              </Button>
            </Link>
          </div>

          {/* Quick Demo Credentials Helper */}
          <div className="mt-8 rounded-2xl border border-indigo-100 bg-indigo-50/60 p-4 text-left max-w-md mx-auto space-y-2 text-xs">
            <div className="flex items-center gap-1.5 font-bold text-indigo-900">
              <Sparkles className="h-4 w-4 text-indigo-600" />
              <span>Demo Account Credentials</span>
            </div>
            <p className="text-slate-600">
              Test customer order history using the seeded account:
            </p>
            <div className="rounded-lg bg-white p-2.5 font-mono text-[11px] text-slate-800 border border-indigo-100 space-y-1">
              <div>Email: <strong className="text-indigo-600">customer@shopflow.dev</strong></div>
              <div>Password: <strong className="text-indigo-600">Password123!</strong></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 3. Authenticated Order Hub
  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8 space-y-8">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-xs text-slate-400">
        <Link href="/" className="hover:text-slate-600 transition-colors">
          Storefront
        </Link>
        <span>/</span>
        <span className="text-slate-400">Account</span>
        <span>/</span>
        <span className="text-indigo-600 font-semibold">Order History</span>
      </div>

      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 pb-6">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700 border border-indigo-100">
            <ShieldCheck className="h-3.5 w-3.5 text-indigo-600" />
            <span>Zero-Trust Order Snapshot Engine</span>
          </div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
            My Orders &amp; Receipts
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-xl">
            Track order fulfillment state transitions, view itemized price-frozen receipts, and simulate mock payment webhooks in real-time.
          </p>
        </div>

        <Link href="/">
          <Button variant="outline" size="sm" className="flex items-center gap-1.5 text-xs">
            <ShoppingBag className="h-3.5 w-3.5" />
            <span>Browse Products</span>
          </Button>
        </Link>
      </div>

      {/* Summary KPI Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs">
          <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Total Orders Placed
          </span>
          <p className="text-2xl font-black text-slate-900 mt-1">
            {orders.length}
          </p>
          <span className="text-[11px] text-slate-500 font-medium">Lifetime count</span>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs">
          <span className="block text-[11px] font-bold uppercase tracking-wider text-amber-500">
            Pending Payment
          </span>
          <p className="text-2xl font-black text-amber-600 mt-1">
            {pendingCount}
          </p>
          <span className="text-[11px] text-slate-500 font-medium">Awaiting simulation</span>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs">
          <span className="block text-[11px] font-bold uppercase tracking-wider text-indigo-500">
            Active Fulfillment
          </span>
          <p className="text-2xl font-black text-indigo-600 mt-1">
            {activeProcessingCount}
          </p>
          <span className="text-[11px] text-slate-500 font-medium">Paid &amp; Processing</span>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs">
          <span className="block text-[11px] font-bold uppercase tracking-wider text-emerald-600">
            Total Capital Committed
          </span>
          <p className="text-2xl font-black text-slate-900 mt-1">
            {formatCurrency(totalLifetimeSpend)}
          </p>
          <span className="text-[11px] text-emerald-600 font-medium font-mono">
            {deliveredCount} Delivered
          </span>
        </div>
      </div>

      {/* Filter Tabs Bar */}
      <div className="flex items-center gap-2 overflow-x-auto border-b border-slate-200 pb-3 text-xs font-semibold">
        <button
          type="button"
          onClick={() => setActiveTab('ALL')}
          className={`rounded-lg px-3.5 py-2 transition-all cursor-pointer ${
            activeTab === 'ALL'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          All Orders ({orders.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('PENDING')}
          className={`rounded-lg px-3.5 py-2 transition-all cursor-pointer ${
            activeTab === 'PENDING'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Pending Payment ({pendingCount})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('PAID')}
          className={`rounded-lg px-3.5 py-2 transition-all cursor-pointer ${
            activeTab === 'PAID'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Paid &amp; In-Transit ({activeProcessingCount})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('DELIVERED')}
          className={`rounded-lg px-3.5 py-2 transition-all cursor-pointer ${
            activeTab === 'DELIVERED'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Delivered ({deliveredCount})
        </button>
      </div>

      {/* Orders List Container */}
      <div className="space-y-4">
        {isOrdersLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, idx) => (
              <div
                key={idx}
                className="h-44 rounded-2xl border border-slate-200 bg-white p-6 animate-pulse shadow-xs"
              />
            ))}
          </div>
        ) : filteredOrders.length > 0 ? (
          filteredOrders.map((order) => <OrderCard key={order._id} order={order} />)
        ) : (
          /* Empty Orders View */
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white py-16 px-6 text-center shadow-xs space-y-4">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
              <ShoppingBag className="h-7 w-7" />
            </div>

            <div className="space-y-1 max-w-sm mx-auto">
              <h3 className="text-base font-bold text-slate-900">
                {activeTab === 'ALL'
                  ? 'No Orders Placed Yet'
                  : `No ${activeTab.toLowerCase()} orders found`}
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                {activeTab === 'ALL'
                  ? 'Explore our flagship electronics, technical outerwear, and ergonomic workspaces to place your first order.'
                  : 'Try selecting another tab or browse all catalog products.'}
              </p>
            </div>

            <Link href="/" className="inline-block pt-2">
              <Button size="sm" className="px-5 font-bold">
                Start Exploring Catalog
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
