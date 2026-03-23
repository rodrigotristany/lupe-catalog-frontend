import { useQuery } from '@tanstack/react-query';
import { getAdminProducts, getProductHistory } from '../api/admin';

export function useAdminProducts(filters = {}) {
  return useQuery({
    queryKey: ['admin', 'products', filters],
    queryFn: () => getAdminProducts(filters),
    staleTime: 10_000,
  });
}

export function useProductHistory(id) {
  return useQuery({
    queryKey: ['admin', 'product-history', id],
    queryFn: () => getProductHistory(id),
    staleTime: 30_000,
    enabled: !!id,
  });
}
