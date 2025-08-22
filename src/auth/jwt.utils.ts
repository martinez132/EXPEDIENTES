import jwt from 'jsonwebtoken';
import { env } from '../config/env';

export type JwtUser = { id: number; username: string; rol: 'tecnico'|'coordinador' };

export const signJwt = (u: JwtUser) =>
  jwt.sign(u, env.jwt.secret, { expiresIn: env.jwt.expiresIn });

export const verifyJwt = (token: string) =>
  jwt.verify(token, env.jwt.secret) as JwtUser;
