const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('sports_token');
}

async function request<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: 'Errore di rete' }));
    throw new Error(error.message || 'Errore sconosciuto');
  }

  return res.json();
}

// ─── Auth ────────────────────────────────────────────────────

export interface AuthResponse {
  token: string;
  user: { id: string; email: string; name: string };
}

export const auth = {
  register: (data: { email: string; password: string; name: string }) =>
    request<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  login: (data: { email: string; password: string }) =>
    request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  me: () => request<{ id: string; email: string; name: string }>('/auth/me'),
};

// ─── Events ──────────────────────────────────────────────────

export type Sport = 'F1' | 'FOOTBALL' | 'NBA';

export interface SportEvent {
  id: string;
  title: string;
  sport: Sport;
  startDate: string;
  endDate?: string;
  description?: string;
  venue?: string;
  isSubscribed?: boolean;
  metadata?: Record<string, unknown>;
}

export const events = {
  list: (params?: { sport?: Sport; from?: string; to?: string }) => {
    const qs = params
      ? '?' + new URLSearchParams(params as Record<string, string>).toString()
      : '';
    return request<SportEvent[]>(`/events${qs}`);
  },

  get: (id: string) => request<SportEvent>(`/events/${id}`),

  subscribe: (id: string) =>
    request(`/events/${id}/subscribe`, { method: 'POST' }),

  unsubscribe: (id: string) =>
    request(`/events/${id}/unsubscribe`, { method: 'DELETE' }),

  myEvents: () => request<{ event: SportEvent }[]>('/events/user/my-events'),
};

// ─── Sports Sync ─────────────────────────────────────────────

export const sports = {
  syncAll: () => request('/sports/sync', { method: 'POST' }),
  syncF1: () => request('/sports/sync/f1', { method: 'POST' }),
  syncFootball: () => request('/sports/sync/football', { method: 'POST' }),
  syncNba: () => request('/sports/sync/nba', { method: 'POST' }),
};
