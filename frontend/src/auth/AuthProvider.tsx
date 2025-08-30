import { useEffect, useMemo, useState } from 'react';
import { AuthContext } from './AuthContext';
import { login as apiLogin, type User } from '../services/auth.api';

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const t = localStorage.getItem('token');
    const u = localStorage.getItem('user');
    if (t && u) { setToken(t); try { setUser(JSON.parse(u)); } catch {} }
  }, []);

  async function login(username: string, password: string) {
    const { token, user } = await apiLogin({ username, password });
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    setToken(token); setUser(user);
    location.href = '/'; // redirige al inicio
  }

  function logout() {
    localStorage.removeItem('token'); localStorage.removeItem('user');
    setToken(null); setUser(null);
    location.href = '/login';
  }

  const value = useMemo(() => ({ user, token, login, logout }), [user, token]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

