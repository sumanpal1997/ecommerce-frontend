'use client';

import React, { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { productApi } from '@/features/products/services/product.api';
import { ProductGrid } from '@/features/products/components/ProductGrid';
import { Sparkles, Layers, ShieldCheck, Zap } from 'lucide-react';

function StoreContent() {
  const searchParams = useSearchParams();
  const search = searchParams.get('search') || '';
  const category = searchParams.get('category') || '';
  const [selectedCategory, setSelectedCategory] = useState<string>(category);

  // Fetch Categories for navigation pills
  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: productApi.getCategories,
  });

  // Fetch Products based on search query or category filter
  const { data: productsData, isLoading } = useQuery({
    queryKey: ['products', { search, category: selectedCategory || undefined }],
    queryFn: () =>
      productApi.getProducts({
        search: search || undefined,
        category: selectedCategory || undefined,
        limit: 20,
      }),
  });

  const products = productsData?.items || [];

  return (
    <div className="space-y-10 pb-16">
      {/* Hero Banner */}
      <section className="relative overflow-hidden bg-slate-900 text-white py-16 sm:py-24">
        {/* Subtle background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-indigo-600/20 blur-[120px] rounded-full pointer-events-none" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3.5 py-1 text-xs font-medium text-indigo-300">
            <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
            <span>Built with Clean Architecture &amp; High-Concurrency Safety</span>
          </div>

          <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl max-w-3xl mx-auto leading-tight">
            High-Performance E-Commerce Engineered for Scale.
          </h1>

          <p className="mx-auto max-w-2xl text-base sm:text-lg text-slate-300 font-normal">
            Modular monolith designed for zero overselling, zero-trust server-side pricing, and instant &lt;1ms Trie search.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-6 pt-4 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              <span>Atomic Inventory Reservations</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-amber-400" />
              <span>In-Memory Trie Autocomplete</span>
            </div>
            <div className="flex items-center gap-2">
              <Layers className="h-4 w-4 text-indigo-400" />
              <span>Domain-Driven Modular Design</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Catalog View */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Header & Filter Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
              {search ? (
                <span>
                  Search results for &ldquo;<span className="text-indigo-600">{search}</span>&rdquo;
                </span>
              ) : selectedCategory ? (
                <span className="capitalize">{selectedCategory} Collection</span>
              ) : (
                'Featured Products'
              )}
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Showing {products.length} {products.length === 1 ? 'item' : 'items'}
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            <button
              type="button"
              onClick={() => setSelectedCategory('')}
              className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors whitespace-nowrap ${
                selectedCategory === ''
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.slug)}
                className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors whitespace-nowrap ${
                  selectedCategory === cat.slug
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        <ProductGrid
          products={products}
          isLoading={isLoading}
          emptyMessage={
            search
              ? `No products found matching "${search}". Try searching for another keyword or view all collections.`
              : 'No products are currently available in this category.'
          }
        />
      </section>
    </div>
  );
}

export default function StoreHomePage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
        </div>
      }
    >
      <StoreContent />
    </Suspense>
  );
}
