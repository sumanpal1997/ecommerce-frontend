'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  DollarSign,
  ShoppingBag,
  TrendingUp,
  AlertTriangle,
  ArrowRight,
  Package,
  Clock,
  CheckCircle2,
  RefreshCw,
  Truck,
  ExternalLink,
  Boxes,
} from 'lucide-react';
import { adminApi } from '@/features/admin/services/admin.api';
import { AdminMetrics, AdminOrder, InventoryItem } from '@/features/admin/types/admin.types';
import { formatCurrency } from '@/lib/utils/cn';
import { Button } from '@/components/ui/Button';

export default function AdminDashboardPage() {
  const [metrics, setMetrics] = useState<AdminMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMetrics = async (isManual = false) => {
    if (isManual) setIsRefreshing(true);
    try {
      setError(null);
      const data = await adminApi.getMetrics();
      setMetrics(data);
    } catch (err: unknown) {
      console.error('Failed to fetch admin metrics:', err);
      setError('Unable to load real-time analytics. Please verify server status.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PAID':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-400 border border-emerald-500/20">
            Paid &amp; Confirmed
          </span>
        );
      case 'PROCESSING':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-indigo-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-indigo-400 border border-indigo-500/20">
            Fulfillment Processing
          </span>
        );
      case 'SHIPPED':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-purple-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-purple-400 border border-purple-500/20">
            In Transit (Shipped)
          </span>
        );
      case 'DELIVERED':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-teal-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-teal-400 border border-teal-500/20">
            Delivered
          </span>
        );
      case 'PENDING_PAYMENT':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-amber-400 border border-amber-500/20">
            Pending Payment
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-slate-800 px-2.5 py-0.5 text-[11px] font-semibold text-slate-400 border border-slate-700">
            {status}
          </span>
        );
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 w-64 bg-slate-800 rounded-lg"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-32 bg-slate-900 border border-slate-800 rounded-2xl"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header with Title and Refresh */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Operations &amp; Revenue Cockpit
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Real-time financial telemetry, order processing queue, and automated warehouse tracking.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => fetchMetrics(true)}
          disabled={isRefreshing}
          className="self-start sm:self-auto border-slate-800 bg-slate-900 text-slate-300 hover:text-white hover:bg-slate-800"
        >
          <RefreshCw className={`h-3.5 w-3.5 mr-1.5 ${isRefreshing ? 'animate-spin' : ''}`} />
          <span>Refresh Data</span>
        </Button>
      </div>

      {error && (
        <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-4 text-xs font-medium text-rose-300">
          {error}
        </div>
      )}

      {/* 4 Core Financial & Operational KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Gross Sales */}
        <div className="rounded-2xl border border-slate-800/80 bg-slate-900/60 p-5 space-y-3 relative overflow-hidden group hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-semibold uppercase tracking-wider text-[11px]">Gross Revenue</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <DollarSign className="h-4 w-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-white">
              {formatCurrency(metrics?.revenue.total || 0)}
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Paid &amp; scheduled dispatches
            </p>
          </div>
        </div>

        {/* KPI 2: Total Orders */}
        <div className="rounded-2xl border border-slate-800/80 bg-slate-900/60 p-5 space-y-3 relative overflow-hidden group hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-semibold uppercase tracking-wider text-[11px]">Total Orders</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <ShoppingBag className="h-4 w-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-white">
              {metrics?.orders.total || 0}
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Across all customer accounts
            </p>
          </div>
        </div>

        {/* KPI 3: Average Order Value (AOV) */}
        <div className="rounded-2xl border border-slate-800/80 bg-slate-900/60 p-5 space-y-3 relative overflow-hidden group hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-semibold uppercase tracking-wider text-[11px]">Avg. Order Value</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <TrendingUp className="h-4 w-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-white">
              {formatCurrency(metrics?.revenue.aov || 0)}
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Basket size per paying customer
            </p>
          </div>
        </div>

        {/* KPI 4: Low-Stock Warnings */}
        <div className="rounded-2xl border border-slate-800/80 bg-slate-900/60 p-5 space-y-3 relative overflow-hidden group hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-semibold uppercase tracking-wider text-[11px]">Stock Alerts</span>
            <div className={`flex h-8 w-8 items-center justify-center rounded-xl ${
              (metrics?.inventory.lowStockCount || 0) > 0
                ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20 animate-pulse'
                : 'bg-teal-500/10 text-teal-400 border border-teal-500/20'
            }`}>
              <AlertTriangle className="h-4 w-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-white">
              {metrics?.inventory.lowStockCount || 0}
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              SKUs below replenishment threshold
            </p>
          </div>
        </div>
      </div>

      {/* Main Content Grid: Recent Orders & Inventory Watchlist */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders Queue (2 Cols) */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-800/80 bg-slate-900/60 p-6 space-y-5">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
            <div className="flex items-center gap-2">
              <ShoppingBag className="h-4 w-4 text-indigo-400" />
              <h2 className="text-sm font-bold text-white tracking-tight">
                Live Orders Queue ({metrics?.recentOrders.length || 0})
              </h2>
            </div>
            <Link
              href="/admin/orders"
              className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
            >
              <span>Manage All Orders</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          {metrics?.recentOrders.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-500">
              No customer orders recorded yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[10px]">
                    <th className="pb-3 font-semibold">Order #</th>
                    <th className="pb-3 font-semibold">Customer</th>
                    <th className="pb-3 font-semibold">Amount</th>
                    <th className="pb-3 font-semibold">Status</th>
                    <th className="pb-3 font-semibold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {metrics?.recentOrders.map((ord) => {
                    const customerName =
                      typeof ord.userId === 'object' && ord.userId !== null
                        ? `${ord.userId.firstName} ${ord.userId.lastName}`.trim() || ord.userId.email
                        : ord.shippingAddress.fullName || 'Guest Customer';

                    const customerEmail =
                      typeof ord.userId === 'object' && ord.userId !== null
                        ? ord.userId.email
                        : null;

                    return (
                      <tr key={ord._id} className="group hover:bg-slate-800/30 transition-colors">
                        <td className="py-3 font-mono font-bold text-slate-200">
                          {ord.orderNumber}
                        </td>
                        <td className="py-3">
                          <div className="font-medium text-slate-200">{customerName}</div>
                          {customerEmail && (
                            <div className="text-[10px] text-slate-500 font-mono truncate max-w-[140px]">
                              {customerEmail}
                            </div>
                          )}
                        </td>
                        <td className="py-3 font-bold text-white">
                          {formatCurrency(ord.pricing.totalAmount)}
                        </td>
                        <td className="py-3">
                          {getStatusBadge(ord.status)}
                        </td>
                        <td className="py-3 text-right">
                          <Link
                            href="/admin/orders"
                            className="inline-flex items-center gap-1 text-[11px] font-semibold text-indigo-400 hover:text-indigo-300"
                          >
                            <span>Manage</span>
                            <ArrowRight className="h-3 w-3" />
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Inventory Quick Status (1 Col) */}
        <div className="rounded-2xl border border-slate-800/80 bg-slate-900/60 p-6 space-y-5">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
            <div className="flex items-center gap-2">
              <Boxes className="h-4 w-4 text-purple-400" />
              <h2 className="text-sm font-bold text-white tracking-tight">
                Warehouse Stock Radar
              </h2>
            </div>
            <Link
              href="/admin/inventory"
              className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="space-y-3">
            {metrics?.inventory.lowStockItems.length === 0 ? (
              <div className="py-10 text-center space-y-2">
                <CheckCircle2 className="h-8 w-8 text-emerald-400 mx-auto" />
                <p className="text-xs font-bold text-slate-300">All Stock Healthy</p>
                <p className="text-[11px] text-slate-500">
                  Every catalog SKU is above its minimum replenishment threshold.
                </p>
              </div>
            ) : (
              metrics?.inventory.lowStockItems.map((item) => (
                <div
                  key={item._id}
                  className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-3 flex items-center justify-between text-xs"
                >
                  <div className="min-w-0 pr-2">
                    <p className="font-bold text-slate-200 truncate">
                      {item.productId?.title || item.sku}
                    </p>
                    <p className="text-[10px] text-slate-400 font-mono">
                      SKU: {item.sku} • Avail: <strong className="text-amber-400">{item.availableStock}</strong> (Min: {item.lowStockThreshold})
                    </p>
                  </div>
                  <Link href="/admin/inventory">
                    <Button size="sm" variant="outline" className="text-[11px] h-7 px-2 border-slate-700 bg-slate-800 hover:bg-slate-700">
                      Restock
                    </Button>
                  </Link>
                </div>
              ))
            )}

            <div className="pt-2">
              <Link href="/admin/inventory">
                <Button className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold">
                  Open Warehouse Console →
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
