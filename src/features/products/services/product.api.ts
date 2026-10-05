import { apiClient } from '@/lib/api/api-client';
import { CategoryTreeNode, Product, TrieSuggestion } from '../types/product.types';

export const productApi = {
  getProducts: async (
    params: Record<string, string | number | undefined> = {},
  ): Promise<{ items: Product[]; meta?: unknown }> => {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        searchParams.set(key, String(value));
      }
    });

    const queryString = searchParams.toString() ? `?${searchParams.toString()}` : '';
    const res = await apiClient<Product[]>(`/products${queryString}`);

    return {
      items: res.data || [],
      meta: res.meta,
    };
  },

  getProductBySlug: async (slug: string): Promise<Product> => {
    const res = await apiClient<{ product: Product }>(`/products/slug/${slug}`);
    return res.data.product;
  },

  getCategories: async (): Promise<CategoryTreeNode[]> => {
    const res = await apiClient<{ tree: CategoryTreeNode[] }>('/categories');
    return res.data.tree || [];
  },

  getAutocomplete: async (query: string): Promise<TrieSuggestion[]> => {
    if (!query || query.trim().length === 0) return [];
    const res = await apiClient<{ suggestions: TrieSuggestion[] }>(
      `/products/autocomplete?q=${encodeURIComponent(query.trim())}`,
    );
    return res.data.suggestions || [];
  },
};
