'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X, TrendingUp } from 'lucide-react';
import { productApi } from '../services/product.api';
import { TrieSuggestion } from '../types/product.types';

export function SearchBar() {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<TrieSuggestion[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);

  // Debounced Trie Autocomplete Fetch
  useEffect(() => {
    if (!query || query.trim().length === 0) {
      setSuggestions([]);
      setIsOpen(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const results = await productApi.getAutocomplete(query.trim());
        setSuggestions(results);
        setIsOpen(results.length > 0);
      } catch (err) {
        console.error('Failed to fetch autocomplete:', err);
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
    if (!query.trim()) return;

    if (activeIndex >= 0 && suggestions[activeIndex]) {
      handleSelect(suggestions[activeIndex]);
    } else {
      setIsOpen(false);
      router.push(`/?search=${encodeURIComponent(query.trim())}`);
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
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => suggestions.length > 0 && setIsOpen(true)}
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
              }}
              className="absolute right-3 text-slate-400 hover:text-slate-600 p-0.5"
              aria-label="Clear search input"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </form>

      {/* Autocomplete Suggestions Dropdown */}
      {isOpen && (
        <div className="absolute left-0 right-0 top-full mt-1.5 z-50 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg animate-fadeIn">
          <div className="p-1.5">
            <div className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <TrendingUp className="h-3 w-3 text-indigo-500" />
              Instant Suggestions ({suggestions.length})
            </div>
            <ul className="space-y-0.5">
              {suggestions.map((item, index) => (
                <li key={`${item.term}-${index}`}>
                  <button
                    type="button"
                    onClick={() => handleSelect(item)}
                    className={`w-full flex items-center justify-between px-3 py-2 text-left text-sm rounded-lg transition-colors ${
                      index === activeIndex
                        ? 'bg-indigo-50 text-indigo-900 font-medium'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span>{item.term}</span>
                    <span className="text-[11px] text-slate-400">
                      {item.slug ? 'view product' : 'search keyword'}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
