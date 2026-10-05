'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { X, ShoppingBag, ArrowRight, AlertCircle, Sparkles } from 'lucide-react';
import { useCart } from '../context/cart-context';
import { useAuth } from '@/features/auth/context/auth-context';
import { CartItem } from './CartItem';
import { Button } from '@/components/ui/Button';
import { formatCurrency } from '@/lib/utils/cn';

export function CartDrawer() {
  const { cart, isLoading, isOpen, closeCart, updateQuantity, removeFromCart } = useCart();
  const { user } = useAuth();
  const router = useRouter();

  // Close on ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        closeCart();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, closeCart]);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen || user?.role === 'ADMIN') return null;

  const subtotal = cart?.subtotal || 0;
  const freeShippingThreshold = 100;
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const items = cart?.items || [];
  const itemCount = cart?.itemCount || 0;

  const handleCheckoutClick = () => {
    closeCart();
    router.push('/checkout');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity duration-300"
        onClick={closeCart}
        aria-hidden="true"
      />

      <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
        <aside
          role="dialog"
          aria-modal="true"
          aria-label="Shopping Cart Drawer"
          className="w-screen max-w-md bg-white shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
            <div className="flex items-center gap-2">
              <ShoppingBag className="h-5 w-5 text-indigo-600" />
              <h2 className="text-base font-semibold text-slate-900">
                Shopping Cart
              </h2>
              {itemCount > 0 && (
                <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-xs font-medium text-indigo-700">
                  {itemCount} {itemCount === 1 ? 'item' : 'items'}
                </span>
              )}
            </div>
            <button
              type="button"
              onClick={closeCart}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
              aria-label="Close cart drawer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Free Shipping Progress Indicator */}
          {itemCount > 0 && (
            <div className="bg-slate-50 border-b border-slate-100 px-6 py-2.5">
              <div className="flex items-center justify-between text-xs text-slate-600 mb-1.5">
                <span className="flex items-center gap-1">
                  <Sparkles className="h-3.5 w-3.5 text-indigo-600" />
                  {remainingForFreeShipping > 0 ? (
                    <>
                      Add <span className="font-semibold text-slate-900">{formatCurrency(remainingForFreeShipping)}</span> more for Free Shipping
                    </>
                  ) : (
                    <span className="font-semibold text-emerald-600">
                      🎉 Congratulations! You unlocked Free Shipping
                    </span>
                  )}
                </span>
                <span className="text-[11px] font-medium text-slate-400">
                  Goal: $100
                </span>
              </div>
              <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-indigo-600 rounded-full transition-all duration-300"
                  style={{
                    width: `${Math.min(100, (subtotal / freeShippingThreshold) * 100)}%`,
                  }}
                />
              </div>
            </div>
          )}

          {/* Unavailable Items Warning */}
          {cart?.hasUnavailableItems && (
            <div className="mx-6 mt-4 flex items-center gap-2 rounded-lg bg-amber-50 p-3 text-xs text-amber-800 border border-amber-200">
              <AlertCircle className="h-4 w-4 shrink-0 text-amber-600" />
              <span>
                One or more items in your cart are currently out of stock. Please remove them to proceed.
              </span>
            </div>
          )}

          {/* Body / Item List */}
          <div className="flex-1 overflow-y-auto px-6 py-2">
            {isLoading && !cart ? (
              <div className="flex h-full items-center justify-center">
                <div className="text-center space-y-2">
                  <div className="h-6 w-6 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent mx-auto" />
                  <p className="text-xs text-slate-500">Loading your cart...</p>
                </div>
              </div>
            ) : items.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center text-center py-12">
                <div className="rounded-full bg-slate-100 p-4 mb-4 text-slate-400">
                  <ShoppingBag className="h-8 w-8" />
                </div>
                <h3 className="text-sm font-semibold text-slate-900">Your cart is empty</h3>
                <p className="mt-1 text-xs text-slate-500 max-w-xs">
                  Looks like you haven&apos;t added any items to your cart yet. Discover great products in our catalog.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-6"
                  onClick={() => {
                    closeCart();
                    router.push('/');
                  }}
                >
                  Start Shopping
                </Button>
              </div>
            ) : (
              <div>
                {items.map((item) => (
                  <CartItem
                    key={item.sku}
                    item={item}
                    onUpdateQuantity={updateQuantity}
                    onRemove={removeFromCart}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="border-t border-slate-100 bg-slate-50/50 p-6 space-y-4">
              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal</span>
                  <span className="font-medium text-slate-900">
                    {formatCurrency(cart?.subtotal || 0)}
                  </span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Estimated Shipping</span>
                  <span className="font-medium text-slate-900">
                    {cart?.estimatedShipping === 0 ? (
                      <span className="text-emerald-600 font-semibold">Free</span>
                    ) : (
                      formatCurrency(cart?.estimatedShipping || 10)
                    )}
                  </span>
                </div>
                <div className="flex justify-between pt-2 border-t border-slate-200 text-base font-bold text-slate-900">
                  <span>Total</span>
                  <span className="text-indigo-600">
                    {formatCurrency(cart?.total || 0)}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <Button
                  className="w-full flex items-center justify-center gap-2"
                  size="lg"
                  disabled={cart?.hasUnavailableItems}
                  onClick={handleCheckoutClick}
                >
                  Proceed to Checkout
                  <ArrowRight className="h-4 w-4" />
                </Button>

                <p className="text-center text-xs text-slate-500">
                  or{' '}
                  <button
                    type="button"
                    onClick={closeCart}
                    className="font-medium text-indigo-600 hover:text-indigo-500 underline"
                  >
                    continue shopping
                  </button>
                </p>
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
