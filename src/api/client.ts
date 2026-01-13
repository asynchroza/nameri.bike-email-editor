// Custom error class for authentication errors
export class AuthenticationError extends Error {
  constructor(message: string = 'Authentication required') {
    super(message);
    this.name = 'AuthenticationError';
  }
}

const getApiUrl = (): string => {
  const url = import.meta.env.VITE_API_URL;
  if (!url) {
    throw new Error('VITE_API_URL environment variable is not set');
  }
  return url;
};

export type ApiRequestOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  body?: unknown;
  headers?: Record<string, string>;
};

export async function apiRequest<T>(
  endpoint: string,
  options: ApiRequestOptions = {}
): Promise<T> {
  const { method = 'GET', body, headers = {} } = options;
  const url = `${getApiUrl()}${endpoint}`;

  // Cookies (including better-auth.session_token) are automatically sent with requests
  // No need to manually add Authorization header
  const requestOptions: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    credentials: 'include', // Ensure cookies are sent with cross-origin requests
  };

  if (body) {
    requestOptions.body = JSON.stringify(body);
  }

  const response = await fetch(url, requestOptions);

  if (!response.ok) {
    // Throw AuthenticationError for 401 and 403 responses
    if (response.status === 401 || response.status === 403) {
      throw new AuthenticationError('You are not authenticated or authorized to access this website. Please ensure you have a valid authentication token.');
    }
    throw new Error(`API request failed: ${response.statusText}`);
  }

  return response.json() as Promise<T>;
}
