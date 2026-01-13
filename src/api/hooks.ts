import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { apiRequest } from './client';

// Example: How to use React Query with the API client
// Replace these with your actual API endpoints and types

// Example query hook
export function useExampleQuery(id: string) {
  return useQuery({
    queryKey: ['example', id],
    queryFn: () => apiRequest<{ id: string; name: string }>(`/api/example/${id}`),
  });
}

// Example mutation hook
export function useExampleMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { name: string }) =>
      apiRequest<{ id: string; name: string }>('/api/example', {
        method: 'POST',
        body: data,
      }),
    onSuccess: () => {
      // Invalidate and refetch queries after mutation
      queryClient.invalidateQueries({ queryKey: ['example'] });
    },
  });
}
