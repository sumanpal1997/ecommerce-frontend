'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Image from 'next/image';
import Link from 'next/link';
import {
  ShieldCheck,
  Lock,
  ArrowRight,
  AlertCircle,
  Truck,
  CreditCard,
} from 'lucide-react';
import { checkoutShippingSchema, CheckoutShippingFormData } from '../schemas/checkout.schema';
import { orderApi } from '../services/order.api';
import { useCart } from '@/features/cart/context/cart-context';
import { useAuth } from '@/features/auth/context/auth-context';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { formatCurrency } from '@/lib/utils/cn';
import { useQueryClient } from '@tanstack/react-query';

export function CheckoutForm() {
  const { cart, isLoading: isCartLoading } = useCart();
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();

  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutShippingFormData>({
    resolver: zodResolver(checkoutShippingSchema),
    defaultValues: {
      fullName: '',
      street: '',
      city: '',
      state: '',
      postalCode: '',
      country: 'United States',
      phone: '',
    },
  });

  const onSubmit = async (data: CheckoutShippingFormData) => {
    if (!cart || cart.items.length === 0) return;
    setIsSubmitting(true);
    setServerError(null);

    try {
      // Idempotency key generated per submission to prevent double-charges
      const idempotencyKey =
        typeof crypto !== 'undefined' && crypto.randomUUID
          ? crypto.randomUUID()
          : `idemp_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;

      const result = await orderApi.checkout({
        shippingAddress: data,
        idempotencyKey,
      });

      // Cart is emptied on backend; synchronize client state
      queryClient.invalidateQueries({ queryKey: ['cart'] });

      // Navigate to order details / confirmation page
      router.push(`/orders/${result.order._id}`);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setServerError(err.message);
      } else {
        setServerError('An unexpected error occurred while placing your order.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isAuthLoading || isCartLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="mx-auto max-w-lg py-12 px-4 text-center">
        <Card className="p-8 space-y-4">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
            <Lock className="h-6 w-6" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">
            Authentication Required
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            Please sign in or create an account to finalize your order. Your cart items will be securely preserved.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Link href="/login" className="flex-1">
              <Button className="w-full">Sign In to Continue</Button>
            </Link>
            <Link href="/register" className="flex-1">
              <Button variant="outline" className="w-full">
                Create Account
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="mx-auto max-w-lg py-16 px-4 text-center">
        <div className="rounded-full bg-slate-100 p-4 mx-auto w-16 h-16 flex items-center justify-center text-slate-400 mb-4">
          <Truck className="h-8 w-8 stroke-[1.5]" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Your Cart is Empty</h2>
        <p className="mt-2 text-sm text-slate-500">
          You don&apos;t have any items to checkout. Explore our catalog to find what you need.
        </p>
        <Link href="/" className="inline-block mt-6">
          <Button>Explore Products</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          Checkout
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Provide your shipping details to complete your order.
        </p>
      </div>

      {serverError && (
        <div className="mb-6 flex items-center gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800">
          <AlertCircle className="h-5 w-5 shrink-0 text-rose-600" />
          <span>{serverError}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Shipping Information Form */}
        <div className="lg:col-span-7">
          <Card>
            <CardHeader className="border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2">
                <Truck className="h-5 w-5 text-indigo-600" />
                <h2 className="text-base font-semibold text-slate-900">
                  Shipping Destination
                </h2>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <form id="checkout-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <Input
                  label="Full Name"
                  placeholder="Jane Doe"
                  error={errors.fullName?.message}
                  {...register('fullName')}
                />

                <Input
                  label="Street Address"
                  placeholder="123 Market Street, Apt 4B"
                  error={errors.street?.message}
                  {...register('street')}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="City"
                    placeholder="San Francisco"
                    error={errors.city?.message}
                    {...register('city')}
                  />
                  <Input
                    label="State / Province"
                    placeholder="CA"
                    error={errors.state?.message}
                    {...register('state')}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Postal / Zip Code"
                    placeholder="94105"
                    error={errors.postalCode?.message}
                    {...register('postalCode')}
                  />
                  <Input
                    label="Country"
                    placeholder="United States"
                    error={errors.country?.message}
                    {...register('country')}
                  />
                </div>

                <Input
                  label="Phone Number"
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  helperText="Required for delivery tracking updates"
                  error={errors.phone?.message}
                  {...register('phone')}
                />
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Order Review Column */}
        <div className="lg:col-span-5 space-y-6">
          <Card>
            <CardHeader className="border-b border-slate-100 pb-4">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-semibold text-slate-900">
                  Order Summary
                </h2>
                <span className="text-xs text-slate-500">
                  {cart.itemCount} {cart.itemCount === 1 ? 'item' : 'items'}
                </span>
              </div>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              {/* Item thumbnails */}
              <div className="max-h-60 overflow-y-auto divide-y divide-slate-100 pr-1">
                {cart.items.map((item) => (
                  <div key={item.sku} className="flex items-center gap-3 py-3">
                    <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-md bg-slate-100 border border-slate-200">
                      <Image
                        src={
                          item.image ||
                          'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100&auto=format&fit=crop&q=80'
                        }
                        alt={item.title}
                        fill
                        sizes="56px"
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-slate-800 truncate">
                        {item.title}
                      </p>
                      <p className="text-[11px] text-slate-500">
                        Qty: {item.quantity} × {formatCurrency(item.unitPrice)}
                      </p>
                    </div>
                    <div className="text-xs font-semibold text-slate-900">
                      {formatCurrency(item.subtotal)}
                    </div>
                  </div>
                ))}
              </div>

              {/* Price Calculation */}
              <div className="border-t border-slate-100 pt-4 space-y-2 text-sm">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal</span>
                  <span className="font-medium text-slate-900">
                    {formatCurrency(cart.subtotal)}
                  </span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Shipping</span>
                  <span className="font-medium text-slate-900">
                    {cart.estimatedShipping === 0 ? (
                      <span className="text-emerald-600 font-semibold">Free</span>
                    ) : (
                      formatCurrency(cart.estimatedShipping)
                    )}
                  </span>
                </div>
                <div className="flex justify-between border-t border-slate-200 pt-3 text-base font-bold text-slate-900">
                  <span>Total Amount</span>
                  <span className="text-indigo-600">
                    {formatCurrency(cart.total)}
                  </span>
                </div>
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  form="checkout-form"
                  className="w-full flex items-center justify-center gap-2"
                  size="lg"
                  isLoading={isSubmitting}
                  disabled={cart.hasUnavailableItems}
                >
                  <CreditCard className="h-4 w-4" />
                  Place Order ({formatCurrency(cart.total)})
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>

              {/* Concurrency & Security Guarantee */}
              <div className="rounded-lg bg-indigo-50/60 p-3 text-[11px] text-indigo-900 border border-indigo-100 flex items-start gap-2">
                <ShieldCheck className="h-4 w-4 shrink-0 text-indigo-600 mt-0.5" />
                <span>
                  <strong>15-Minute Reservation:</strong> Inventory is atomically reserved in our database upon placing this order to prevent overselling.
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
