import { Request, Response, NextFunction } from 'express';
export function requireRole(...roles: Array<'tecnico'|'coordinador'>) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) return res.status(401).json({ message: 'No autenticado' });
    if (!roles.includes(req.user.rol)) return res.status(403).json({ message: 'Sin permisos' });
    next();
  };
}
