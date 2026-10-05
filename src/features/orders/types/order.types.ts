export interface ShippingAddress {
  fullName: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
}

export interface OrderItemSnapshot {
  productId: string;
  sku: string;
  title: string;
  unitPrice: number;
  quantity: number;
  subtotal: number;
  image?: string;
}

export interface OrderPricing {
  itemsSubtotal?: number;
  subtotal?: number;
  shippingFee: number;
  taxAmount?: number;
  tax?: number;
  totalAmount: number;
}

export type OrderStatus =
  | 'PENDING_PAYMENT'
  | 'PAID'
  | 'PROCESSING'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'CANCELLED'
  | 'REFUNDED';

export interface Order {
  _id: string;
  orderNumber: string;
  userId: string;
  items: OrderItemSnapshot[];
  pricing: OrderPricing;
  shippingAddress: ShippingAddress;
  status: OrderStatus;
  trackingNumber?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CheckoutPayload {
  shippingAddress: ShippingAddress;
  idempotencyKey?: string;
}

export interface CheckoutResponseData {
  order: Order;
  paymentIntent: {
    clientSecret: string;
    transactionId: string;
    status: string;
    orderId: string;
    amount: number;
  };
}
