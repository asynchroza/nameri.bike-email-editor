import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react';

import { AuthenticationError } from './client';

// Global error handler to catch authentication errors
let globalAuthErrorHandler: ((error: string) => void) | null = null;

export function setGlobalAuthErrorHandler(handler: (error: string) => void) {
  globalAuthErrorHandler = handler;
}

export function ReactQueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 5 * 1000, // 5 seconds
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  // Subscribe to query cache updates to catch errors
  useEffect(() => {
    const unsubscribeQueries = queryClient.getQueryCache().subscribe((event) => {
      if (event?.type === 'updated') {
        const query = event.query;
        if (query?.state?.error) {
          const error = query.state.error;
          if (error instanceof AuthenticationError) {
            globalAuthErrorHandler?.(error.message);
          }
        }
      }
    });

    // Subscribe to mutation cache updates to catch errors
    const unsubscribeMutations = queryClient.getMutationCache().subscribe((event) => {
      if (event?.type === 'updated') {
        const mutation = event.mutation;
        if (mutation?.state?.error) {
          const error = mutation.state.error;
          if (error instanceof AuthenticationError) {
            globalAuthErrorHandler?.(error.message);
          }
        }
      }
    });

    return () => {
      unsubscribeQueries();
      unsubscribeMutations();
    };
  }, [queryClient]);

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
