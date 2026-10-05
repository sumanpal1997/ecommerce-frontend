'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import {
  Sparkles,
  ShieldCheck,
  Zap,
  Truck,
  RotateCcw,
  Star,
  ArrowRight,
  SlidersHorizontal,
  X,
  CheckCircle2,
  Mail,
  Layers,
  Cpu,
  Lock,
} from 'lucide-react';
import { productApi } from '@/features/products/services/product.api';
import { ProductGrid } from '@/features/products/components/ProductGrid';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

function StoreContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // URL Query Parameters as Single Source of Truth
  const search = searchParams.get('search') || '';
  const category = searchParams.get('category') || '';
  const brand = searchParams.get('brand') || '';
  const sortBy = searchParams.get('sortBy') || 'newest';

  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSuccess, setNewsletterSuccess] = useState(false);

  // Fetch Categories
  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: productApi.getCategories,
  });

  // Fetch Products with reactive parameters
  const { data: productsData, isLoading } = useQuery({
    queryKey: ['products', { search, category: category || undefined, brand: brand || undefined, sortBy }],
    queryFn: () =>
      productApi.getProducts({
        search: search || undefined,
        category: category || undefined,
        brand: brand || undefined,
        sortBy: sortBy as 'price_asc' | 'price_desc' | 'newest' | 'rating',
        limit: 24,
      }),
  });

  const products = productsData?.items || [];

  // Update URL parameters
  const updateQuery = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === '' || value === 'all') {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });
    router.push(params.toString() ? `/?${params.toString()}` : '/');
  };

  const handleClearFilters = () => {
    router.push('/');
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    setNewsletterSuccess(true);
    setNewsletterEmail('');
    setTimeout(() => setNewsletterSuccess(false), 5000);
  };

  const brands = ['Apple', 'Sony', 'Nike', 'Dell', 'Breville', 'Herman Miller', 'Bose', 'Patagonia'];

  const categoryCards = [
    {
      title: 'Consumer Electronics',
      subtitle: 'Audio, Laptops & Wearables',
      description: 'Flagship M3 Max workstations, noise-canceling headphones & titanium smartwatches.',
      slug: 'electronics',
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
      itemCount: '6 Products',
      highlight: 'Save up to $200',
    },
    {
      title: 'Technical Apparel',
      subtitle: 'Performance & Outerwear',
      description: 'Engineered Nike Tech Fleece, Air Max sneakers, Patagonia Nano Puff & Lululemon tights.',
      slug: 'apparel',
      image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&auto=format&fit=crop&q=80',
      itemCount: '4 Products',
      highlight: 'Premium Fabric',
    },
    {
      title: 'Home & Workspace',
      subtitle: 'Kitchen & Ergonomics',
      description: 'Commercial-grade Breville Touch espresso machines & Herman Miller Aeron task chairs.',
      slug: 'home',
      image: 'https://images.unsplash.com/photo-1580481077195-c3c2f1f00889?w=800&auto=format&fit=crop&q=80',
      itemCount: '2 Products',
      highlight: 'Ergonomic Choice',
    },
  ];

  return (
    <div className="space-y-16 pb-20">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-slate-900 text-white">
        {/* Subtle decorative glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-indigo-600/25 blur-[140px] rounded-full pointer-events-none" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-28">
          <div className="text-center space-y-6 max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-xs font-semibold text-indigo-300">
              <Sparkles className="h-4 w-4 text-indigo-400" />
              <span>Modular Monolith • High-Concurrency Architecture</span>
            </div>

            <h1 className="text-4xl font-black tracking-tight sm:text-6xl lg:text-7xl leading-tight">
              Next-Gen Commerce. <br />
              <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-indigo-200 bg-clip-text text-transparent">
                Engineered for Scale.
              </span>
            </h1>

            <p className="mx-auto max-w-2xl text-base sm:text-lg text-slate-300 font-normal leading-relaxed">
              Explore curated flagship electronics, technical outerwear, and modern ergonomic workspaces. Built with zero overselling, zero-trust server-side pricing, and instant &lt;1ms Trie search.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <button
                type="button"
                onClick={() => {
                  const el = document.getElementById('catalog-section');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="rounded-xl bg-indigo-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-indigo-600/30 hover:bg-indigo-500 transition-all cursor-pointer"
              >
                Shop All Collections
              </button>
              <button
                type="button"
                onClick={() => updateQuery({ category: 'electronics' })}
                className="rounded-xl border border-slate-700 bg-slate-800/80 px-6 py-3.5 text-sm font-semibold text-white hover:bg-slate-700 transition-all cursor-pointer"
              >
                Browse Electronics Deals
              </button>
            </div>

            {/* 4 Feature Trust Badges */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-10 border-t border-slate-800 text-xs text-slate-300 text-left">
              <div className="flex items-center gap-3 bg-slate-800/40 rounded-xl p-3 border border-slate-800">
                <Truck className="h-5 w-5 text-indigo-400 shrink-0" />
                <div>
                  <p className="font-bold text-white">Free Express Shipping</p>
                  <p className="text-[11px] text-slate-400">On all orders over $100</p>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-slate-800/40 rounded-xl p-3 border border-slate-800">
                <ShieldCheck className="h-5 w-5 text-emerald-400 shrink-0" />
                <div>
                  <p className="font-bold text-white">Atomic Stock Guard</p>
                  <p className="text-[11px] text-slate-400">Zero overselling protection</p>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-slate-800/40 rounded-xl p-3 border border-slate-800">
                <Zap className="h-5 w-5 text-amber-400 shrink-0" />
                <div>
                  <p className="font-bold text-white">Instant &lt;1ms Search</p>
                  <p className="text-[11px] text-slate-400">In-memory Radix Trie</p>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-slate-800/40 rounded-xl p-3 border border-slate-800">
                <RotateCcw className="h-5 w-5 text-purple-400 shrink-0" />
                <div>
                  <p className="font-bold text-white">30-Day Guarantee</p>
                  <p className="text-[11px] text-slate-400">Hassle-free verified returns</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. CURATED CATEGORY TILES (Visual Collection Cards) */}
      {!search && (
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                Curated Departments
              </p>
              <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl mt-1">
                Explore by Category
              </h2>
            </div>
            <span className="text-xs text-slate-500 hidden sm:inline">
              12 Premium Products across 11 Taxonomy Nodes
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {categoryCards.map((card) => {
              const isSelected = category === card.slug;
              return (
                <div
                  key={card.slug}
                  onClick={() => updateQuery({ category: card.slug })}
                  className={`group relative overflow-hidden rounded-2xl border transition-all duration-300 cursor-pointer shadow-xs hover:shadow-xl ${
                    isSelected
                      ? 'border-indigo-600 ring-2 ring-indigo-600/30'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {/* Background Image */}
                  <div className="relative h-64 w-full overflow-hidden bg-slate-100">
                    <Image
                      src={card.image}
                      alt={card.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent" />
                  </div>

                  {/* Card Content Overlay */}
                  <div className="absolute inset-0 p-6 flex flex-col justify-between text-white">
                    <div className="flex justify-between items-start">
                      <span className="rounded-full bg-white/20 backdrop-blur-md px-3 py-1 text-[11px] font-semibold tracking-wide">
                        {card.itemCount}
                      </span>
                      <span className="rounded-full bg-indigo-600/90 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                        {card.highlight}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <p className="text-xs font-medium text-indigo-300 uppercase tracking-wider">
                        {card.subtitle}
                      </p>
                      <h3 className="text-xl font-bold text-white group-hover:text-indigo-200 transition-colors">
                        {card.title}
                      </h3>
                      <p className="text-xs text-slate-300 line-clamp-2 pt-1 font-normal">
                        {card.description}
                      </p>
                      <div className="pt-3 flex items-center gap-1.5 text-xs font-bold text-indigo-300 group-hover:translate-x-1 transition-transform">
                        <span>{isSelected ? 'Currently Viewing' : 'View Collection'}</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* 3. MAIN CATALOG SECTION WITH FILTERS & SORTING */}
      <section id="catalog-section" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Title & Filter Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              {search ? (
                <span>
                  Search results for &ldquo;<span className="text-indigo-600">{search}</span>&rdquo;
                </span>
              ) : category ? (
                <span className="capitalize">{category} Collection</span>
              ) : (
                'All Featured Products'
              )}
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Showing {products.length} {products.length === 1 ? 'item' : 'items'} • Verified live warehouse stock
            </p>
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-slate-500 whitespace-nowrap">
              Sort by:
            </span>
            <select
              value={sortBy}
              onChange={(e) => updateQuery({ sortBy: e.target.value })}
              className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-2xs focus:border-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-600"
            >
              <option value="newest">Newest Arrivals</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="rating">Highest Customer Rating</option>
            </select>
          </div>
        </div>

        {/* Category Filter Pills Bar */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <button
              type="button"
              onClick={() => updateQuery({ category: null })}
              className={`rounded-full px-4 py-2 text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                !category
                  ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-200'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              All Collections ({productsData?.meta ? (productsData.meta as any).totalItems || 12 : 12})
            </button>

            {categories.map((cat) => {
              const isSelected = category === cat.slug;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => updateQuery({ category: cat.slug })}
                  className={`rounded-full px-4 py-2 text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                    isSelected
                      ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-200'
                      : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {cat.name}
                </button>
              );
            })}
          </div>

          {/* Quick Brand Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
            <span className="font-semibold text-slate-400 whitespace-nowrap pl-1">
              Brands:
            </span>
            {brands.map((b) => {
              const isBrandSelected = brand === b;
              return (
                <button
                  key={b}
                  type="button"
                  onClick={() => updateQuery({ brand: isBrandSelected ? null : b })}
                  className={`rounded-lg px-2.5 py-1 transition-colors whitespace-nowrap cursor-pointer ${
                    isBrandSelected
                      ? 'bg-slate-900 text-white font-bold'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {b}
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Filters Summary Pill Bar (Shows if any filter is active) */}
        {(category || brand || search) && (
          <div className="flex flex-wrap items-center gap-2 pt-2 pb-1">
            <span className="text-xs text-slate-500 font-medium">Active filters:</span>
            {category && (
              <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700 border border-indigo-100">
                Category: <span className="capitalize">{category}</span>
                <button
                  type="button"
                  onClick={() => updateQuery({ category: null })}
                  className="hover:text-indigo-900 ml-0.5"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </span>
            )}
            {brand && (
              <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-800 border border-slate-200">
                Brand: {brand}
                <button
                  type="button"
                  onClick={() => updateQuery({ brand: null })}
                  className="hover:text-slate-900 ml-0.5"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </span>
            )}
            {search && (
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-800 border border-amber-200">
                Search: &ldquo;{search}&rdquo;
                <button
                  type="button"
                  onClick={() => updateQuery({ search: null })}
                  className="hover:text-amber-900 ml-0.5"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </span>
            )}
            <button
              type="button"
              onClick={handleClearFilters}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-500 underline ml-2 cursor-pointer"
            >
              Clear all filters
            </button>
          </div>
        )}

        {/* Product Grid Component */}
        <ProductGrid
          products={products}
          isLoading={isLoading}
          emptyMessage={
            search
              ? `No products found matching "${search}". Try searching for another brand or clearing filters.`
              : `No products are currently available matching the active filter criteria.`
          }
        />
      </section>

      {/* 4. SYSTEM DESIGN ARCHITECTURE SHOWCASE */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white p-8 sm:p-12 lg:p-16">
          <div className="max-w-2xl space-y-4 mb-10">
            <div className="inline-flex items-center gap-2 rounded-full bg-indigo-500/20 px-3 py-1 text-xs font-semibold text-indigo-300 border border-indigo-500/30">
              <Cpu className="h-3.5 w-3.5 text-indigo-400" />
              <span>Production Systems Architecture</span>
            </div>
            <h2 className="text-2xl font-black tracking-tight sm:text-4xl text-white">
              Engineered as a Modular Monolith.
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed font-normal">
              Every architectural decision balances maintainability today with effortless microservices extraction tomorrow.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-3 bg-white/5 rounded-2xl p-6 border border-white/10 backdrop-blur-xs">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white font-bold">
                <Zap className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-white">In-Memory Trie Autocomplete</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Rather than executing expensive wildcard database scans on every keystroke, our in-memory Radix Trie delivers instant prefix typeahead suggestions in &lt;1ms.
              </p>
            </div>

            <div className="space-y-3 bg-white/5 rounded-2xl p-6 border border-white/10 backdrop-blur-xs">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white font-bold">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-white">Atomic Concurrency Defense</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Storage-engine level atomic updates prevent race conditions and eliminate overselling during high-traffic flash sales with automated compensating rollbacks.
              </p>
            </div>

            <div className="space-y-3 bg-white/5 rounded-2xl p-6 border border-white/10 backdrop-blur-xs">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-600 text-white font-bold">
                <Lock className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-white">Zero-Trust Server Pricing</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Cart subtotals and discounts are never trusted from the client browser. All line-item prices are validated server-side against live catalog models at checkout.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. VERIFIED CUSTOMER TESTIMONIALS */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2 max-w-xl mx-auto">
          <p className="text-xs font-bold uppercase tracking-wider text-indigo-600">
            Real Customer Reviews
          </p>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Trusted by Builders &amp; Creators
          </h2>
          <p className="text-xs text-slate-500">
            Over 2,400+ verified orders delivered with a 99.8% customer satisfaction rating.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
            <div className="flex text-amber-400">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-current" />
              ))}
            </div>
            <p className="text-xs text-slate-600 leading-relaxed italic">
              &ldquo;The MacBook Pro M3 Max arrived in pristine condition within 24 hours. The slide-out cart and instant checkout was the smoothest purchasing flow I have experienced.&rdquo;
            </p>
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-900">Sarah Jenkins</p>
                <p className="text-[11px] text-slate-400">Senior Staff Engineer</p>
              </div>
              <Badge variant="success" className="text-[10px]">Verified Buyer</Badge>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
            <div className="flex text-amber-400">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-current" />
              ))}
            </div>
            <p className="text-xs text-slate-600 leading-relaxed italic">
              &ldquo;Picked up both the Herman Miller Aeron and the Breville Barista Touch. Build quality and packaging were flawless. Free shipping over $100 saved me substantial freight fees.&rdquo;
            </p>
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-900">David Martinez</p>
                <p className="text-[11px] text-slate-400">Workspace Architect</p>
              </div>
              <Badge variant="success" className="text-[10px]">Verified Buyer</Badge>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
            <div className="flex text-amber-400">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-current" />
              ))}
            </div>
            <p className="text-xs text-slate-600 leading-relaxed italic">
              &ldquo;The real-time inventory counter is a game changer. During competitive drops, having atomic 15-minute stock reservations guarantees you actually get what you pay for.&rdquo;
            </p>
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-900">Elena Rostova</p>
                <p className="text-[11px] text-slate-400">Tech Lead &amp; Creator</p>
              </div>
              <Badge variant="success" className="text-[10px]">Verified Buyer</Badge>
            </div>
          </div>
        </div>
      </section>

      {/* 6. VIP NEWSLETTER CLUB */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl bg-indigo-50 border border-indigo-100 p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-2 max-w-md">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-700">
              <Mail className="h-4 w-4" />
              <span>SHOPFLOW VIP CLUB</span>
            </div>
            <h3 className="text-2xl font-bold text-slate-900">
              Unlock 15% Off Your Next Order
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Subscribe to receive private sale invites, new arrival notifications, and early access to hardware drops.
            </p>
          </div>

          <form onSubmit={handleNewsletterSubmit} className="w-full md:w-auto flex-1 max-w-md space-y-2">
            <div className="flex gap-2">
              <input
                type="email"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder="Enter your email address"
                required
                className="flex-1 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-600 shadow-2xs"
              />
              <Button type="submit" size="md" className="shrink-0">
                Join VIP Club
              </Button>
            </div>
            {newsletterSuccess && (
              <p className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 animate-fadeIn">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                Thank you! Check your inbox for your 15% discount voucher.
              </p>
            )}
          </form>
        </div>
      </section>
    </div>
  );
}

export default function StoreHomePage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[500px] items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
        </div>
      }
    >
      <StoreContent />
    </Suspense>
  );
}
