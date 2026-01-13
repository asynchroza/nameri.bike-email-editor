import { Alert, Box, Container, Typography } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import React, { useState, useEffect } from 'react';

import { AuthenticationError } from '../api/client';
import { setGlobalAuthErrorHandler } from '../api/queryClient';

type AuthErrorHandlerProps = {
  children: React.ReactNode;
};

export default function AuthErrorHandler({ children }: AuthErrorHandlerProps) {
  const [authError, setAuthError] = useState<string | null>(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    // Register global error handler
    setGlobalAuthErrorHandler((error: string) => {
      setAuthError(error);
    });

    // Also check for errors in existing queries and mutations
    const checkForErrors = () => {
      // Check all queries for authentication errors
      const queries = queryClient.getQueryCache().getAll();
      for (const query of queries) {
        if (query.state.error instanceof AuthenticationError) {
          setAuthError(query.state.error.message);
          return;
        }
      }

      // Check all mutations for authentication errors
      const mutations = queryClient.getMutationCache().getAll();
      for (const mutation of mutations) {
        if (mutation.state.error instanceof AuthenticationError) {
          setAuthError(mutation.state.error.message);
          return;
        }
      }
    };

    // Check immediately
    checkForErrors();

    // Subscribe to query cache updates
    const unsubscribeQueries = queryClient.getQueryCache().subscribe((event) => {
      if (event?.type === 'updated') {
        const query = event.query;
        if (query?.state?.error instanceof AuthenticationError) {
          setAuthError(query.state.error.message);
        }
      }
    });

    // Subscribe to mutation cache updates
    const unsubscribeMutations = queryClient.getMutationCache().subscribe((event) => {
      if (event?.type === 'updated') {
        const mutation = event.mutation;
        if (mutation?.state?.error instanceof AuthenticationError) {
          setAuthError(mutation.state.error.message);
        }
      }
    });

    return () => {
      unsubscribeQueries();
      unsubscribeMutations();
    };
  }, [queryClient]);

  if (authError) {
    return (
      <Box
        sx={{
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          px: 2,
        }}
      >
        <Container maxWidth="sm">
          <Alert severity="error">
            <Typography variant="h6" component="div" gutterBottom>
              Authentication Required
            </Typography>
            <Typography variant="body2">{authError}</Typography>
          </Alert>
        </Container>
      </Box>
    );
  }

  return <>{children}</>;
}
