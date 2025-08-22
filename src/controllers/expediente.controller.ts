import { Request, Response } from 'express';
import { getPool, sql } from '../db/db';

export async function listar(req: Request, res: Response) {
  const { page = 1, pageSize = 10, codigo, estado } = req.query as any;
  const pool = await getPool();
  const out = await pool.request()
    .input('page', sql.Int, Number(page))
    .input('pageSize', sql.Int, Number(pageSize))
    .input('codigo', sql.VarChar(50), codigo ?? null)
    .input('estado', sql.VarChar(20), estado ?? null)
    .execute('sp_Expedientes_Listar');
  res.json(out.recordset);
}

export async function obtener(req: Request, res: Response) {
  const pool = await getPool();
  const out = await pool.request().input('id', sql.Int, Number(req.params.id))
    .execute('sp_Expedientes_Obtener');
  const row = out.recordset[0];
  if (!row) return res.sendStatus(404);
  res.json(row);
}

export async function crear(req: Request, res: Response) {
  const { codigo, descripcion } = req.body;
  const tecnicoId = req.user!.id;
  const pool = await getPool();
  const out = await pool.request()
    .input('codigo', sql.VarChar(50), codigo)
    .input('descripcion', sql.NVarChar(255), descripcion)
    .input('tecnico_id', sql.Int, tecnicoId)
    .execute('sp_Expedientes_Crear');
  res.status(201).json({ id: out.recordset[0].id });
}

export async function actualizar(req: Request, res: Response) {
  // Solo dejar editar si el expediente pertenece al técnico (valida en app)
  const { descripcion } = req.body;
  const id = Number(req.params.id);
  const pool = await getPool();

  // Seguridad: verifica pertenencia
  const exp = await pool.request().input('id', sql.Int, id).execute('sp_Expedientes_Obtener');
  const row = exp.recordset[0];
  if (!row) return res.sendStatus(404);
  if (req.user!.rol === 'tecnico' && row.tecnico_id !== req.user!.id) return res.sendStatus(403);

  const out = await pool.request()
    .input('id', sql.Int, id)
    .input('descripcion', sql.NVarChar(255), descripcion)
    .execute('sp_Expedientes_Actualizar');
  res.json({ updated: out.recordset[0].updated });
}

export async function cambiarEstado(req: Request, res: Response) {
  const id = Number(req.params.id);
  const { estado, justificacion } = req.body; // 'aprobado' | 'rechazado'
  const pool = await getPool();
  const out = await pool.request()
    .input('id', sql.Int, id)
    .input('estado', sql.VarChar(20), estado)
    .input('justificacion', sql.NVarChar(400), justificacion ?? null)
    .input('aprobador_id', sql.Int, req.user!.id)
    .execute('sp_Expedientes_CambiarEstado');
  res.json({ updated: out.recordset[0].updated });
}

export async function activar(req: Request, res: Response) {
  const id = Number(req.params.id);
  const { activo } = req.body as { activo: boolean };
  const pool = await getPool();
  const out = await pool.request()
    .input('id', sql.Int, id)
    .input('activo', sql.Bit, activo ? 1 : 0)
    .execute('sp_Expedientes_ActivarDesactivar');
  res.json({ updated: out.recordset[0].updated });
}
