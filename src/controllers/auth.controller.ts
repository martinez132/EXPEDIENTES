import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { getPool, sql } from '../db/db';
import { signJwt } from '../auth/jwt.utils';

export async function login(req: Request, res: Response) {
  const { username, password } = req.body;
  const pool = await getPool();
  const result = await pool.request()
    .input('username', sql.VarChar(50), username)
    .execute('sp_Usuarios_Login');

  const user = result.recordset[0];
  if (!user || !user.activo) return res.status(401).json({ message: 'Credenciales' });

  const ok = await bcrypt.compare(password, user.password_hash);
  if (!ok) return res.status(401).json({ message: 'Credenciales' });

  const token = signJwt({ id: user.id, username: user.username, rol: user.rol });
  res.json({ token, user: { id: user.id, username: user.username, rol: user.rol } });
}
