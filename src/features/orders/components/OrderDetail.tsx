'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  CheckCircle2,
  Clock,
  Package,
  Truck,
  CreditCard,
  ShieldCheck,
  ArrowLeft,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { Order, OrderStatus } from '../types/order.types';
import { orderApi } from '../services/order.api';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { formatCurrency } from '@/lib/utils/cn';

interface OrderDetailProps {
  order: Order;
  onRefresh?: () => void;
}

export function OrderDetail({ order: initialOrder, onRefresh }: OrderDetailProps) {
  const [order, setOrder] = useState<Order>(initialOrder);
  const [isSimulatingPayment, setIsSimulatingPayment] = useState(false);
  const [paymentNotice, setPaymentNotice] = useState<string | null>(null);

  const handleSimulatePayment = async () => {
    setIsSimulatingPayment(true);
    setPaymentNotice(null);
    try {
      await orderApi.simulatePaymentSuccess(order._id, `txn_mock_${Date.now()}`);
      // Fetch latest order state
      const updated = await orderApi.getOrderById(order._id);
      setOrder(updated);
      setPaymentNotice('Payment successfully verified! Your order is confirmed and scheduled for warehouse dispatch.');
      if (onRefresh) onRefresh();
    } catch (err: unknown) {
      console.error('Payment simulation failed:', err);
      setPaymentNotice('Payment processing could not be completed. Please try again or use another payment method.');
    } finally {
      setIsSimulatingPayment(false);
    }
  };

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'PENDING_PAYMENT':
        return <Badge variant="warning">Pending Payment</Badge>;
      case 'PAID':
        return <Badge variant="success">Paid & Confirmed</Badge>;
      case 'PROCESSING':
        return <Badge variant="default">Processing</Badge>;
      case 'SHIPPED':
        return <Badge variant="default">Shipped</Badge>;
      case 'DELIVERED':
        return <Badge variant="success">Delivered</Badge>;
      case 'CANCELLED':
        return <Badge variant="danger">Cancelled</Badge>;
      case 'REFUNDED':
        return <Badge variant="outline">Refunded</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const isPendingPayment = order.status === 'PENDING_PAYMENT';

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8 space-y-8">
      {/* Top Breadcrumb */}
      <div>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-indigo-600 transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Storefront
        </Link>
      </div>

      {/* Confirmation Header Banner */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Order Reference
              </span>
              {getStatusBadge(order.status)}
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              {order.orderNumber}
            </h1>
            <p className="text-xs text-slate-500">
              Placed on {new Date(order.createdAt).toLocaleString('en-US', {
                dateStyle: 'medium',
                timeStyle: 'short',
              })}
            </p>
          </div>

          {/* Simulate Payment Gateway CTA */}
          {isPendingPayment && (
            <div className="w-full sm:w-auto">
              <Button
                onClick={handleSimulatePayment}
                isLoading={isSimulatingPayment}
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 focus-visible:ring-emerald-500 font-bold"
              >
                <CreditCard className="h-4 w-4" />
                Complete Secure Payment ({formatCurrency(order.pricing.totalAmount)})
              </Button>
            </div>
          )}
        </div>

        {paymentNotice && (
          <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-xs font-medium text-emerald-800 flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
            <span>{paymentNotice}</span>
          </div>
        )}
      </div>

      {/* Order Fulfillment Tracking Timeline */}
      <div className="rounded-xl border border-indigo-100 bg-indigo-50/50 p-5 text-xs text-indigo-950 space-y-2">
        <div className="flex items-center gap-2 font-semibold text-indigo-900">
          <Truck className="h-4 w-4 text-indigo-600" />
          <span>Order Fulfillment &amp; Dispatch Timeline</span>
        </div>
        <p className="leading-relaxed text-indigo-900/80 mb-2">
          Your order progresses through scheduled fulfillment stages:
        </p>
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          {['Order Received', 'Payment Confirmed', 'Preparing Package', 'Dispatched', 'Delivered'].map((step, idx) => (
            <span
              key={step}
              className="inline-flex items-center gap-1 text-[11px] font-medium bg-white px-2.5 py-1 rounded-full border border-indigo-200 text-indigo-800 shadow-xs"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-indigo-500"></span>
              {step}
              {idx < 4 && <span className="text-slate-300 ml-1">→</span>}
            </span>
          ))}
        </div>
        <p className="text-[11px] text-indigo-900/70 pt-1">
          Tracking milestones and carrier updates are automatically updated in real-time.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Shipping Address */}
        <Card className="md:col-span-2">
          <CardHeader className="border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Truck className="h-4 w-4 text-indigo-600" />
              <h2 className="text-sm font-semibold text-slate-900">
                Delivery Details
              </h2>
            </div>
          </CardHeader>
          <CardContent className="pt-4 space-y-1.5 text-xs text-slate-700">
            <p className="font-semibold text-slate-900">
              {order.shippingAddress.fullName}
            </p>
            <p>{order.shippingAddress.street}</p>
            <p>
              {order.shippingAddress.city}, {order.shippingAddress.state}{' '}
              {order.shippingAddress.postalCode}
            </p>
            <p>{order.shippingAddress.country}</p>
            <p className="text-slate-500 pt-1">Phone: {order.shippingAddress.phone}</p>
          </CardContent>
        </Card>

        {/* Pricing Summary */}
        <Card>
          <CardHeader className="border-b border-slate-100 pb-3">
            <h2 className="text-sm font-semibold text-slate-900">
              Payment Summary
            </h2>
          </CardHeader>
          <CardContent className="pt-4 space-y-2.5 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>Items Subtotal</span>
              <span className="font-medium text-slate-900">
                {formatCurrency(order.pricing.itemsSubtotal)}
              </span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Shipping Fee</span>
              <span className="font-medium text-slate-900">
                {order.pricing.shippingFee === 0 ? (
                  <span className="text-emerald-600 font-semibold">Free</span>
                ) : (
                  formatCurrency(order.pricing.shippingFee)
                )}
              </span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Estimated Tax</span>
              <span className="font-medium text-slate-900">
                {formatCurrency(order.pricing.taxAmount)}
              </span>
            </div>
            <div className="flex justify-between border-t border-slate-200 pt-2.5 text-sm font-bold text-slate-900">
              <span>Total Paid</span>
              <span className="text-indigo-600">
                {formatCurrency(order.pricing.totalAmount)}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Line Items Snapshot */}
      <Card>
        <CardHeader className="border-b border-slate-100 pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Package className="h-4 w-4 text-indigo-600" />
              <h2 className="text-sm font-semibold text-slate-900">
                Items in this Order ({order.items.length})
              </h2>
            </div>
            <span className="text-[11px] text-slate-400 font-medium">
              Guaranteed Price Match at Purchase
            </span>
          </div>
        </CardHeader>
        <CardContent className="pt-2 divide-y divide-slate-100">
          {order.items.map((item, index) => (
            <div key={`${item.sku}-${index}`} className="flex items-center gap-4 py-3.5">
              <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-slate-100 border border-slate-200">
                <Image
                  src={
                    item.image ||
                    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100&auto=format&fit=crop&q=80'
                  }
                  alt={item.title}
                  fill
                  sizes="64px"
                  className="object-cover"
                />
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-slate-900 truncate">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-500">
                  SKU: {item.sku} • Qty: {item.quantity} × {formatCurrency(item.unitPrice)}
                </p>
              </div>

              <div className="text-right">
                <span className="text-sm font-bold text-slate-900">
                  {formatCurrency(item.subtotal)}
                </span>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
