import { getSession } from 'next-auth/react';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

async function request(path, options = {}) {
  let token = null;
  if (typeof window !== 'undefined') {
    const session = await getSession();
    token = session?.accessToken || null;
  }

  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
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

export const auth = {
  register: (data) =>
    request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  login: (data) =>
    request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  me: () => request('/auth/me'),
};

// ─── Events ──────────────────────────────────────────────────

export const events = {
  list: (params) => {
    const qs = params
      ? `?${new URLSearchParams(params).toString()}`
      : '';
    return request(`/events${qs}`);
  },

  get: (id) => request(`/events/${id}`),

  subscribe: (id) =>
    request(`/events/${id}/subscribe`, { method: 'POST' }),

  unsubscribe: (id) =>
    request(`/events/${id}/unsubscribe`, { method: 'DELETE' }),

  myEvents: () => request('/events/user/my-events'),
};

// ─── Sports Sync ─────────────────────────────────────────────

export const sports = {
  syncAll: () => request('/sports/sync', { method: 'POST' }),
  syncF1: () => request('/sports/sync/f1', { method: 'POST' }),
  syncFootball: () => request('/sports/sync/football', { method: 'POST' }),
  syncNba: () => request('/sports/sync/nba', { method: 'POST' }),
};
