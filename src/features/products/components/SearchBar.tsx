'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X, TrendingUp, SearchX, Loader2, ArrowRight } from 'lucide-react';
import { productApi } from '../services/product.api';
import { TrieSuggestion } from '../types/product.types';

export function SearchBar() {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<TrieSuggestion[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);

  // Sync with URL query on mount / browser back-forward
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const urlSearch = urlParams.get('search');
      if (urlSearch) {
        setQuery(urlSearch);
      }
    }
  }, []);

  // Debounced Autocomplete & Product Search Fetch
  useEffect(() => {
    const trimmed = query.trim();
    if (!trimmed) {
      setSuggestions([]);
      setIsOpen(false);
      setIsLoading(false);
      setHasSearched(false);
      return;
    }

    // Keep dropdown open and activate loading indicator while user is typing
    setIsLoading(true);
    setIsOpen(true);

    const timer = setTimeout(async () => {
      try {
        const results = await productApi.getAutocomplete(trimmed);
        setSuggestions(results);
        setHasSearched(true);
      } catch (err) {
        console.error('Failed to fetch autocomplete:', err);
        setSuggestions([]);
        setHasSearched(true);
      } finally {
        setIsLoading(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [query]);

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (item: TrieSuggestion) => {
    setIsOpen(false);
    setQuery(item.term);
    if (item.slug) {
      router.push(`/products/${item.slug}`);
    } else {
      router.push(`/?search=${encodeURIComponent(item.term)}`);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;

    if (activeIndex >= 0 && suggestions[activeIndex]) {
      handleSelect(suggestions[activeIndex]);
    } else {
      setIsOpen(false);
      router.push(`/?search=${encodeURIComponent(trimmed)}`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((prev) => (prev > 0 ? prev - 1 : suggestions.length - 1));
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-md">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative flex items-center">
          <Search className="absolute left-3 h-4 w-4 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              if (e.target.value.trim().length > 0) {
                setIsOpen(true);
              }
            }}
            onFocus={() => {
              if (query.trim().length > 0) {
                setIsOpen(true);
              }
            }}
            onKeyDown={handleKeyDown}
            placeholder="Search products, brands, categories..."
            className="w-full rounded-full border border-slate-200 bg-slate-50 py-2 pl-9 pr-9 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-600 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-600 transition-all"
            aria-label="Search catalog"
          />
          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery('');
                setSuggestions([]);
                setIsOpen(false);
                setHasSearched(false);
              }}
              className="absolute right-3 text-slate-400 hover:text-slate-600 p-0.5"
              aria-label="Clear search input"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </form>

      {/* Autocomplete / Search Dropdown */}
      {isOpen && query.trim().length > 0 && (
        <div className="absolute left-0 right-0 top-full mt-1.5 z-50 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl animate-fadeIn">
          {/* State 1: Loading Indicator */}
          {isLoading && (
            <div className="flex items-center justify-center gap-2.5 py-6 px-4 text-xs text-slate-500">
              <Loader2 className="h-4 w-4 animate-spin text-indigo-600" />
              <span>
                Searching products for &ldquo;
                <strong className="text-slate-800 font-semibold">{query.trim()}</strong>
                &rdquo;...
              </span>
            </div>
          )}

          {/* State 2: No Products Found (Empty State) */}
          {!isLoading && hasSearched && suggestions.length === 0 && (
            <div className="p-5 text-center space-y-2.5">
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-rose-50 text-rose-500">
                <SearchX className="h-5 w-5 stroke-[1.8]" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">
                  No products found
                </h4>
                <p className="text-xs text-slate-500 max-w-[280px] mx-auto mt-0.5 leading-relaxed">
                  We couldn&apos;t find any products matching &ldquo;
                  <span className="font-semibold text-slate-700">{query.trim()}</span>
                  &rdquo;. Please check your spelling or try another keyword.
                </p>
              </div>

              {/* Helpful suggestions */}
              <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-center gap-1.5 text-[11px] text-slate-500">
                <span className="font-medium text-slate-400">Try searching:</span>
                {['MacBook', 'AirPods', 'Nike', 'Aeron', 'Sony', 'Bose'].map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => {
                      setQuery(tag);
                    }}
                    className="rounded-md bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 px-2 py-0.5 font-medium text-slate-700 transition-colors cursor-pointer"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* State 3: Matching Suggestions / Products Found */}
          {!isLoading && suggestions.length > 0 && (
            <div className="p-1.5">
              <div className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <TrendingUp className="h-3.5 w-3.5 text-indigo-500" />
                  <span>Matching Products ({suggestions.length})</span>
                </div>
                <span className="text-[10px] text-slate-400 font-normal">Press ↵ to view all</span>
              </div>

              <ul className="space-y-0.5">
                {suggestions.map((item, index) => (
                  <li key={`${item.term}-${index}`}>
                    <button
                      type="button"
                      onClick={() => handleSelect(item)}
                      className={`w-full flex items-center justify-between px-3 py-2 text-left text-sm rounded-xl transition-colors cursor-pointer ${
                        index === activeIndex
                          ? 'bg-indigo-50 text-indigo-900 font-medium'
                          : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0 pr-2">
                        <Search className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{item.term}</span>
                      </div>
                      <span className="text-[11px] font-medium text-indigo-600 shrink-0 flex items-center gap-0.5">
                        {item.slug ? 'View Product' : 'Search'}
                        <ArrowRight className="h-3 w-3" />
                      </span>
                    </button>
                  </li>
                ))}
              </ul>

              {/* View all results button */}
              <div className="border-t border-slate-100 mt-1 pt-1.5 px-1">
                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    router.push(`/?search=${encodeURIComponent(query.trim())}`);
                  }}
                  className="w-full py-1.5 text-center text-xs font-semibold text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50/60 rounded-lg transition-colors cursor-pointer"
                >
                  See all matching results for &ldquo;{query.trim()}&rdquo; →
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
