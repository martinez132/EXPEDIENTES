import { createContext } from 'react';
import type { User } from '../services/auth.api';

export type AuthState = {
  user: User | null;
  token: string | null;
  login: (u: string, p: string) => Promise<void>;
  logout: () => void;
};

export const AuthContext = createContext<AuthState>({
  user: null, token: null, login: async () => {}, logout: () => {}
});
