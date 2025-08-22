import { Router } from 'express';
import { requireAuth } from '../auth/auth.middleware';
import { requireRole } from '../auth/role.middleware';
import { listar, obtener, crear, actualizar, cambiarEstado, activar } from '../controllers/expediente.controller';

const r = Router();
r.get('/', requireAuth, listar);
r.get('/:id', requireAuth, obtener);
r.post('/', requireAuth, requireRole('tecnico','coordinador'), crear); // tecnico_id se toma del token
r.put('/:id', requireAuth, requireRole('tecnico','coordinador'), actualizar);
r.patch('/:id/estado', requireAuth, requireRole('coordinador'), cambiarEstado);
r.patch('/:id/activo', requireAuth, activar);
export default r;
