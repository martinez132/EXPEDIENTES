import { Router } from 'express';
import authRoutes from './auth.routes';
import expedienteRoutes from './expediente.routes';
import indicioRoutes from './indicio.routes';
import usuarioRoutes from './usuario.routes';

const r = Router();
r.use('/auth', authRoutes);
r.use('/expedientes', expedienteRoutes);
r.use('/indicios', indicioRoutes);
r.use('/usuarios', usuarioRoutes);
export default r;
