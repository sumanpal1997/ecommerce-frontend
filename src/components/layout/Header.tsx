'use client';

import React, { useState, useRef, useEffect, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams, usePathname } from 'next/navigation';
import {
  ShoppingBag,
  User,
  LogOut,
  Menu,
  X,
  ShieldCheck,
  ChevronDown,
  Sparkles,
  Headphones,
  Laptop,
  Watch,
  Shirt,
  Footprints,
  Coffee,
  Layers,
  ArrowRight,
  Star,
  CheckCircle2,
} from 'lucide-react';
import { useAuth } from '@/features/auth/context/auth-context';
import { useCart } from '@/features/cart/context/cart-context';
import { SearchBar } from '@/features/products/components/SearchBar';
import { Button } from '@/components/ui/Button';
import { formatCurrency } from '@/lib/utils/cn';

interface SubcategoryItem {
  name: string;
  slug: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  count: string;
}

interface BrandItem {
  name: string;
  href: string;
}

interface FeaturedItem {
  title: string;
  brand: string;
  price: number;
  originalPrice?: number;
  image: string;
  href: string;
  badge: string;
}

interface NavMenuItem {
  id: string;
  label: string;
  href: string;
  categorySlug?: string;
  badge: string;
  tagline: string;
  description: string;
  subcategories: SubcategoryItem[];
  brands: BrandItem[];
  featured: FeaturedItem;
}

