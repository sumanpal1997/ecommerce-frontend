export interface EnrichedCartItem {
  productId: string;
  sku: string;
  title: string;
  slug: string;
  image: string;
  unitPrice: number;
  quantity: number;
  subtotal: number;
  isAvailable: boolean;
  availableStock: number;
}

export interface CartSummary {
  items: EnrichedCartItem[];
  itemCount: number;
  subtotal: number;
  estimatedShipping: number;
  total: number;
  hasUnavailableItems: boolean;
}
