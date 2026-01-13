import { Alert, Box, Container, Typography } from '@mui/material';
import React from 'react';

import { isAuthenticated } from '../api/auth';

type AuthGuardProps = {
  children: React.ReactNode;
};

export default function AuthGuard({ children }: AuthGuardProps) {
  if (!isAuthenticated()) {
    return (
      <Container maxWidth="sm" sx={{ mt: 8 }}>
        <Box sx={{ textAlign: 'center' }}>
          <Alert severity="error" sx={{ mb: 2 }}>
            <Typography variant="h6" component="div" gutterBottom>
              Authentication Required
            </Typography>
            <Typography variant="body2">
              You are not authenticated to access this website. Please ensure you have a valid authentication token.
            </Typography>
          </Alert>
        </Box>
      </Container>
    );
  }

  return <>{children}</>;
}