const navMenus: NavMenuItem[] = [
  {
    id: 'all',
    label: 'All Catalog',
    href: '/',
    badge: '12 Items',
    tagline: 'Enterprise Storefront Catalog',
    description: 'Browse all 12 verified products across 3 curated departments and 8 premier brand partners.',
    subcategories: [
      {
        name: 'Consumer Electronics',
        slug: 'electronics',
        href: '/?category=electronics',
        icon: Laptop,
        description: 'M3 Max workstations, ANC headphones & titanium smartwatches',
        count: '6 Products',
      },
      {
        name: 'Technical Apparel',
        slug: 'apparel',
        href: '/?category=apparel',
        icon: Shirt,
        description: 'Thermal fleece outerwear, React sneakers & activewear',
        count: '4 Products',
      },
      {
        name: 'Home & Living',
        slug: 'home',
        href: '/?category=home',
        icon: Coffee,
        description: 'Commercial touchscreen espresso & Herman Miller Aeron seating',
        count: '2 Products',
      },
    ],
    brands: [
      { name: 'Apple', href: '/?brand=Apple' },
      { name: 'Sony', href: '/?brand=Sony' },
      { name: 'Nike', href: '/?brand=Nike' },
      { name: 'Dell', href: '/?brand=Dell' },
      { name: 'Breville', href: '/?brand=Breville' },
      { name: 'Herman Miller', href: '/?brand=Herman+Miller' },
      { name: 'Bose', href: '/?brand=Bose' },
      { name: 'Patagonia', href: '/?brand=Patagonia' },
    ],
    featured: {
      title: 'Sony WH-1000XM5 Wireless Headphones',
      brand: 'Sony',
      price: 398.0,
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80',
      href: '/products/sony-wh-1000xm5-wireless-headphones',
      badge: 'Top Rated 4.9 ★',
    },
  },
  {
    id: 'electronics',
    label: 'Electronics',
    href: '/?category=electronics',
    categorySlug: 'electronics',
    badge: '6 Items',
    tagline: 'Pro Computing & Spatial Audio',
    description: 'Flagship M3 Max workstations, active noise-canceling headphones & titanium smartwatches.',
    subcategories: [
      {
        name: 'Audio & Headphones',
        slug: 'audio',
        href: '/?category=audio',
        icon: Headphones,
        description: 'Sony WH-1000XM5, Bose SoundLink 360° & Bravia OLED',
        count: '3 Products',
      },
      {
        name: 'Computers & Workstations',
        slug: 'computers',
        href: '/?category=computers',
        icon: Laptop,
        description: 'Apple MacBook Pro 16" M3 Max & Dell XPS 15 9530',
        count: '2 Products',
      },
      {
        name: 'Wearables & Smartwatches',
        slug: 'wearables',
        href: '/?category=wearables',
        icon: Watch,
        description: 'Apple Watch Ultra 2 Titanium GPS + Cellular telemetry',
        count: '1 Product',
      },
    ],
    brands: [
      { name: 'Apple', href: '/?category=electronics&brand=Apple' },
      { name: 'Sony', href: '/?category=electronics&brand=Sony' },
      { name: 'Dell', href: '/?category=electronics&brand=Dell' },
      { name: 'Bose', href: '/?category=electronics&brand=Bose' },
    ],
    featured: {
      title: 'Apple MacBook Pro 16" (M3 Max)',
      brand: 'Apple',
      price: 3499.0,
      image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&auto=format&fit=crop&q=80',
      href: '/products/apple-macbook-pro-16-m3-max',
      badge: 'Pro Flagship Workstation',
    },
  },
  {
    id: 'apparel',
    label: 'Apparel',
    href: '/?category=apparel',
    categorySlug: 'apparel',
    badge: '4 Items',
    tagline: 'Technical Outerwear & Performance',
    description: 'Double-sided thermal fleece, weather-resistant outerwear, street runners and buttery-soft activewear.',
    subcategories: [
      {
        name: 'Footwear & Sneakers',
        slug: 'footwear',
        href: '/?category=footwear',
        icon: Footprints,
        description: 'Nike Air Max 270 React street-ready cushioned sneakers',
        count: '1 Product',
      },
      {
        name: "Men's Technical Outerwear",
        slug: 'mens-wear',
        href: '/?category=mens-wear',
        icon: Shirt,
        description: 'Nike Tech Fleece hoodie & Patagonia Nano Puff jacket',
        count: '2 Products',
      },
      {
        name: "Women's Activewear",
        slug: 'womens-wear',
        href: '/?category=womens-wear',
        icon: Sparkles,
        description: 'Lululemon Align High-Rise 25" buttery soft pant',
        count: '1 Product',
      },
    ],
    brands: [
      { name: 'Nike', href: '/?category=apparel&brand=Nike' },
      { name: 'Patagonia', href: '/?category=apparel&brand=Patagonia' },
      { name: 'Lululemon', href: '/?category=apparel&brand=Lululemon' },
    ],
    featured: {
      title: 'Nike Tech Fleece Full-Zip Windrunner',
      brand: 'Nike',
      price: 145.0,
      image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=600&auto=format&fit=crop&q=80',
      href: '/products/nike-tech-fleece-full-zip-windrunner-hoodie',
      badge: 'Best Seller',
    },
  },
  {
    id: 'home',
    label: 'Home & Living',
    href: '/?category=home',
    categorySlug: 'home',
    badge: '2 Items',
    tagline: 'Kitchen Craft & Ergonomic Workspaces',
    description: 'Commercial-grade touchscreen espresso engineering and Herman Miller PostureFit SL task seating.',
    subcategories: [
      {
        name: 'Kitchen Appliances',
        slug: 'kitchen',
        href: '/?category=kitchen',
        icon: Coffee,
        description: 'Breville Barista Touch 3-second ThermoJet espresso machine',
        count: '1 Product',
      },
      {
        name: 'Office & Furniture',
        slug: 'office',
        href: '/?category=office',
        icon: Layers,
        description: 'Herman Miller Aeron 8Z Pellicle ergonomic task chair',
        count: '1 Product',
      },
    ],
    brands: [
      { name: 'Breville', href: '/?category=home&brand=Breville' },
      { name: 'Herman Miller', href: '/?category=home&brand=Herman+Miller' },
    ],
    featured: {
      title: 'Breville the Barista Touch Espresso Machine',
      brand: 'Breville',
      price: 899.95,
      originalPrice: 999.95,
      image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&auto=format&fit=crop&q=80',
      href: '/products/breville-barista-touch-espresso-machine',
      badge: 'Save $100 Special',
    },
  },
];

