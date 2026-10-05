import { Order, OrderStatus } from '@/features/orders/types/order.types';

export interface PopulatedUser {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
}

export interface AdminOrder extends Omit<Order, 'userId'> {
  userId: string | PopulatedUser;
}

export interface InventoryProduct {
  _id: string;
  title: string;
  slug: string;
  images?: { url: string }[];
  basePrice: number;
  salePrice?: number;
  brand: string;
}

export interface InventoryItem {
  _id: string;
  sku: string;
  productId: InventoryProduct;
  onHandStock: number;
  reservedStock: number;
  availableStock: number;
  lowStockThreshold: number;
  updatedAt: string;
}

export interface AdminMetrics {
  revenue: {
    total: number;
    aov: number;
  };
  orders: {
    total: number;
    statusBreakdown: Record<string, number>;
  };
  recentOrders: AdminOrder[];
  inventory: {
    lowStockCount: number;
    lowStockItems: InventoryItem[];
  };
}
