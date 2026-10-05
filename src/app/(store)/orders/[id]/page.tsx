'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { orderApi } from '@/features/orders/services/order.api';
import { OrderDetail } from '@/features/orders/components/OrderDetail';
import { AlertCircle, Package } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default function OrderPage() {
  const params = useParams();
  const orderId = params.id as string;

  const {
    data: order,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['order', orderId],
    queryFn: () => orderApi.getOrderById(orderId),
    enabled: !!orderId,
  });

  if (isLoading) {
    return (
      <div className="flex min-h-[500px] items-center justify-center">
        <div className="text-center space-y-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent mx-auto" />
          <p className="text-xs text-slate-500">Loading order receipt...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="mx-auto max-w-md py-20 px-4 text-center">
        <div className="rounded-full bg-slate-100 p-4 mx-auto w-16 h-16 flex items-center justify-center text-slate-400 mb-4">
          <AlertCircle className="h-8 w-8 stroke-[1.5]" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Order Not Found</h2>
        <p className="mt-2 text-sm text-slate-500">
          We couldn&apos;t locate the specified order. Please ensure you are logged in to the account that placed it.
        </p>
        <Link href="/" className="inline-block mt-6">
          <Button variant="outline">Return to Catalog</Button>
        </Link>
      </div>
    );
  }

  return <OrderDetail order={order} onRefresh={refetch} />;
}
