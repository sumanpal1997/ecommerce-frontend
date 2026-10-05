'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Star, ShoppingCart, Check } from 'lucide-react';
import { Product } from '../types/product.types';
import { useCart } from '@/features/cart/context/cart-context';
import { formatCurrency } from '@/lib/utils/cn';
import { Badge } from '@/components/ui/Badge';
import { Spinner } from '@/components/ui/Spinner';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const [isAdding, setIsAdding] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const [imgError, setImgError] = useState(false);

  const primaryImage =
    product.images?.find((img) => img.isPrimary)?.url ||
    product.images?.[0]?.url ||
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80';

  const displayImage = imgError ? 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80' : primaryImage;

  const hasDiscount = !!product.salePrice && product.salePrice < product.basePrice;
  const discountPercent = hasDiscount
    ? Math.round(((product.basePrice - (product.salePrice || 0)) / product.basePrice) * 100)
    : 0;

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isAdding) return;

    setIsAdding(true);
    try {
      await addToCart(product._id, product.sku, 1);
      setIsAdded(true);
      setTimeout(() => setIsAdded(false), 1800);
    } catch (err) {
      console.error('Failed to add product to cart:', err);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xs hover:shadow-md transition-all duration-200">
      {/* Product Image */}
      <Link
        href={`/products/${product.slug}`}
        className="relative aspect-square w-full overflow-hidden bg-slate-50"
      >
        <Image
          src={displayImage}
          alt={product.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          onError={() => setImgError(true)}
        />

        {/* Badges Overlay */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5">
          {hasDiscount && (
            <Badge variant="danger" className="font-bold">
              -{discountPercent}%
            </Badge>
          )}
        </div>
      </Link>

      {/* Product Details */}
      <div className="flex flex-1 flex-col p-4">
        {/* Brand & Category */}
        <div className="flex items-center justify-between gap-2 text-xs text-slate-500 mb-1">
          <span className="font-medium uppercase tracking-wider text-[11px] text-indigo-600">
            {product.brand || 'Catalog'}
          </span>
          {product.categoryId?.name && (
            <span className="truncate text-slate-400">
              {product.categoryId.name}
            </span>
          )}
        </div>

        {/* Title */}
        <Link
          href={`/products/${product.slug}`}
          className="text-sm font-semibold text-slate-900 line-clamp-2 hover:text-indigo-600 transition-colors mb-2"
          title={product.title}
        >
          {product.title}
        </Link>

        {/* Rating */}
        <div className="flex items-center gap-1.5 mb-3">
          <div className="flex items-center text-amber-400">
            <Star className="h-3.5 w-3.5 fill-current" />
          </div>
          <span className="text-xs font-semibold text-slate-700">
            {product.ratingAverage?.toFixed(1) || '5.0'}
          </span>
          <span className="text-[11px] text-slate-400">
            ({product.ratingCount || 0})
          </span>
        </div>

        {/* Price & CTA Row */}
        <div className="mt-auto flex items-center justify-between pt-2 border-t border-slate-100">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-base font-bold text-slate-900">
                {formatCurrency(product.salePrice ?? product.basePrice)}
              </span>
              {hasDiscount && (
                <span className="text-xs text-slate-400 line-through">
                  {formatCurrency(product.basePrice)}
                </span>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={handleAddToCart}
            disabled={isAdding || product.status !== 'ACTIVE'}
            className={`inline-flex items-center justify-center rounded-lg p-2 transition-all ${
              isAdded
                ? 'bg-emerald-600 text-white'
                : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-600 hover:text-white'
            } disabled:opacity-50 disabled:pointer-events-none`}
            title="Add to cart"
            aria-label={`Add ${product.title} to shopping cart`}
          >
            {isAdding ? (
              <Spinner size="sm" />
            ) : isAdded ? (
              <Check className="h-4 w-4" />
            ) : (
              <ShoppingCart className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
