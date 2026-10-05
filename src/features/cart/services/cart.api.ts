import { apiClient } from '@/lib/api/api-client';
import { CartSummary } from '../types/cart.types';

export const cartApi = {
  getCart: async (): Promise<CartSummary> => {
    const res = await apiClient<CartSummary>('/cart');
    return res.data;
  },

  addItem: async (productId: string, sku: string, quantity = 1): Promise<CartSummary> => {
    const res = await apiClient<CartSummary>('/cart/items', {
      method: 'POST',
      body: JSON.stringify({ productId, sku, quantity }),
    });
    return res.data;
  },

  updateQuantity: async (sku: string, quantity: number): Promise<CartSummary> => {
    const res = await apiClient<CartSummary>('/cart/items', {
      method: 'PATCH',
      body: JSON.stringify({ sku, quantity }),
    });
    return res.data;
  },

  removeItem: async (sku: string): Promise<CartSummary> => {
    const res = await apiClient<CartSummary>(`/cart/items/${encodeURIComponent(sku)}`, {
      method: 'DELETE',
    });
    return res.data;
  },

  clearCart: async (): Promise<CartSummary> => {
    const res = await apiClient<CartSummary>('/cart', {
      method: 'DELETE',
    });
    return res.data;
  },
};
