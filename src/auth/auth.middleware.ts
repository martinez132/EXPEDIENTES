import { Request, Response, NextFunction } from 'express';
import { verifyJwt } from './jwt.utils';

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const h = req.headers.authorization;
  if (!h?.startsWith('Bearer ')) return res.status(401).json({ message: 'Token requerido' });
  try {
    req.user = verifyJwt(h.slice(7));
    next();
  } catch {
    res.status(401).json({ message: 'Token inválido' });
  }
}
