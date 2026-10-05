'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Package,
  Truck,
  ArrowRight,
  CreditCard,
  CheckCircle2,
  Clock,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';
import { Order, OrderStatus } from '../types/order.types';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { formatCurrency } from '@/lib/utils/cn';

interface OrderCardProps {
  order: Order;
}

export function OrderCard({ order }: OrderCardProps) {
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

  const formattedDate = new Date(order.createdAt).toLocaleString('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });

  const isPending = order.status === 'PENDING_PAYMENT';
  const itemCount = order.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs hover:shadow-md transition-shadow">
      {/* Top Order Metadata Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 bg-slate-50/60 px-5 py-4 text-xs">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
          <div>
            <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Order Reference
            </span>
            <span className="font-bold text-slate-900 font-mono text-sm">
              {order.orderNumber}
            </span>
          </div>

          <div>
            <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Date Placed
            </span>
            <span className="font-medium text-slate-700">{formattedDate}</span>
          </div>

          <div>
            <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Total Amount
            </span>
            <span className="font-bold text-indigo-600 text-sm">
              {formatCurrency(order.pricing.totalAmount)}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {getStatusBadge(order.status)}
          <Link
            href={`/orders/${order._id}`}
            className="inline-flex items-center gap-1 font-bold text-indigo-600 hover:text-indigo-800 transition-colors"
          >
            <span>Receipt</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>

      {/* Main Order Content */}
      <div className="p-5 sm:p-6 space-y-4">
        {/* Line Items List */}
        <div className="divide-y divide-slate-100">
          {order.items.map((item, idx) => (
            <div
              key={`${item.sku}-${idx}`}
              className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
                  <Image
                    src={
                      item.image ||
                      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100&auto=format&fit=crop&q=80'
                    }
                    alt={item.title}
                    fill
                    sizes="56px"
                    className="object-cover"
                  />
                </div>

                <div className="min-w-0">
                  <h4 className="text-xs sm:text-sm font-semibold text-slate-900 truncate">
                    {item.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Qty: {item.quantity} × {formatCurrency(item.unitPrice)}
                    <span className="ml-2 font-mono text-[10px] text-slate-400">
                      SKU: {item.sku}
                    </span>
                  </p>
                </div>
              </div>

              <div className="text-right shrink-0">
                <span className="text-xs sm:text-sm font-bold text-slate-900">
                  {formatCurrency(item.subtotal)}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Footer Destination & Actions */}
        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-600">
            <Truck className="h-4 w-4 text-slate-400 shrink-0" />
            <span className="truncate">
              Shipping to <strong>{order.shippingAddress.fullName}</strong> •{' '}
              {order.shippingAddress.city}, {order.shippingAddress.country}
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {isPending && (
              <Link href={`/orders/${order._id}`}>
                <Button size="sm" className="flex items-center gap-1.5 text-xs bg-emerald-600 hover:bg-emerald-700">
                  <CreditCard className="h-3.5 w-3.5" />
                  <span>Simulate Payment</span>
                </Button>
              </Link>
            )}

            <Link href={`/orders/${order._id}`}>
              <Button variant="outline" size="sm" className="text-xs flex items-center gap-1">
                <span>View Details &amp; Lifecycle</span>
                <ArrowRight className="h-3 w-3" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
