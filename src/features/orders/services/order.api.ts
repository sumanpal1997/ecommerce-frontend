import { apiClient } from '@/lib/api/api-client';
import {
  CheckoutPayload,
  CheckoutResponseData,
  Order,
} from '../types/order.types';

export const orderApi = {
  checkout: async (payload: CheckoutPayload): Promise<CheckoutResponseData> => {
    const res = await apiClient<CheckoutResponseData>('/orders/checkout', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    return res.data;
  },

  getMyOrders: async (page = 1, limit = 10): Promise<{ orders: Order[]; meta?: unknown }> => {
    const res = await apiClient<Order[]>(`/orders/me?page=${page}&limit=${limit}`);
    return {
      orders: res.data || [],
      meta: res.meta,
    };
  },

  getOrderById: async (orderId: string): Promise<Order> => {
    const res = await apiClient<{ order: Order }>(`/orders/${orderId}`);
    return res.data.order;
  },

  simulatePaymentSuccess: async (orderId: string, transactionId: string): Promise<void> => {
    await apiClient('/payments/webhook', {
      method: 'POST',
      body: JSON.stringify({
        orderId,
        transactionId,
        status: 'SUCCEEDED',
      }),
    });
  },
};
