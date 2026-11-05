const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:8080/api';
const TOKEN_KEY = 'timebank.token';

export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

export const tokenStore = {
  get: () => window.localStorage.getItem(TOKEN_KEY),
  set: (token: string) => window.localStorage.setItem(TOKEN_KEY, token),
  clear: () => window.localStorage.removeItem(TOKEN_KEY),
};

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: unknown;
}

export async function apiRequest<T>(path: string, { method = 'GET', body }: RequestOptions = {}): Promise<T> {
  const headers: Record<string, string> = { Accept: 'application/json' };
  if (body !== undefined) headers['Content-Type'] = 'application/json';
  const token = tokenStore.get();
  if (token) headers.Authorization = `Bearer ${token}`;

  let response: Response;
  try {
    response = await fetch(`${API_BASE}${path}`, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch {
    throw new ApiError(0, 'Cannot reach the TimeBank server. Start the Java backend on port 8080 and try again.');
  }

  if (response.status === 204) return undefined as T;

  const data = await response.json().catch(() => null);
  if (!response.ok) {
    if (response.status === 401 && token) tokenStore.clear();
    const message = data && typeof data.error === 'string' ? data.error : 'Something went wrong. Please try again.';
    throw new ApiError(response.status, message);
  }
  return data as T;
}
