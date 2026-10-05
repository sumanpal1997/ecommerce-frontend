export class ApiError extends Error {
  public readonly code: string;
  public readonly status: number;
  public readonly details?: unknown;

  constructor(message: string, status: number, code: string, details?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

export interface ApiResponseEnvelope<T> {
  success: boolean;
  data: T;
  message?: string;
  meta?: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
}

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  (process.env.NODE_ENV === 'production'
    ? 'https://ecommerce-backend-jjno.onrender.com/api/v1'
    : 'http://localhost:5000/api/v1');

// In-Memory Access Token Storage (Never in LocalStorage to neutralize XSS theft!)
let inMemoryAccessToken: string | null = null;

export const setAccessToken = (token: string | null): void => {
  inMemoryAccessToken = token;
};

export const getAccessToken = (): string | null => {
  return inMemoryAccessToken;
};

// Guest ID helper for anonymous carts
export const getOrCreateGuestId = (): string => {
  if (typeof window === 'undefined') return '';
  let guestId = localStorage.getItem('guest_id');
  if (!guestId) {
    guestId = 'guest_' + Math.random().toString(36).substring(2, 15);
    localStorage.setItem('guest_id', guestId);
  }
  return guestId;
};

let isRefreshing = false;
let refreshSubscribers: ((token: string | null) => void)[] = [];

const onRefreshed = (token: string | null) => {
  refreshSubscribers.forEach((cb) => cb(token));
  refreshSubscribers = [];
};

/**
 * Universal type-safe fetch client with:
 * - Credentials forwarding (for HttpOnly refresh cookies)
 * - Bearer authorization header injection
 * - Automated 401 token refresh queue
 * - Standardized response envelope unpacking
 */
export async function apiClient<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<ApiResponseEnvelope<T>> {
  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;

  const headers = new Headers(options.headers || {});
  headers.set('Content-Type', 'application/json');

  const guestId = getOrCreateGuestId();
  if (guestId) {
    headers.set('X-Guest-Id', guestId);
  }

  const token = getAccessToken();
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const config: RequestInit = {
    ...options,
    headers,
    credentials: 'include', // Essential: transports HttpOnly refresh cookies cross-origin
  };

  let response: Response;
  try {
    response = await fetch(url, config);
  } catch (networkError) {
    throw new ApiError(
      'Unable to connect to the server. Please check your internet connection.',
      0,
      'NETWORK_ERROR',
      networkError,
    );
  }

  // Intercept 401 Unauthorized: Attempt token refresh (except when calling auth routes)
  if (response.status === 401 && !endpoint.includes('/auth/login') && !endpoint.includes('/auth/refresh')) {
    if (!isRefreshing) {
      isRefreshing = true;
      try {
        const refreshResponse = await fetch(`${API_BASE_URL}/auth/refresh`, {
          method: 'POST',
          credentials: 'include',
        });

        if (refreshResponse.ok) {
          const json: ApiResponseEnvelope<{ accessToken: string }> = await refreshResponse.json();
          setAccessToken(json.data.accessToken);
          onRefreshed(json.data.accessToken);
        } else {
          setAccessToken(null);
          onRefreshed(null);
        }
      } catch {
        setAccessToken(null);
        onRefreshed(null);
      } finally {
        isRefreshing = false;
      }
    }

    // Wait for the in-flight refresh to finish and retry request with new token
    const retryToken = await new Promise<string | null>((resolve) => {
      refreshSubscribers.push(resolve);
    });

    if (retryToken) {
      headers.set('Authorization', `Bearer ${retryToken}`);
      return apiClient<T>(endpoint, { ...options, headers });
    }
  }

  const responseJson: ApiResponseEnvelope<T> = await response.json().catch(() => ({
    success: false,
    data: null as unknown as T,
    error: {
      code: 'INVALID_JSON_RESPONSE',
      message: 'Server returned a non-JSON payload',
    },
  }));

  if (!response.ok || !responseJson.success) {
    throw new ApiError(
      responseJson.error?.message || response.statusText || 'An unexpected error occurred',
      response.status,
      responseJson.error?.code || 'UNKNOWN_ERROR',
      responseJson.error?.details,
    );
  }

  return responseJson;
}
