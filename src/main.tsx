import React from 'react';
import ReactDOM from 'react-dom/client';

import { CssBaseline, ThemeProvider } from '@mui/material';

import App from './App';
import { initializeAuthToken } from './api/auth';
import { ReactQueryProvider } from './api/queryClient';
import AuthErrorHandler from './components/AuthErrorHandler';
import theme from './theme';

// Initialize auth token from URL hash on app load
initializeAuthToken();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ReactQueryProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AuthErrorHandler>
          <App />
        </AuthErrorHandler>
      </ThemeProvider>
    </ReactQueryProvider>
  </React.StrictMode>
);
