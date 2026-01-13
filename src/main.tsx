import React from 'react';
import ReactDOM from 'react-dom/client';

import { CssBaseline, ThemeProvider } from '@mui/material';

import App from './App';
import { initializeAuthToken } from './api/auth';
import { ReactQueryProvider } from './api/queryClient';
import AuthGuard from './components/AuthGuard';
import theme from './theme';

// Initialize auth token from URL hash on app load
initializeAuthToken();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ReactQueryProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AuthGuard>
          <App />
        </AuthGuard>
      </ThemeProvider>
    </ReactQueryProvider>
  </React.StrictMode>
);
