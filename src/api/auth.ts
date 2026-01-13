// Token management - reads from URL hash on initial load
// Format: #token=encoded_token_value

let authToken: string | null = null;

/**
 * Initialize auth token from URL hash on page load
 * Should be called once when the app starts
 */
export function initializeAuthToken(): void {
  const hash = window.location.hash;
  
  if (hash.startsWith('#token=')) {
    const token = hash.substring(7); // Remove '#token='
    authToken = decodeURIComponent(token);
    
    // Clear the hash from URL for security (token is now in memory)
    window.history.replaceState(null, '', window.location.pathname + window.location.search);
  }
}

/**
 * Get the current auth token
 */
export function getAuthToken(): string | null {
  return authToken;
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
  return authToken !== null && authToken.length > 0;
}
