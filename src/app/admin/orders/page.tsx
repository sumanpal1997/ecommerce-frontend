'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ShoppingBag,
  Filter,
  Search,
  CheckCircle2,
  Truck,
  Package,
  Clock,
  XCircle,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  RefreshCw,
} from 'lucide-react';
import { adminApi } from '@/features/admin/services/admin.api';
import { AdminOrder } from '@/features/admin/types/admin.types';
import { OrderStatus } from '@/features/orders/types/order.types';
import { formatCurrency } from '@/lib/utils/cn';
import { Button } from '@/components/ui/Button';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState<string | null>(null);
  const [notice, setNotice] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Ship order modal state
  const [shippingOrderId, setShippingOrderId] = useState<string | null>(null);
  const [trackingNumber, setTrackingNumber] = useState('');

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      setNotice(null);
      const res = await adminApi.getAllOrders(selectedStatus);
      setOrders(res.orders);
    } catch (err) {
      console.error('Failed to load admin orders:', err);
      setNotice({ type: 'error', text: 'Failed to retrieve orders from database.' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [selectedStatus]);

  const handleUpdateStatus = async (orderId: string, nextStatus: OrderStatus, tracking?: string) => {
    setIsUpdating(orderId);
    setNotice(null);
    try {
      const updated = await adminApi.updateOrderStatus(orderId, nextStatus, tracking);
      setOrders((prev) => prev.map((o) => (o._id === orderId ? updated : o)));
      setNotice({
        type: 'success',
        text: `Order ${updated.orderNumber} successfully updated to ${nextStatus}.`,
      });
      setShippingOrderId(null);
      setTrackingNumber('');
    } catch (err: unknown) {
      console.error('Status transition failed:', err);
      setNotice({
        type: 'error',
        text: 'Failed to transition order status. Check business rules or state transition limits.',
      });
    } finally {
      setIsUpdating(null);
    }
  };

  const statusTabs = [
    { label: 'All Orders', value: 'ALL' },
    { label: 'Pending Payment', value: 'PENDING_PAYMENT' },
    { label: 'Paid', value: 'PAID' },
    { label: 'Processing', value: 'PROCESSING' },
    { label: 'Shipped', value: 'SHIPPED' },
    { label: 'Delivered', value: 'DELIVERED' },
    { label: 'Cancelled', value: 'CANCELLED' },
  ];

  const filteredOrders = orders.filter((ord) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const orderNum = ord.orderNumber.toLowerCase();
    const customer =
      typeof ord.userId === 'object' && ord.userId !== null
        ? `${ord.userId.firstName} ${ord.userId.lastName} ${ord.userId.email}`.toLowerCase()
        : ord.shippingAddress.fullName.toLowerCase();
    return orderNum.includes(q) || customer.includes(q);
  });

  const getStatusBadge = (status: OrderStatus) => {
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
            Processing
          </span>
        );
      case 'SHIPPED':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-purple-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-purple-400 border border-purple-500/20">
            Shipped
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
      case 'CANCELLED':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-rose-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-rose-400 border border-rose-500/20">
            Cancelled
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

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Order Fulfillment &amp; Pipeline
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Inspect customer purchase snapshots, advance warehouse dispatch states, and log tracking numbers.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={fetchOrders}
          disabled={isLoading}
          className="self-start sm:self-auto border-slate-800 bg-slate-900 text-slate-300 hover:text-white hover:bg-slate-800"
        >
          <RefreshCw className={`h-3.5 w-3.5 mr-1.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Refresh Queue</span>
        </Button>
      </div>

      {notice && (
        <div
          className={`rounded-xl border p-4 text-xs font-semibold flex items-center gap-2 ${
            notice.type === 'success'
              ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
              : 'border-rose-500/30 bg-rose-500/10 text-rose-300'
          }`}
        >
          {notice.type === 'success' ? (
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
          ) : (
            <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
          )}
          <span>{notice.text}</span>
        </div>
      )}

      {/* Status Filter Tabs & Search Bar */}
      <div className="rounded-2xl border border-slate-800/80 bg-slate-900/60 p-4 space-y-4">
        <div className="flex flex-wrap items-center gap-1.5 border-b border-slate-800/80 pb-3">
          {statusTabs.map((tab) => (
            <button
              key={tab.value}
              type="button"
              onClick={() => setSelectedStatus(tab.value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                selectedStatus === tab.value
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search orders by ORD number, customer name, or email..."
            className="w-full rounded-xl border border-slate-800 bg-slate-950/80 py-2.5 pl-10 pr-4 text-xs text-slate-100 placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Orders Table */}
      <div className="rounded-2xl border border-slate-800/80 bg-slate-900/60 overflow-hidden">
        {isLoading ? (
          <div className="py-16 text-center text-xs text-slate-500 flex items-center justify-center gap-2">
            <RefreshCw className="h-4 w-4 animate-spin text-indigo-500" />
            <span>Loading orders from database...</span>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="py-16 text-center space-y-2">
            <ShoppingBag className="h-8 w-8 text-slate-600 mx-auto" />
            <p className="text-sm font-bold text-slate-300">No orders found</p>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              No orders matched the selected status &ldquo;{selectedStatus}&rdquo; or search query.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-800 bg-slate-900/90 text-slate-400 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3.5 px-4 font-semibold">Order</th>
                  <th className="py-3.5 px-4 font-semibold">Customer</th>
                  <th className="py-3.5 px-4 font-semibold">Items</th>
                  <th className="py-3.5 px-4 font-semibold">Total Amount</th>
                  <th className="py-3.5 px-4 font-semibold">Fulfillment Status</th>
                  <th className="py-3.5 px-4 font-semibold text-right">Workflow Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredOrders.map((order) => {
                  const customerName =
                    typeof order.userId === 'object' && order.userId !== null
                      ? `${order.userId.firstName} ${order.userId.lastName}`.trim() || order.userId.email
                      : order.shippingAddress.fullName || 'Guest';

                  const customerEmail =
                    typeof order.userId === 'object' && order.userId !== null
                      ? order.userId.email
                      : null;

                  return (
                    <tr key={order._id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="py-4 px-4 align-top">
                        <div className="font-mono font-bold text-white text-xs">
                          {order.orderNumber}
                        </div>
                        <div className="text-[10px] text-slate-500 mt-0.5">
                          {new Date(order.createdAt).toLocaleDateString('en-US', {
                            dateStyle: 'medium',
                          })}
                        </div>
                        {order.trackingNumber && (
                          <div className="mt-1 inline-flex items-center gap-1 font-mono text-[10px] text-purple-400 bg-purple-500/10 px-1.5 py-0.5 rounded border border-purple-500/20">
                            <Truck className="h-3 w-3" />
                            <span>{order.trackingNumber}</span>
                          </div>
                        )}
                      </td>

                      <td className="py-4 px-4 align-top">
                        <div className="font-bold text-slate-200">{customerName}</div>
                        {customerEmail && (
                          <div className="text-[11px] text-slate-400 font-mono">
                            {customerEmail}
                          </div>
                        )}
                        <div className="text-[10px] text-slate-500 mt-1">
                          {order.shippingAddress.city}, {order.shippingAddress.country}
                        </div>
                      </td>

                      <td className="py-4 px-4 align-top">
                        <div className="space-y-1 max-w-[200px]">
                          {order.items.map((item, idx) => (
                            <div key={idx} className="flex items-center gap-1.5 truncate text-[11px] text-slate-300">
                              <span className="font-mono text-indigo-400 font-bold">{item.quantity}×</span>
                              <span className="truncate">{item.title}</span>
                            </div>
                          ))}
                        </div>
                      </td>

                      <td className="py-4 px-4 align-top font-bold text-white text-sm">
                        {formatCurrency(order.pricing.totalAmount)}
                      </td>

                      <td className="py-4 px-4 align-top">
                        {getStatusBadge(order.status)}
                      </td>

                      <td className="py-4 px-4 align-top text-right space-y-1.5">
                        <div className="flex items-center justify-end gap-1.5">
                          {order.status === 'PAID' && (
                            <Button
                              size="sm"
                              disabled={isUpdating === order._id}
                              onClick={() => handleUpdateStatus(order._id, 'PROCESSING')}
                              className="text-[11px] h-7 px-2.5 bg-indigo-600 hover:bg-indigo-700"
                            >
                              <span>Start Processing</span>
                            </Button>
                          )}

                          {order.status === 'PROCESSING' && (
                            <Button
                              size="sm"
                              disabled={isUpdating === order._id}
                              onClick={() => {
                                setShippingOrderId(order._id);
                                setTrackingNumber(`SF-EXP-${Math.floor(100000 + Math.random() * 900000)}`);
                              }}
                              className="text-[11px] h-7 px-2.5 bg-purple-600 hover:bg-purple-700"
                            >
                              <Truck className="h-3 w-3 mr-1" />
                              <span>Ship Package</span>
                            </Button>
                          )}

                          {order.status === 'SHIPPED' && (
                            <Button
                              size="sm"
                              disabled={isUpdating === order._id}
                              onClick={() => handleUpdateStatus(order._id, 'DELIVERED')}
                              className="text-[11px] h-7 px-2.5 bg-teal-600 hover:bg-teal-700"
                            >
                              <CheckCircle2 className="h-3 w-3 mr-1" />
                              <span>Mark Delivered</span>
                            </Button>
                          )}

                          {['PENDING_PAYMENT', 'PAID'].includes(order.status) && (
                            <Button
                              variant="outline"
                              size="sm"
                              disabled={isUpdating === order._id}
                              onClick={() => handleUpdateStatus(order._id, 'CANCELLED')}
                              className="text-[11px] h-7 px-2 border-slate-700 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 hover:border-rose-500/20"
                            >
                              Cancel
                            </Button>
                          )}

                          <Link
                            href={`/orders/${order._id}`}
                            target="_blank"
                            className="inline-flex items-center justify-center h-7 px-2 rounded-lg border border-slate-700 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors text-[11px]"
                            title="View Customer Snapshot"
                          >
                            <ExternalLink className="h-3 w-3" />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Ship Order Tracking Number Modal */}
      {shippingOrderId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-6 space-y-4 shadow-2xl">
            <div className="flex items-center gap-2 text-purple-400 font-bold">
              <Truck className="h-5 w-5" />
              <h3 className="text-base text-white">Dispatch &amp; Log Tracking Number</h3>
            </div>
            <p className="text-xs text-slate-400">
              Provide the courier tracking code (FedEx, UPS, DHL) to confirm shipment and notify customer telemetry.
            </p>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Tracking Code</label>
              <input
                type="text"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                placeholder="e.g. SF-EXP-948291"
                className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 font-mono text-xs text-white focus:border-purple-500 focus:outline-none"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShippingOrderId(null)}
                className="border-slate-700 text-slate-300 hover:bg-slate-800"
              >
                Cancel
              </Button>
              <Button
                size="sm"
                disabled={!trackingNumber.trim() || isUpdating !== null}
                onClick={() => handleUpdateStatus(shippingOrderId, 'SHIPPED', trackingNumber.trim())}
                className="bg-purple-600 hover:bg-purple-700 font-bold"
              >
                Confirm Shipment
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