function HeaderNavLinks() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const currentCategory = searchParams.get('category') || '';
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const navContainerRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Close menu on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (navContainerRef.current && !navContainerRef.current.contains(event.target as Node)) {
        setActiveMenuId(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close menu on escape key
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setActiveMenuId(null);
      }
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Close menu on route changes
  useEffect(() => {
    setActiveMenuId(null);
  }, [pathname, currentCategory]);

  const handleMouseEnter = (id: string) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setActiveMenuId(id);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setActiveMenuId(null);
    }, 200);
  };

  return (
    <div ref={navContainerRef} className="relative hidden lg:block" onMouseLeave={handleMouseLeave}>
      <nav className="flex items-center gap-1 text-sm font-medium">
        {navMenus.map((item) => {
          const isCategoryMatch = item.categorySlug
            ? currentCategory === item.categorySlug || currentCategory.startsWith(item.categorySlug)
            : pathname === '/' && !currentCategory;
          const isOpen = activeMenuId === item.id;

          return (
            <div key={item.id} className="relative">
              <button
                type="button"
                onMouseEnter={() => handleMouseEnter(item.id)}
                onClick={() => setActiveMenuId(isOpen ? null : item.id)}
                className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                  isOpen || isCategoryMatch
                    ? 'text-indigo-600 bg-indigo-50/70 font-semibold'
                    : 'text-slate-600 hover:text-indigo-600 hover:bg-slate-50'
                }`}
                aria-expanded={isOpen}
                aria-haspopup="true"
              >
                <span>{item.label}</span>
                <ChevronDown
                  className={`h-3.5 w-3.5 transition-transform duration-200 ${
                    isOpen ? 'rotate-180 text-indigo-600' : 'text-slate-400'
                  }`}
                />
              </button>
            </div>
          );
        })}
      </nav>

      {/* Mega Menu Dropdown UI Popover */}
      {activeMenuId && (
        <div
          onMouseEnter={() => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
          }}
          className="absolute left-0 top-full pt-3 z-50 w-[740px] max-w-[calc(100vw-2rem)] animate-in fade-in slide-in-from-top-2 duration-150"
        >
          {(() => {
            const menu = navMenus.find((m) => m.id === activeMenuId);
            if (!menu) return null;

            return (
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl ring-1 ring-slate-900/5">
                {/* Menu Header */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-5">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-base font-bold text-slate-900">
                        {menu.label}
                      </span>
                      <span className="rounded-full bg-indigo-50 px-2.5 py-0.5 text-[11px] font-bold text-indigo-700">
                        {menu.badge}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 font-normal">
                      {menu.description}
                    </p>
                  </div>
                  <Link
                    href={menu.href}
                    onClick={() => setActiveMenuId(null)}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-700 transition-colors shrink-0"
                  >
                    <span>View All</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>

                {/* 2-Column Content Grid */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                  {/* Left Column: Subcategories & Brands (3 cols) */}
                  <div className="md:col-span-3 space-y-4">
                    <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Explore Subcategories
                    </span>

                    <div className="space-y-2">
                      {menu.subcategories.map((sub) => {
                        const IconComponent = sub.icon;
                        return (
                          <Link
                            key={sub.slug}
                            href={sub.href}
                            onClick={() => setActiveMenuId(null)}
                            className="group flex items-start gap-3 rounded-xl p-2.5 transition-colors hover:bg-slate-50"
                          >
                            <div className="rounded-lg bg-indigo-50 p-2 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors shrink-0 mt-0.5">
                              <IconComponent className="h-4 w-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-2">
                                <span className="text-xs font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                                  {sub.name}
                                </span>
                                <span className="text-[10px] font-medium text-slate-400">
                                  {sub.count}
                                </span>
                              </div>
                              <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                                {sub.description}
                              </p>
                            </div>
                          </Link>
                        );
                      })}
                    </div>

                    {/* Brands Section */}
                    {menu.brands.length > 0 && (
                      <div className="pt-3 border-t border-slate-100">
                        <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                          Popular Brands
                        </span>
                        <div className="flex flex-wrap items-center gap-1.5">
                          {menu.brands.map((b) => (
                            <Link
                              key={b.name}
                              href={b.href}
                              onClick={() => setActiveMenuId(null)}
                              className="rounded-md border border-slate-200 bg-slate-50 px-2 py-1 text-[11px] font-medium text-slate-700 hover:border-indigo-500 hover:bg-indigo-50 hover:text-indigo-700 transition-colors"
                            >
                              {b.name}
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Right Column: Featured Spotlight Card (2 cols) */}
                  <div className="md:col-span-2">
                    <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                      Department Spotlight
                    </span>

                    <div className="flex flex-col justify-between rounded-xl border border-slate-200 bg-slate-50/70 p-3.5 space-y-3">
                      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg bg-white border border-slate-200">
                        <Image
                          src={menu.featured.image}
                          alt={menu.featured.title}
                          fill
                          sizes="240px"
                          className="object-cover"
                        />
                        <span className="absolute top-2 left-2 rounded-full bg-slate-900/80 backdrop-blur-md px-2 py-0.5 text-[10px] font-bold text-white uppercase tracking-wider">
                          {menu.featured.badge}
                        </span>
                      </div>

                      <div className="space-y-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600">
                          {menu.featured.brand}
                        </span>
                        <h4 className="text-xs font-bold text-slate-900 line-clamp-2 leading-snug">
                          {menu.featured.title}
                        </h4>
                        <div className="flex items-center justify-between pt-1">
                          <div className="flex items-baseline gap-1.5">
                            <span className="text-sm font-black text-slate-900">
                              {formatCurrency(menu.featured.price)}
                            </span>
                            {menu.featured.originalPrice && (
                              <span className="text-[11px] text-slate-400 line-through">
                                {formatCurrency(menu.featured.originalPrice)}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <Link
                        href={menu.featured.href}
                        onClick={() => setActiveMenuId(null)}
                        className="w-full"
                      >
                        <Button
                          size="sm"
                          className="w-full flex items-center justify-center gap-1.5 text-xs py-1.5"
                        >
                          <span>View Product</span>
                          <ArrowRight className="h-3 w-3" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Menu Footer Bar */}
                <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-slate-500">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                    <span>Free express shipping over $100 • Zero overselling stock guarantee</span>
                  </div>
                  <Link
                    href={menu.href}
                    onClick={() => setActiveMenuId(null)}
                    className="font-bold text-indigo-600 hover:text-indigo-700 transition-colors"
                  >
                    Open {menu.label} Catalog →
                  </Link>
                </div>
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
}

function MobileNavLinks({ onSelect }: { onSelect: () => void }) {
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get('category') || '';
  const [expandedMenu, setExpandedMenu] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedMenu(expandedMenu === id ? null : id);
  };

  return (
    <nav className="flex flex-col space-y-1.5 pt-2">
      {navMenus.map((menu) => {
        const isExpanded = expandedMenu === menu.id;
        const isCurrent = menu.categorySlug
          ? currentCategory === menu.categorySlug
          : !currentCategory;

        return (
          <div key={menu.id} className="rounded-xl border border-slate-100 overflow-hidden bg-white">
            <div className="flex items-center justify-between px-3 py-2.5">
              <Link
                href={menu.href}
                onClick={onSelect}
                className={`text-sm font-semibold transition-colors flex-1 ${
                  isCurrent ? 'text-indigo-600' : 'text-slate-800'
                }`}
              >
                {menu.label}
                <span className="ml-2 text-[10px] font-normal text-slate-400">
                  ({menu.badge})
                </span>
              </Link>

              <button
                type="button"
                onClick={() => toggleExpand(menu.id)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                aria-label={`Toggle ${menu.label} subcategories`}
              >
                <ChevronDown
                  className={`h-4 w-4 transition-transform duration-200 ${
                    isExpanded ? 'rotate-180 text-indigo-600' : ''
                  }`}
                />
              </button>
            </div>

            {isExpanded && (
              <div className="bg-slate-50 px-3 py-2 border-t border-slate-100 space-y-2">
                <p className="text-[11px] text-slate-500">{menu.description}</p>

                <div className="space-y-1 pt-1">
                  {menu.subcategories.map((sub) => {
                    const IconComponent = sub.icon;
                    return (
                      <Link
                        key={sub.slug}
                        href={sub.href}
                        onClick={onSelect}
                        className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-700 hover:bg-white hover:text-indigo-600 transition-colors"
                      >
                        <IconComponent className="h-3.5 w-3.5 text-indigo-600 shrink-0" />
                        <span className="flex-1 truncate">{sub.name}</span>
                        <span className="text-[10px] text-slate-400">{sub.count}</span>
                      </Link>
                    );
                  })}
                </div>

                <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between">
                  <Link
                    href={menu.href}
                    onClick={onSelect}
                    className="text-xs font-bold text-indigo-600"
                  >
                    View All {menu.label} →
                  </Link>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </nav>
  );
}

export function Header() {
  const { user, isAuthenticated, logout } = useAuth();
  const { cart, openCart } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const itemCount = cart?.itemCount || 0;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/95 backdrop-blur-md">
      {/* Top Promotional Bar */}
      <div className="bg-slate-900 px-4 py-2 text-center text-xs text-slate-300 font-medium tracking-wide">
        <div className="mx-auto max-w-7xl flex items-center justify-between">
          <span className="hidden md:inline-flex items-center gap-1.5 text-indigo-400">
            <Sparkles className="h-3.5 w-3.5" />
            <span>High-Concurrency Modular Monolith</span>
          </span>
          <p className="mx-auto md:mx-0">
            <strong>Free Express Shipping</strong> on all orders over $100 • Use code{' '}
            <span className="bg-indigo-600/40 text-indigo-300 px-1.5 py-0.5 rounded font-mono font-bold">
              SHOPFLOW10
            </span>{' '}
            for 10% off
          </p>
          <span className="hidden lg:inline text-slate-400">
            Atomic Inventory Guard • Zero Overselling
          </span>
        </div>
      </div>

      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8 h-16">
        {/* Brand Logo & Desktop Nav */}
        <div className="flex items-center gap-6 xl:gap-8">
          <Link href="/" className="flex items-center gap-2.5 group shrink-0">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-sm shadow-indigo-200 group-hover:scale-105 transition-transform">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black tracking-tight text-slate-900 leading-none">
                SHOPFLOW
              </span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-600 leading-none mt-0.5">
                ENTERPRISE
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links with Dropdown Menus */}
          <Suspense fallback={<div className="h-8 w-64 bg-slate-100 rounded-lg animate-pulse" />}>
            <HeaderNavLinks />
          </Suspense>
        </div>

        {/* Center Search Bar */}
        <div className="hidden sm:flex flex-1 justify-center max-w-md mx-2">
          <SearchBar />
        </div>

        {/* Right Actions: Auth & Cart */}
        <div className="flex items-center gap-3 shrink-0">
          {isAuthenticated && user ? (
            <div className="relative">
              {(() => {
                const displayName = user.firstName
                  ? `${user.firstName} ${user.lastName || ''}`.trim()
                  : user.email;
                const initial = user.firstName ? user.firstName[0].toUpperCase() : 'U';

                return (
                  <>
                    <button
                      type="button"
                      onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                      className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 py-1.5 px-3 text-xs font-medium text-slate-700 hover:bg-slate-100 transition-colors"
                      aria-label="User account menu"
                    >
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-600 text-white font-bold text-[11px]">
                        {initial}
                      </div>
                      <span className="hidden md:inline max-w-[120px] truncate">
                        {displayName}
                      </span>
                      <ChevronDown className="h-3 w-3 text-slate-400" />
                    </button>

                    {userDropdownOpen && (
                      <div
                        className="absolute right-0 mt-2 w-56 rounded-xl border border-slate-200 bg-white py-1.5 shadow-lg z-50 animate-fadeIn"
                        onMouseLeave={() => setUserDropdownOpen(false)}
                      >
                        <div className="px-4 py-2.5 border-b border-slate-100">
                          <p className="text-xs font-bold text-slate-900 truncate">
                            {displayName}
                          </p>
                          <p className="text-[11px] text-slate-500 truncate">
                            {user.email}
                          </p>
                          <span className="inline-block mt-1.5 rounded-full bg-indigo-50 px-2 py-0.5 text-[10px] font-semibold text-indigo-700">
                            {user.role} ACCOUNT
                          </span>
                        </div>

                        <Link
                          href="/checkout"
                          onClick={() => setUserDropdownOpen(false)}
                          className="block px-4 py-2 text-xs text-slate-700 hover:bg-slate-50"
                        >
                          Checkout & Orders
                        </Link>

                        <button
                          type="button"
                          onClick={async () => {
                            setUserDropdownOpen(false);
                            await logout();
                          }}
                          className="flex w-full items-center gap-2 px-4 py-2 text-left text-xs text-rose-600 hover:bg-rose-50"
                        >
                          <LogOut className="h-3.5 w-3.5" />
                          Sign Out
                        </button>
                      </div>
                    )}
                  </>
                );
              })()}
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-2">
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Sign In
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm">
                  Register
                </Button>
              </Link>
            </div>
          )}

          {/* Cart Icon Trigger */}
          <button
            type="button"
            onClick={openCart}
            className="relative flex items-center justify-center rounded-xl border border-slate-200 bg-white p-2.5 text-slate-700 hover:border-indigo-600 hover:text-indigo-600 transition-colors shadow-2xs group cursor-pointer"
            aria-label={`Open shopping cart with ${itemCount} items`}
          >
            <ShoppingBag className="h-5 w-5 group-hover:scale-110 transition-transform" />
            {itemCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-[11px] font-bold text-white shadow-xs animate-scaleIn">
                {itemCount > 99 ? '99+' : itemCount}
              </span>
            )}
          </button>

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden rounded-lg p-2 text-slate-500 hover:bg-slate-100"
            aria-label="Toggle mobile navigation"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 py-4 space-y-4">
          <SearchBar />

          <Suspense fallback={<div className="h-10 bg-slate-100 rounded animate-pulse" />}>
            <MobileNavLinks onSelect={() => setMobileMenuOpen(false)} />
          </Suspense>

          {!isAuthenticated && (
            <div className="pt-3 border-t border-slate-100 flex gap-2">
              <Link href="/login" className="flex-1" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="outline" size="sm" className="w-full">
                  Sign In
                </Button>
              </Link>
              <Link href="/register" className="flex-1" onClick={() => setMobileMenuOpen(false)}>
                <Button size="sm" className="w-full">
                  Register
                </Button>
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
