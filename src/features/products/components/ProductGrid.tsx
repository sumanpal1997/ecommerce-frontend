'use client';

import React from 'react';
import { PackageOpen } from 'lucide-react';
import { Product } from '../types/product.types';
import { ProductCard } from './ProductCard';

interface ProductGridProps {
  products: Product[];
  isLoading?: boolean;
  emptyMessage?: string;
}

export function ProductGrid({
  products,
  isLoading = false,
  emptyMessage = 'No products found matching your criteria.',
}: ProductGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, index) => (
          <div
            key={index}
            className="flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white animate-pulse"
          >
            <div className="aspect-square w-full bg-slate-200" />
            <div className="p-4 space-y-3">
              <div className="flex justify-between items-center">
                <div className="h-3 w-16 bg-slate-200 rounded" />
                <div className="h-3 w-20 bg-slate-200 rounded" />
              </div>
              <div className="h-4 w-3/4 bg-slate-200 rounded" />
              <div className="h-3 w-24 bg-slate-200 rounded" />
              <div className="flex justify-between items-center pt-2 border-t border-slate-100">
                <div className="h-5 w-16 bg-slate-200 rounded" />
                <div className="h-8 w-8 bg-slate-200 rounded-lg" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 py-16 px-4 text-center">
        <div className="rounded-full bg-slate-100 p-4 mb-4 text-slate-400">
          <PackageOpen className="h-10 w-10 stroke-[1.5]" />
        </div>
        <h3 className="text-base font-semibold text-slate-800 mb-1">
          Catalog is empty
        </h3>
        <p className="text-sm text-slate-500 max-w-sm">
          {emptyMessage}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
}
