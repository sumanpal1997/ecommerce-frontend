import { apiClient } from '@/lib/api/api-client';
import { AdminMetrics, AdminOrder, InventoryItem } from '../types/admin.types';
import { OrderStatus } from '@/features/orders/types/order.types';
import { Product } from '@/features/products/types/product.types';

export const adminApi = {
  getMetrics: async (): Promise<AdminMetrics> => {
    const res = await apiClient<AdminMetrics>('/orders/admin/metrics');
    return res.data;
  },

  getAllOrders: async (
    status?: string,
    page = 1,
    limit = 20,
  ): Promise<{ orders: AdminOrder[]; meta?: unknown }> => {
    const params = new URLSearchParams();
    if (status && status !== 'ALL') params.set('status', status);
    params.set('page', String(page));
    params.set('limit', String(limit));

    const res = await apiClient<AdminOrder[]>(`/orders?${params.toString()}`);
    return {
      orders: res.data || [],
      meta: res.meta,
    };
  },

  updateOrderStatus: async (
    orderId: string,
    status: OrderStatus,
    trackingNumber?: string,
  ): Promise<AdminOrder> => {
    const res = await apiClient<{ order: AdminOrder }>(`/orders/${orderId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status, trackingNumber }),
    });
    return res.data.order;
  },

  getAllInventory: async (): Promise<InventoryItem[]> => {
    const res = await apiClient<{ items: InventoryItem[] }>('/inventory');
    return res.data.items || [];
  },

  adjustStock: async (
    sku: string,
    quantityDelta: number,
    reason: string = 'Manual warehouse adjustment',
  ): Promise<InventoryItem> => {
    const res = await apiClient<{ inventory: InventoryItem }>('/inventory/adjust', {
      method: 'POST',
      body: JSON.stringify({ sku, quantityDelta, reason }),
    });
    return res.data.inventory;
  },

  getLowStockAlerts: async (): Promise<InventoryItem[]> => {
    const res = await apiClient<{ items: InventoryItem[] }>('/inventory/alerts/low-stock');
    return res.data.items || [];
  },

  createProduct: async (payload: CreateProductPayload): Promise<Product> => {
    const res = await apiClient<{ product: Product }>('/products', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    return res.data.product;
  },
};

export interface CreateProductPayload {
  title: string;
  slug?: string;
  description: string;
  brand: string;
  categoryId: string;
  sku: string;
  basePrice: number;
  salePrice?: number;
  images: { url: string; alt?: string; isPrimary?: boolean }[];
  initialStock?: number;
  attributes?: Record<string, string>;
  status?: 'DRAFT' | 'ACTIVE' | 'ARCHIVED';
}
