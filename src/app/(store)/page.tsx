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
  X,
  CheckCircle2,
  Mail,
  Cpu,
  Lock,
  Search,
  Filter,
  Check,
} from 'lucide-react';
import { productApi } from '@/features/products/services/product.api';
import { ProductGrid } from '@/features/products/components/ProductGrid';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

interface CategoryMeta {
  title: string;
  department: string;
  tagline: string;
  description: string;
  subcategories: { name: string; slug: string }[];
  brands: string[];
}

const categoryMetaMap: Record<string, CategoryMeta> = {
  home: {
    title: 'Home & Living Collection',
    department: 'Home & Workspace',
    tagline: 'Precision culinary gear, ergonomic seating & modern living essentials',
    description:
      'Transform your daily environment with commercial-grade espresso machines and health-certified ergonomic task chairs engineered for peak daily focus.',
    subcategories: [
      { name: 'All Home & Living', slug: 'home' },
      { name: 'Kitchen Appliances', slug: 'kitchen' },
      { name: 'Office & Furniture', slug: 'office' },
    ],
    brands: ['Breville', 'Herman Miller'],
  },
  kitchen: {
    title: 'Kitchen Appliances',
    department: 'Home & Living',
    tagline: 'Commercial performance in a compact footprint',
    description:
      'Precision automated touchscreen espresso machines, ThermoJet rapid heating, and artisan culinary instruments.',
    subcategories: [
      { name: 'All Home & Living', slug: 'home' },
      { name: 'Kitchen Appliances', slug: 'kitchen' },
      { name: 'Office & Furniture', slug: 'office' },
    ],
    brands: ['Breville'],
  },
  office: {
    title: 'Office & Workspace',
    department: 'Home & Living',
    tagline: 'Ergonomic task chairs & workspace ergonomics',
    description:
      'Pioneering PostureFit SL sacral support, harmonic tilt, and breathable 8Z Pellicle elastomeric suspension for full-day posture.',
    subcategories: [
      { name: 'All Home & Living', slug: 'home' },
      { name: 'Kitchen Appliances', slug: 'kitchen' },
      { name: 'Office & Furniture', slug: 'office' },
    ],
    brands: ['Herman Miller'],
  },
  electronics: {
    title: 'Consumer Electronics & Computing',
    department: 'Consumer Electronics',
    tagline: 'Flagship M3 Max workstations, spatial audio & smart fitness wearables',
    description:
      'Explore the apex of personal technology—from Apple silicon M3 Max workstations and Dell XPS powerhouses to Sony active noise-cancellation audio.',
    subcategories: [
      { name: 'All Electronics', slug: 'electronics' },
      { name: 'Audio & Headphones', slug: 'audio' },
      { name: 'Computers & Laptops', slug: 'computers' },
      { name: 'Wearables & Smartwatches', slug: 'wearables' },
    ],
    brands: ['Apple', 'Sony', 'Dell', 'Bose'],
  },
  audio: {
    title: 'Audio & Headphones',
    department: 'Consumer Electronics',
    tagline: 'Industry-leading noise cancellation and 360° acoustic fidelity',
    description:
      'Immerse yourself with Dual Noise Sensor technology, LDAC high-res streaming, and omnidirectional acoustic architecture.',
    subcategories: [
      { name: 'All Electronics', slug: 'electronics' },
      { name: 'Audio & Headphones', slug: 'audio' },
      { name: 'Computers & Laptops', slug: 'computers' },
      { name: 'Wearables & Smartwatches', slug: 'wearables' },
    ],
    brands: ['Sony', 'Bose'],
  },
  computers: {
    title: 'Computers & Workstations',
    department: 'Consumer Electronics',
    tagline: 'Pro workstations engineered for demanding creative & engineering workflows',
    description:
      'Apple silicon M3 Max hardware-accelerated ray tracing and Dell 3.5K OLED InfinityEdge mobile studios.',
    subcategories: [
      { name: 'All Electronics', slug: 'electronics' },
      { name: 'Audio & Headphones', slug: 'audio' },
      { name: 'Computers & Laptops', slug: 'computers' },
      { name: 'Wearables & Smartwatches', slug: 'wearables' },
    ],
    brands: ['Apple', 'Dell'],
  },
  wearables: {
    title: 'Wearables & Smartwatches',
    department: 'Consumer Electronics',
    tagline: 'Aerospace-grade titanium, precision dual-frequency GPS & health tracking',
    description:
      'Military-standard rugged smartwatches with cellular connectivity and multi-day expedition battery life.',
    subcategories: [
      { name: 'All Electronics', slug: 'electronics' },
      { name: 'Audio & Headphones', slug: 'audio' },
      { name: 'Computers & Laptops', slug: 'computers' },
      { name: 'Wearables & Smartwatches', slug: 'wearables' },
    ],
    brands: ['Apple'],
  },
  apparel: {
    title: 'Technical Apparel & Outerwear',
    department: 'Performance & Outerwear',
    tagline: 'Engineered thermal insulation, technical fleece & responsive footwear',
    description:
      'Garments crafted with zoned thermoregulation, 100% recycled insulation, and max-cushion lifestyle silhouettes.',
    subcategories: [
      { name: 'All Apparel', slug: 'apparel' },
      { name: 'Footwear & Sneakers', slug: 'footwear' },
      { name: "Men's Technical Outerwear", slug: 'mens-wear' },
      { name: "Women's Activewear", slug: 'womens-wear' },
    ],
    brands: ['Nike', 'Patagonia', 'Lululemon'],
  },
  footwear: {
    title: 'Footwear & Sneakers',
    department: 'Technical Apparel',
    tagline: 'High-volume Air units, dual-density foam & street-ready silhouettes',
    description:
      'Engineered mesh breathability and resilient rubber traction outsoles for daily commute and training.',
    subcategories: [
      { name: 'All Apparel', slug: 'apparel' },
      { name: 'Footwear & Sneakers', slug: 'footwear' },
      { name: "Men's Technical Outerwear", slug: 'mens-wear' },
      { name: "Women's Activewear", slug: 'womens-wear' },
    ],
    brands: ['Nike'],
  },
  'mens-wear': {
    title: "Men's Technical Outerwear",
    department: 'Technical Apparel',
    tagline: 'Lightweight warmth, clean tailored lines & weather-resistant shells',
    description:
      'Double-sided smooth fleece and ultra-lightweight water-resistant ripstop insulation.',
    subcategories: [
      { name: 'All Apparel', slug: 'apparel' },
      { name: 'Footwear & Sneakers', slug: 'footwear' },
      { name: "Men's Technical Outerwear", slug: 'mens-wear' },
      { name: "Women's Activewear", slug: 'womens-wear' },
    ],
    brands: ['Nike', 'Patagonia'],
  },
  'womens-wear': {
    title: "Women's Activewear",
    department: 'Technical Apparel',
    tagline: 'Weightless Nulu fabric and buttery-soft four-way stretch',
    description:
      'Engineered for unrestricted yoga and training mobility with sweat-wicking breathability.',
    subcategories: [
      { name: 'All Apparel', slug: 'apparel' },
      { name: 'Footwear & Sneakers', slug: 'footwear' },
      { name: "Men's Technical Outerwear", slug: 'mens-wear' },
      { name: "Women's Activewear", slug: 'womens-wear' },
    ],
    brands: ['Lululemon'],
  },
};

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

  // Fallback category pills for immediate render
  const defaultCategories = [
    { id: 'cat_electronics', name: 'Electronics', slug: 'electronics' },
    { id: 'cat_apparel', name: 'Apparel', slug: 'apparel' },
    { id: 'cat_home', name: 'Home & Living', slug: 'home' },
  ];
  const displayCategories = categories.length > 0 ? categories : defaultCategories;

  // Active category meta for header banner
  const activeCategoryMeta = category ? categoryMetaMap[category.toLowerCase()] : null;

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

  // Update URL parameters without jumping to the top of the page
  const updateQuery = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === '' || value === 'all') {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });
    router.push(params.toString() ? `/?${params.toString()}` : '/', { scroll: false });
  };

  const handleClearFilters = () => {
    router.push('/', { scroll: false });
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    setNewsletterSuccess(true);
    setNewsletterEmail('');
    setTimeout(() => setNewsletterSuccess(false), 5000);
  };

  const allBrands = ['Apple', 'Sony', 'Nike', 'Dell', 'Breville', 'Herman Miller', 'Bose', 'Patagonia'];
  const displayBrands = activeCategoryMeta?.brands || allBrands;

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
      image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&auto=format&fit=crop&q=80',
      itemCount: '2 Products',
      highlight: 'Ergonomic Choice',
    },
  ];

  return (
    <div className="space-y-14 pb-20 bg-slate-50 min-h-screen text-slate-900">
      {/* 1. CONDITIONAL TOP BANNER */}
      {/* CASE A: Active Category Banner */}
      {category && (
        <section className="relative overflow-hidden bg-slate-900 text-white border-b border-slate-800">
          <div className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[280px] bg-indigo-600/25 blur-[130px] rounded-full pointer-events-none" />

          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
            {/* Breadcrumb Navigation */}
            <div className="flex items-center gap-2 text-xs text-slate-400 mb-4">
              <Link href="/" className="hover:text-white transition-colors">
                Storefront
              </Link>
              <span>/</span>
              <span className="text-slate-400">Departments</span>
              <span>/</span>
              <span className="text-indigo-400 font-semibold capitalize">
                {activeCategoryMeta?.title || category}
              </span>
            </div>

            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="space-y-3 max-w-2xl">
                <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/15 px-3.5 py-1 text-xs font-semibold text-indigo-300">
                  <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
                  <span>{activeCategoryMeta?.department || 'Curated Department'}</span>
                </div>

                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
                  {activeCategoryMeta?.title || `${category} Collection`}
                </h1>

                <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
                  {activeCategoryMeta?.description ||
                    'Explore our curated collection of authentic premium products with complimentary express delivery.'}
                </p>

                {/* Subcategory Filter Pills directly in the banner */}
                {activeCategoryMeta?.subcategories && activeCategoryMeta.subcategories.length > 0 && (
                  <div className="pt-2 flex flex-wrap items-center gap-2">
                    <span className="text-xs font-bold text-slate-400 mr-1">Subcategories:</span>
                    {activeCategoryMeta.subcategories.map((sub) => {
                      const isSubActive = category.toLowerCase() === sub.slug.toLowerCase();
                      return (
                        <button
                          key={sub.slug}
                          type="button"
                          onClick={() => updateQuery({ category: sub.slug })}
                          className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                            isSubActive
                              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 ring-2 ring-indigo-400'
                              : 'bg-slate-800/90 hover:bg-slate-700 text-slate-200 border border-slate-700'
                          }`}
                        >
                          {sub.name}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Live inventory badge / Reset CTA */}
              <div className="flex flex-col sm:flex-row md:flex-col items-start md:items-end gap-3 shrink-0">
                <div className="rounded-xl border border-slate-700/80 bg-slate-800/80 p-3.5 text-xs text-slate-300 space-y-1">
                  <div className="flex items-center gap-2 font-bold text-white">
                    <ShieldCheck className="h-4 w-4 text-emerald-400" />
                    <span>In Stock &amp; Ready to Ship</span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Showing {products.length} {products.length === 1 ? 'item' : 'items'} • Ships within 24 hours
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleClearFilters}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-300 hover:text-white transition-colors cursor-pointer"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span>Reset to All Departments</span>
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* CASE B: Active Search Banner */}
      {!category && search && (
        <section className="relative overflow-hidden bg-slate-900 text-white border-b border-slate-800">
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/15 px-3 py-1 text-xs font-semibold text-indigo-300">
                  <Search className="h-3.5 w-3.5 text-indigo-400" />
                  <span>Product Search</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-black text-white">
                  Search results for &ldquo;<span className="text-indigo-400">{search}</span>&rdquo;
                </h1>
                <p className="text-xs sm:text-sm text-slate-400">
                  Found {products.length} matching {products.length === 1 ? 'product' : 'products'} in our curated catalog.
                </p>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => updateQuery({ search: null })}
                className="self-start sm:self-auto border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700"
              >
                Clear Search
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* CASE C: Default Homepage Hero (When neither category nor search is active) */}
      {!category && !search && (
        <>
          <section className="relative overflow-hidden bg-slate-950 text-white">
            {/* Subtle decorative glow */}
            <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-indigo-600/30 blur-[150px] rounded-full pointer-events-none" />

            <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-28">
              <div className="text-center space-y-6 max-w-4xl mx-auto">
                <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/15 px-4 py-1.5 text-xs font-semibold text-indigo-300">
                  <Sparkles className="h-4 w-4 text-indigo-400" />
                  <span>Spring / Summer 2026 Collection • New Arrivals</span>
                </div>

                <h1 className="text-4xl font-black tracking-tight sm:text-6xl lg:text-7xl leading-tight">
                  Curated Design. <br />
                  <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-indigo-200 bg-clip-text text-transparent">
                    Engineered for Modern Living.
                  </span>
                </h1>

                <p className="mx-auto max-w-2xl text-base sm:text-lg text-slate-300 font-normal leading-relaxed">
                  Explore precision-crafted personal audio, high-performance computing, technical outerwear, and modern ergonomic furniture. Designed for uncompromising quality, durability, and daily elegance.
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
                    Explore Tech &amp; Audio
                  </button>
                </div>

                {/* 4 Feature Trust Badges */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-10 border-t border-slate-800 text-xs text-slate-300 text-left">
                  <div className="flex items-center gap-3 bg-slate-900/80 rounded-xl p-3.5 border border-slate-800">
                    <Truck className="h-5 w-5 text-indigo-400 shrink-0" />
                    <div>
                      <p className="font-bold text-white">Free Express Shipping</p>
                      <p className="text-[11px] text-slate-400">On all orders over $100</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 bg-slate-900/80 rounded-xl p-3.5 border border-slate-800">
                    <ShieldCheck className="h-5 w-5 text-emerald-400 shrink-0" />
                    <div>
                      <p className="font-bold text-white">Certified Authentic</p>
                      <p className="text-[11px] text-slate-400">100% genuine brand guarantee</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 bg-slate-900/80 rounded-xl p-3.5 border border-slate-800">
                    <Zap className="h-5 w-5 text-amber-400 shrink-0" />
                    <div>
                      <p className="font-bold text-white">2-Year Warranty</p>
                      <p className="text-[11px] text-slate-400">Full manufacturer coverage</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 bg-slate-900/80 rounded-xl p-3.5 border border-slate-800">
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

          {/* CURATED CATEGORY TILES (Visual Collection Cards) */}
          <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                  Curated Departments
                </p>
                <h2 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl mt-1">
                  Explore by Category
                </h2>
              </div>
              <span className="text-xs font-medium text-slate-500 hidden sm:inline">
                12 Verified Products across 11 Taxonomy Nodes
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {categoryCards.map((card) => {
                const isSelected = category === card.slug;
                return (
                  <div
                    key={card.slug}
                    onClick={() => updateQuery({ category: isSelected ? null : card.slug })}
                    className={`group relative overflow-hidden rounded-2xl border transition-all duration-300 cursor-pointer shadow-sm hover:shadow-xl ${
                      isSelected
                        ? 'border-indigo-600 ring-4 ring-indigo-600/20'
                        : 'border-slate-200 hover:border-indigo-400'
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
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/50 to-transparent" />
                    </div>

                    {/* Card Content Overlay */}
                    <div className="absolute inset-0 p-6 flex flex-col justify-between text-white">
                      <div className="flex justify-between items-start">
                        <span className="rounded-full bg-white/20 backdrop-blur-md px-3 py-1 text-[11px] font-semibold tracking-wide">
                          {card.itemCount}
                        </span>
                        <span className="rounded-full bg-indigo-600 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                          {card.highlight}
                        </span>
                      </div>

                      <div className="space-y-1">
                        <p className="text-xs font-semibold text-indigo-300 uppercase tracking-wider">
                          {card.subtitle}
                        </p>
                        <h3 className="text-xl font-bold text-white group-hover:text-indigo-200 transition-colors">
                          {card.title}
                        </h3>
                        <p className="text-xs text-slate-300 line-clamp-2 pt-1 font-normal">
                          {card.description}
                        </p>
                        <div className="pt-3 flex items-center gap-1.5 text-xs font-bold text-indigo-300 group-hover:translate-x-1 transition-transform">
                          <span>{isSelected ? '✓ Filter Active' : 'View Collection'}</span>
                          <ArrowRight className="h-3.5 w-3.5" />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </>
      )}

      {/* 2. MAIN CATALOG SECTION WITH FILTERS & SORTING */}
      <section id="catalog-section" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Title & Filter Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
          <div>
            <h2 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
              {search ? (
                <span>
                  Search results for &ldquo;<span className="text-indigo-600">{search}</span>&rdquo;
                </span>
              ) : activeCategoryMeta ? (
                <span>{activeCategoryMeta.title}</span>
              ) : category ? (
                <span className="capitalize">{category} Collection</span>
              ) : (
                'All Featured Products'
              )}
            </h2>
            <p className="text-xs text-slate-500 mt-1 font-medium">
              Showing {products.length} {products.length === 1 ? 'item' : 'items'} • Verified live warehouse stock
            </p>
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-slate-600 whitespace-nowrap">
              Sort by:
            </span>
            <select
              value={sortBy}
              onChange={(e) => updateQuery({ sortBy: e.target.value })}
              className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-800 shadow-2xs focus:border-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-600 cursor-pointer"
            >
              <option value="newest">Newest Arrivals</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="rating">Highest Customer Rating</option>
            </select>
          </div>
        </div>

        {/* Toolbar Container */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4 shadow-2xs">
          {/* Category Filter Pills Bar */}
          <div>
            <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
              Filter by Department:
            </span>
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              <button
                type="button"
                onClick={() => updateQuery({ category: null })}
                className={`rounded-full px-4 py-2 text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  !category
                    ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-200'
                    : 'bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                All Departments ({category || brand || search ? products.length : 12})
              </button>

              {displayCategories.map((cat) => {
                const isSelected = category.toLowerCase() === cat.slug.toLowerCase();
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => updateQuery({ category: isSelected ? null : cat.slug })}
                    className={`rounded-full px-4 py-2 text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                      isSelected
                        ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-200 font-bold'
                        : 'bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {cat.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick Brand Filter Pills */}
          <div className="pt-2 border-t border-slate-100">
            <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
              Filter by Brand {activeCategoryMeta ? `in ${activeCategoryMeta.department}` : ''}:
            </span>
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
              {displayBrands.map((b) => {
                const isBrandSelected = brand.toLowerCase() === b.toLowerCase();
                return (
                  <button
                    key={b}
                    type="button"
                    onClick={() => updateQuery({ brand: isBrandSelected ? null : b })}
                    className={`rounded-lg px-3 py-1.5 transition-all whitespace-nowrap cursor-pointer font-medium border ${
                      isBrandSelected
                        ? 'bg-indigo-600 text-white border-indigo-600 font-bold shadow-xs'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {b}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Filters Summary Pill Bar */}
          {(category || brand || search) && (
            <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-slate-100">
              <span className="text-xs text-slate-500 font-medium">Active filters:</span>
              {category && (
                <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700 border border-indigo-200">
                  Category: <span className="capitalize">{activeCategoryMeta?.title || category}</span>
                  <button
                    type="button"
                    onClick={() => updateQuery({ category: null })}
                    className="hover:text-indigo-900 ml-1 p-0.5 cursor-pointer"
                    aria-label="Remove category filter"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </span>
              )}
              {brand && (
                <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700 border border-indigo-200">
                  Brand: {brand}
                  <button
                    type="button"
                    onClick={() => updateQuery({ brand: null })}
                    className="hover:text-indigo-900 ml-1 p-0.5 cursor-pointer"
                    aria-label="Remove brand filter"
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
                    className="hover:text-amber-900 ml-1 p-0.5 cursor-pointer"
                    aria-label="Remove search filter"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </span>
              )}
              <button
                type="button"
                onClick={handleClearFilters}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-800 underline ml-2 cursor-pointer"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>

        {/* Product Grid Component */}
        <ProductGrid
          products={products}
          isLoading={isLoading}
          emptyMessage={
            search
              ? `No products found matching "${search}". Try searching for another brand or clearing filters.`
              : brand
              ? `No products currently available for brand "${brand}". Try selecting another brand or clearing filters.`
              : `No products are currently available matching the active filter criteria.`
          }
          onResetFilters={handleClearFilters}
        />
      </section>

      {/* 3. THE SHOPFLOW QUALITY STANDARD */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white p-8 sm:p-12 lg:p-16 shadow-xl">
          <div className="max-w-2xl space-y-4 mb-10">
            <div className="inline-flex items-center gap-2 rounded-full bg-indigo-500/20 px-3.5 py-1 text-xs font-semibold text-indigo-300 border border-indigo-500/30">
              <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
              <span>The ShopFlow Quality Standard</span>
            </div>
            <h2 className="text-2xl font-black tracking-tight sm:text-4xl text-white">
              Uncompromising Quality. Designed to Endure.
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed font-normal">
              Every item in our collection is curated from premier global innovators who share our dedication to material purity, ergonomic wellness, and enduring design.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-3 bg-white/5 rounded-2xl p-6 border border-white/10 backdrop-blur-xs">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white font-bold">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-white">100% Certified Authentic</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Direct brand partnerships with Apple, Sony, Bose, Breville, Herman Miller, and Patagonia. Every item includes full serialized manufacturer warranties.
              </p>
            </div>

            <div className="space-y-3 bg-white/5 rounded-2xl p-6 border border-white/10 backdrop-blur-xs">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white font-bold">
                <Truck className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-white">Express Climate-Controlled Dispatch</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                All inventory is stocked in regional climate-controlled hubs and dispatched within 24 hours with live milestone tracking directly to your door.
              </p>
            </div>

            <div className="space-y-3 bg-white/5 rounded-2xl p-6 border border-white/10 backdrop-blur-xs">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-600 text-white font-bold">
                <RotateCcw className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-white">30-Day Risk-Free Trial</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Experience your new workstation chair, espresso machine, or audio headphones in your own home. If you&apos;re not delighted, return it with zero restocking fees.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. VERIFIED CUSTOMER TESTIMONIALS */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2 max-w-xl mx-auto">
          <p className="text-xs font-bold uppercase tracking-wider text-indigo-600">
            Real Customer Reviews
          </p>
          <h2 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
            Trusted by Creators &amp; Professionals
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            Over 2,400+ verified orders delivered with a 99.8% customer satisfaction rating.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
            <div className="flex text-amber-400">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-current" />
              ))}
            </div>
            <p className="text-xs text-slate-600 leading-relaxed italic">
              &ldquo;The MacBook Pro M3 Max arrived in pristine factory packaging within 24 hours. The Liquid Retina XDR display and battery longevity have elevated my entire creative workflow.&rdquo;
            </p>
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-900">Sarah Jenkins</p>
                <p className="text-[11px] text-slate-400 font-medium">Senior Product Designer</p>
              </div>
              <Badge variant="success" className="text-[10px]">Verified Buyer</Badge>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
            <div className="flex text-amber-400">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-current" />
              ))}
            </div>
            <p className="text-xs text-slate-600 leading-relaxed italic">
              &ldquo;Investing in the Herman Miller Aeron transformed my daily posture. The breathable 8Z Pellicle suspension keeps me cool all day. Free delivery on such a substantial piece was fantastic.&rdquo;
            </p>
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-900">David Martinez</p>
                <p className="text-[11px] text-slate-400 font-medium">Architectural Lead</p>
              </div>
              <Badge variant="success" className="text-[10px]">Verified Buyer</Badge>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
            <div className="flex text-amber-400">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-current" />
              ))}
            </div>
            <p className="text-xs text-slate-600 leading-relaxed italic">
              &ldquo;The Breville Barista Touch makes cafe-quality flat whites in under 3 minutes. The intuitive touchscreen guided me through the exact extraction profile. Exceptional customer care.&rdquo;
            </p>
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-900">Elena Rostova</p>
                <p className="text-[11px] text-slate-400 font-medium">Studio Director</p>
              </div>
              <Badge variant="success" className="text-[10px]">Verified Buyer</Badge>
            </div>
          </div>
        </div>
      </section>

      {/* 5. VIP NEWSLETTER CLUB */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl bg-indigo-50 border border-indigo-200 p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-8 shadow-xs">
          <div className="space-y-2 max-w-md">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-700">
              <Mail className="h-4 w-4" />
              <span>SHOPFLOW VIP CLUB</span>
            </div>
            <h3 className="text-2xl font-bold text-slate-900">
              Unlock 15% Off Your Next Order
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
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
        <div className="flex min-h-[500px] items-center justify-center bg-slate-50">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
        </div>
      }
    >
      <StoreContent />
    </Suspense>
  );
}
