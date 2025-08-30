import { http } from './http';

export type LoginBody = { username: string; password: string };
export type User = { id: number; username: string; rol: 'tecnico'|'coordinador' };
export type LoginResponse = { token: string; user: User };

export function login(body: LoginBody) {
  return http('/auth/login', { method: 'POST', body }) as Promise<LoginResponse>;
}
