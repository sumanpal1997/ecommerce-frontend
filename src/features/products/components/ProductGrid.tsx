'use client';

import React from 'react';
import { PackageOpen, RotateCcw } from 'lucide-react';
import { Product } from '../types/product.types';
import { ProductCard } from './ProductCard';
import { Button } from '@/components/ui/Button';

interface ProductGridProps {
  products: Product[];
  isLoading?: boolean;
  emptyMessage?: string;
  onResetFilters?: () => void;
}

export function ProductGrid({
  products,
  isLoading = false,
  emptyMessage = 'No products found matching your criteria.',
  onResetFilters,
}: ProductGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, index) => (
          <div
            key={index}
            className="flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 space-y-4 animate-pulse shadow-xs"
          >
            <div className="aspect-square w-full bg-slate-200 rounded-xl" />
            <div className="space-y-2.5">
              <div className="flex justify-between items-center">
                <div className="h-3 w-16 bg-slate-200 rounded" />
                <div className="h-3 w-20 bg-slate-200 rounded" />
              </div>
              <div className="h-4 w-3/4 bg-slate-200 rounded" />
              <div className="h-3 w-24 bg-slate-200 rounded" />
              <div className="flex justify-between items-center pt-3 border-t border-slate-100">
                <div className="h-6 w-20 bg-slate-200 rounded" />
                <div className="h-9 w-9 bg-slate-200 rounded-xl" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white py-16 px-6 text-center shadow-xs">
        <div className="rounded-full bg-indigo-50 p-4 mb-4 text-indigo-600">
          <PackageOpen className="h-10 w-10 stroke-[1.5]" />
        </div>
        <h3 className="text-lg font-bold text-slate-900 mb-1">
          No Products Found
        </h3>
        <p className="text-sm text-slate-500 max-w-md leading-relaxed">
          {emptyMessage}
        </p>
        {onResetFilters && (
          <Button
            variant="outline"
            size="sm"
            onClick={onResetFilters}
            className="mt-6 flex items-center gap-2"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Reset All Filters
          </Button>
        )}
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
