import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import type { Database } from '@/integrations/supabase/types';

export type Product = Database['public']['Tables']['products']['Row'];
export type ProductCategory = Database['public']['Enums']['product_category'];

export type ProductSortOption = 'newest' | 'price-low' | 'price-high' | 'popularity' | 'rating';

export interface ProductFilters {
  category?: ProductCategory[];
  minPrice?: number;
  maxPrice?: number;
  colors?: string[];
  search?: string;
  sort?: ProductSortOption;
}

export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('fr-BI', {
    style: 'decimal',
    minimumFractionDigits: 0,
  }).format(price) + ' BIF';
};

export const useProducts = () => {
  return useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('in_stock', true)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });
};

export const useFilteredProducts = (filters: ProductFilters) => {
  return useQuery({
    queryKey: ['products', 'filtered', filters],
    queryFn: async () => {
      let query = supabase
        .from('products')
        .select('*')
        .eq('in_stock', true);

      // Apply Filters
      if (filters.category && filters.category.length > 0) {
        query = query.in('category', filters.category);
      }

      if (filters.minPrice !== undefined) {
        query = query.gte('price', filters.minPrice);
      }

      if (filters.maxPrice !== undefined) {
        query = query.lte('price', filters.maxPrice);
      }

      if (filters.colors && filters.colors.length > 0) {
        // This is a simple array overlap check using Postgres' && operator (overlaps)
        // formatted for Supabase as .ov('colors', filters.colors) if available or using plain text filter
        // Since Supabase JS client wraps PostgREST, we use .contains for array columns
        query = query.contains('colors', filters.colors);
      }

      if (filters.search) {
        query = query.ilike('name', `%${filters.search}%`);
      }

      // Apply Sorting
      switch (filters.sort) {
        case 'price-low':
          query = query.order('price', { ascending: true });
          break;
        case 'price-high':
          query = query.order('price', { ascending: false });
          break;
        case 'popularity':
          query = query.order('popularity', { ascending: false });
          break;
        case 'rating':
          query = query.order('rating', { ascending: false });
          break;
        case 'newest':
        default:
          query = query.order('created_at', { ascending: false });
          break;
      }

      const { data, error } = await query;
      
      if (error) throw error;
      return data;
    },
  });
};

export const useProductsByCategory = (category: ProductCategory) => {
  return useQuery({
    queryKey: ['products', category],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('category', category)
        .eq('in_stock', true)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });
};

export const useFeaturedProducts = () => {
  return useQuery({
    queryKey: ['products', 'featured'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('featured', true)
        .eq('in_stock', true)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });
};

export const useProduct = (id: string) => {
  return useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .maybeSingle();
      
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });
};