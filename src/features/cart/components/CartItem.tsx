'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { EnrichedCartItem } from '../types/cart.types';
import { formatCurrency } from '@/lib/utils/cn';

interface CartItemProps {
  item: EnrichedCartItem;
  onUpdateQuantity: (sku: string, quantity: number) => Promise<void>;
  onRemove: (sku: string) => Promise<void>;
}

export function CartItem({ item, onUpdateQuantity, onRemove }: CartItemProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const [imgError, setImgError] = useState(false);

  const handleDecrease = async () => {
    if (item.quantity <= 1) {
      handleRemove();
      return;
    }
    setIsUpdating(true);
    try {
      await onUpdateQuantity(item.sku, item.quantity - 1);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleIncrease = async () => {
    if (item.quantity >= item.availableStock) return;
    setIsUpdating(true);
    try {
      await onUpdateQuantity(item.sku, item.quantity + 1);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRemove = async () => {
    setIsRemoving(true);
    try {
      await onRemove(item.sku);
    } finally {
      setIsRemoving(false);
    }
  };

  const fallbackImage = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&auto=format&fit=crop&q=80';
  const displayImage = imgError || !item.image ? fallbackImage : item.image;

  return (
    <div
      className={`flex items-start gap-4 py-4 border-b border-slate-100 transition-opacity ${
        isRemoving || isUpdating ? 'opacity-60' : 'opacity-100'
      }`}
    >
      <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-slate-100 border border-slate-200">
        <Image
          src={displayImage}
          alt={item.title}
          fill
          sizes="80px"
          className="object-cover"
          onError={() => setImgError(true)}
        />
      </div>

      <div className="flex flex-1 flex-col justify-between self-stretch">
        <div className="space-y-1">
          <div className="flex justify-between items-start gap-2">
            <Link
              href={`/products/${item.slug}`}
              className="text-sm font-medium text-slate-800 line-clamp-1 hover:text-indigo-600 transition-colors"
            >
              {item.title}
            </Link>
            <button
              onClick={handleRemove}
              disabled={isRemoving}
              className="text-slate-400 hover:text-rose-600 transition-colors p-0.5 rounded"
              title="Remove item"
              aria-label="Remove item"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>

          <p className="text-xs text-slate-500">SKU: {item.sku}</p>

          {!item.isAvailable && (
            <p className="text-xs font-medium text-rose-600">
              Out of stock or unavailable
            </p>
          )}

          {item.isAvailable && item.availableStock < item.quantity && (
            <p className="text-xs font-medium text-amber-600">
              Only {item.availableStock} available in warehouse
            </p>
          )}
        </div>

        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center border border-slate-200 rounded-md bg-white">
            <button
              type="button"
              onClick={handleDecrease}
              disabled={isUpdating || isRemoving}
              className="p-1 text-slate-600 hover:bg-slate-50 disabled:opacity-40 transition-colors"
              aria-label="Decrease quantity"
            >
              <Minus className="h-3.5 w-3.5" />
            </button>
            <span className="w-8 text-center text-xs font-semibold text-slate-800">
              {item.quantity}
            </span>
            <button
              type="button"
              onClick={handleIncrease}
              disabled={isUpdating || isRemoving || item.quantity >= item.availableStock}
              className="p-1 text-slate-600 hover:bg-slate-50 disabled:opacity-40 transition-colors"
              aria-label="Increase quantity"
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="text-right">
            <p className="text-sm font-semibold text-slate-900">
              {formatCurrency(item.subtotal)}
            </p>
            {item.quantity > 1 && (
              <p className="text-[11px] text-slate-400">
                {formatCurrency(item.unitPrice)} each
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
