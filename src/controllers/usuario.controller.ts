import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { getPool, sql } from '../db/db';

export async function crearUsuario(req: Request, res: Response) {
  const { username, password, rol } = req.body;
  const hash = await bcrypt.hash(password, 10);
  const pool = await getPool();
  const out = await pool.request()
    .input('username', sql.VarChar(50), username)
    .input('password_hash', sql.VarChar(100), hash)
    .input('rol', sql.VarChar(20), rol)
    .execute('sp_Usuarios_Crear');
  res.status(201).json({ id: out.recordset[0].id });
}
