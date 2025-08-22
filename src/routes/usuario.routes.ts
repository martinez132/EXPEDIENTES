import { Router } from 'express';
import { crearUsuario } from '../controllers/usuario.controller';
const r = Router();
r.post('/', crearUsuario); // pública para seed inicial; luego protégela
export default r;
