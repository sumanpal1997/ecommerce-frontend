'use client';

import React, { createContext, useContext, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { cartApi } from '../services/cart.api';
import { CartSummary } from '../types/cart.types';

interface CartContextType {
  cart: CartSummary | undefined;
  isLoading: boolean;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addToCart: (productId: string, sku: string, quantity?: number) => Promise<void>;
  updateQuantity: (sku: string, quantity: number) => Promise<void>;
  removeFromCart: (sku: string) => Promise<void>;
  clearCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: cart, isLoading } = useQuery<CartSummary>({
    queryKey: ['cart'],
    queryFn: cartApi.getCart,
  });

  const addMutation = useMutation({
    mutationFn: ({ productId, sku, quantity }: { productId: string; sku: string; quantity: number }) =>
      cartApi.addItem(productId, sku, quantity),
    onSuccess: (updatedCart) => {
      queryClient.setQueryData(['cart'], updatedCart);
      setIsOpen(true); // Automatically open drawer upon adding an item
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ sku, quantity }: { sku: string; quantity: number }) =>
      cartApi.updateQuantity(sku, quantity),
    onSuccess: (updatedCart) => {
      queryClient.setQueryData(['cart'], updatedCart);
    },
  });

  const removeMutation = useMutation({
    mutationFn: (sku: string) => cartApi.removeItem(sku),
    onSuccess: (updatedCart) => {
      queryClient.setQueryData(['cart'], updatedCart);
    },
  });

  const clearMutation = useMutation({
    mutationFn: cartApi.clearCart,
    onSuccess: (updatedCart) => {
      queryClient.setQueryData(['cart'], updatedCart);
    },
  });

  const addToCart = async (productId: string, sku: string, quantity = 1) => {
    await addMutation.mutateAsync({ productId, sku, quantity });
  };

  const updateQuantity = async (sku: string, quantity: number) => {
    await updateMutation.mutateAsync({ sku, quantity });
  };

  const removeFromCart = async (sku: string) => {
    await removeMutation.mutateAsync(sku);
  };

  const clearCart = async () => {
    await clearMutation.mutateAsync();
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        isLoading,
        isOpen,
        openCart: () => setIsOpen(true),
        closeCart: () => setIsOpen(false),
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
