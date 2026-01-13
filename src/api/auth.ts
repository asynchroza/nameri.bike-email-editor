// Token management - reads from URL hash on initial load and sets as cookie
// Format: #token=encoded_token_value
// Cookie name: better-auth.session_token

const COOKIE_NAME = 'better-auth.session_token';

/**
 * Set a cookie with the given name, value, and options
 */
function setCookie(name: string, value: string, days: number = 365): void {
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
}

/**
 * Get a cookie value by name
 */
function getCookie(name: string): string | null {
  const nameEQ = `${name}=`;
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}

/**
 * Initialize auth token from URL hash on page load
 * Sets the token as a cookie named 'better-auth.session_token'
 * Should be called once when the app starts
 */
export function initializeAuthToken(): void {
  const hash = window.location.hash;
  
  if (hash.startsWith('#token=')) {
    const token = decodeURIComponent(hash.substring(7)); // Remove '#token='
    
    // Set token as cookie
    setCookie(COOKIE_NAME, token);
    
    // Clear the hash from URL for security (token is now in cookie)
    window.history.replaceState(null, '', window.location.pathname + window.location.search);
  }
}

/**
 * Get the current auth token from cookie
 */
export function getAuthToken(): string | null {
  return getCookie(COOKIE_NAME);
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
  const token = getCookie(COOKIE_NAME);
  return token !== null && token.length > 0;
}
