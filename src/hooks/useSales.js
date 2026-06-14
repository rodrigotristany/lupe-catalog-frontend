import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getSales, createSale } from '../api/admin';

export function useSales(filters = {}) {
  return useQuery({
    queryKey: ['admin', 'sales', filters],
    queryFn: () => getSales(filters),
    staleTime: 10_000,
  });
}

export function useCreateSale() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createSale,
    onSuccess: () => queryClient.removeQueries({ queryKey: ['admin', 'sales'] }),
  });
}
