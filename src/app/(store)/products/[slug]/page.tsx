'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import {
  Star,
  ShieldCheck,
  Truck,
  RotateCcw,
  Minus,
  Plus,
  ShoppingCart,
  Check,
  ArrowLeft,
  Package,
} from 'lucide-react';
import { productApi } from '@/features/products/services/product.api';
import { useCart } from '@/features/cart/context/cart-context';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { formatCurrency } from '@/lib/utils/cn';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const { addToCart } = useCart();

  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isAdding, setIsAdding] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const [imgError, setImgError] = useState(false);

  const { data: product, isLoading, error } = useQuery({
    queryKey: ['product', slug],
    queryFn: () => productApi.getProductBySlug(slug),
    enabled: !!slug,
  });

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 animate-pulse">
          <div className="aspect-square bg-slate-200 rounded-2xl" />
          <div className="space-y-6">
            <div className="h-4 w-28 bg-slate-200 rounded" />
            <div className="h-8 w-3/4 bg-slate-200 rounded" />
            <div className="h-6 w-32 bg-slate-200 rounded" />
            <div className="h-24 w-full bg-slate-200 rounded" />
            <div className="h-12 w-48 bg-slate-200 rounded-lg" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="mx-auto max-w-md py-20 px-4 text-center">
        <div className="rounded-full bg-slate-100 p-4 mx-auto w-16 h-16 flex items-center justify-center text-slate-400 mb-4">
          <Package className="h-8 w-8 stroke-[1.5]" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Product Not Found</h2>
        <p className="mt-2 text-sm text-slate-500">
          The product you are looking for does not exist or has been removed from our catalog.
        </p>
        <Link href="/" className="inline-block mt-6">
          <Button variant="outline">Back to Catalog</Button>
        </Link>
      </div>
    );
  }

  const images = product.images && product.images.length > 0
    ? product.images
    : [
        {
          url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80',
          alt: product.title,
        },
      ];

  const currentImage = images[selectedImageIndex]?.url || images[0].url;
  const displayImage = imgError
    ? 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80'
    : currentImage;

  const hasDiscount = !!product.salePrice && product.salePrice < product.basePrice;
  const discountPercent = hasDiscount
    ? Math.round(((product.basePrice - (product.salePrice || 0)) / product.basePrice) * 100)
    : 0;

  const handleAddToCart = async () => {
    if (isAdding) return;
    setIsAdding(true);
    try {
      await addToCart(product._id, product.sku, quantity);
      setIsAdded(true);
      setTimeout(() => setIsAdded(false), 2000);
    } catch (err) {
      console.error('Failed to add item to cart:', err);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs text-slate-500">
        <Link href="/" className="hover:text-indigo-600 transition-colors">
          Home
        </Link>
        <span>/</span>
        {product.categoryId?.name && (
          <>
            <Link
              href={`/?category=${product.categoryId.slug}`}
              className="hover:text-indigo-600 transition-colors"
            >
              {product.categoryId.name}
            </Link>
            <span>/</span>
          </>
        )}
        <span className="text-slate-800 font-medium truncate max-w-xs">
          {product.title}
        </span>
      </nav>

      {/* Main Product Showcase Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16">
        {/* Left: Image Gallery */}
        <div className="space-y-4">
          <div className="relative aspect-square w-full overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
            <Image
              src={displayImage}
              alt={product.title}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
              onError={() => setImgError(true)}
            />
            {hasDiscount && (
              <div className="absolute top-4 left-4">
                <Badge variant="danger" className="text-sm px-3 py-1 font-bold">
                  SAVE {discountPercent}%
                </Badge>
              </div>
            )}
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-1">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`relative h-20 w-20 shrink-0 overflow-hidden rounded-lg border-2 bg-slate-50 transition-all ${
                    idx === selectedImageIndex
                      ? 'border-indigo-600 ring-2 ring-indigo-600/20'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <Image
                    src={img.url}
                    alt={img.alt || product.title}
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Product Info & Actions */}
        <div className="flex flex-col space-y-6">
          <div className="space-y-2 border-b border-slate-100 pb-5">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                {product.brand}
              </span>
              <span className="text-xs text-slate-400">• SKU: {product.sku}</span>
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              {product.title}
            </h1>

            {/* Ratings */}
            <div className="flex items-center gap-2 pt-1">
              <div className="flex items-center text-amber-400">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < Math.floor(product.ratingAverage || 5)
                        ? 'fill-current'
                        : 'text-slate-200'
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs font-semibold text-slate-700">
                {product.ratingAverage?.toFixed(1) || '5.0'}
              </span>
              <span className="text-xs text-slate-400">
                ({product.ratingCount || 12} customer reviews)
              </span>
            </div>
          </div>

          {/* Pricing */}
          <div className="space-y-1">
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold text-slate-900">
                {formatCurrency(product.salePrice ?? product.basePrice)}
              </span>
              {hasDiscount && (
                <span className="text-lg text-slate-400 line-through">
                  {formatCurrency(product.basePrice)}
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500">
              Tax included where applicable. Free shipping on orders over $100.
            </p>
          </div>

          {/* Description */}
          <p className="text-sm text-slate-600 leading-relaxed">
            {product.description}
          </p>

          {/* Attributes List */}
          {product.attributes && Object.keys(product.attributes).length > 0 && (
            <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Product Specifications
              </h3>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {Object.entries(product.attributes).map(([key, value]) => (
                  <div key={key} className="flex justify-between py-1 border-b border-slate-200/50">
                    <span className="text-slate-500 capitalize">{key}:</span>
                    <span className="font-semibold text-slate-800">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quantity Selector & Add to Cart */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center gap-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-700">
                Quantity:
              </span>
              <div className="flex items-center border border-slate-300 rounded-lg bg-white">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={quantity <= 1}
                  className="p-2 text-slate-600 hover:bg-slate-50 disabled:opacity-40 transition-colors"
                  aria-label="Decrease quantity"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-10 text-center text-sm font-bold text-slate-800">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  className="p-2 text-slate-600 hover:bg-slate-50 transition-colors"
                  aria-label="Increase quantity"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                size="lg"
                className="flex-1 flex items-center justify-center gap-2"
                onClick={handleAddToCart}
                isLoading={isAdding}
                disabled={product.status !== 'ACTIVE'}
              >
                {isAdded ? (
                  <>
                    <Check className="h-5 w-5" />
                    Added to Cart!
                  </>
                ) : (
                  <>
                    <ShoppingCart className="h-5 w-5" />
                    Add to Cart • {formatCurrency((product.salePrice ?? product.basePrice) * quantity)}
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Value Props & Architectural Trust Highlights */}
          <div className="divide-y divide-slate-100 rounded-xl border border-slate-200 bg-white p-4 space-y-3 pt-3 text-xs text-slate-600">
            <div className="flex items-center gap-3">
              <Truck className="h-4 w-4 text-indigo-600 shrink-0" />
              <span>Fast express dispatch with real-time tracking</span>
            </div>
            <div className="flex items-center gap-3 pt-3">
              <RotateCcw className="h-4 w-4 text-indigo-600 shrink-0" />
              <span>30-day money-back guarantee with zero restocking fees</span>
            </div>
            <div className="flex items-center gap-3 pt-3">
              <ShieldCheck className="h-4 w-4 text-indigo-600 shrink-0" />
              <span>2-Year comprehensive manufacturer warranty &amp; authentic guarantee</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
