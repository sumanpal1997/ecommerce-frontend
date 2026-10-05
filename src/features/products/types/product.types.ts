export interface ProductImage {
  url: string;
  alt?: string;
  isPrimary?: boolean;
}

export interface Product {
  _id: string;
  title: string;
  slug: string;
  description: string;
  brand: string;
  categoryId: {
    _id?: string;
    id?: string;
    name: string;
    slug: string;
  };
  sku: string;
  basePrice: number;
  salePrice?: number;
  images: ProductImage[];
  attributes: Record<string, string>;
  status: 'DRAFT' | 'ACTIVE' | 'ARCHIVED';
  ratingAverage: number;
  ratingCount: number;
  createdAt: string;
}

export interface CategoryTreeNode {
  id: string;
  name: string;
  slug: string;
  description?: string;
  parentId: string | null;
  level: number;
  children: CategoryTreeNode[];
}

export interface TrieSuggestion {
  term: string;
  slug?: string;
  score?: number;
}
