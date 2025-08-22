import { Router } from 'express';
import { requireAuth } from '../auth/auth.middleware';
import { requireRole } from '../auth/role.middleware';
import { listarPorExpediente, crear, actualizar, activar } from '../controllers/indicio.controller';

const r = Router();
r.get('/expedientes/:id/indicios', requireAuth, listarPorExpediente);
r.post('/expedientes/:id/indicios', requireAuth, requireRole('tecnico','coordinador'), crear);
r.put('/:id', requireAuth, requireRole('tecnico','coordinador'), actualizar);
r.patch('/:id/activo', requireAuth, activar);
export default r;
