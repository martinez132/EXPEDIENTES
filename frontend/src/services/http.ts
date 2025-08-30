const BASE = import.meta.env.VITE_API_BASE_URL as string;

type HttpOptions = {
  method?: string;
  headers?: Record<string, string>;
  body?: any;
  auth?: boolean; // inyecta Authorization si true
};

export async function http(path: string, opts: HttpOptions = {}) {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(opts.headers || {}),
  };

  if (opts.auth) {
    const token = localStorage.getItem('token');
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE}${path}`, {
    method: opts.method || 'GET',
    headers,
    body: opts.body ? JSON.stringify(opts.body) : undefined,
  });

  if (res.status === 401 || res.status === 403) {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    if (!location.pathname.startsWith('/login')) location.href = '/login';
    throw new Error('Sesión expirada o sin permisos');
  }

  const text = await res.text();
  const data = text ? JSON.parse(text) : null;
  if (!res.ok) throw new Error(data?.message || data?.error || res.statusText);
  return data;
}
