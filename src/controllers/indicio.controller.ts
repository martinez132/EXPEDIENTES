import { Request, Response } from 'express';
import { getPool, sql } from '../db/db';

export async function listarPorExpediente(req: Request, res: Response) {
  const expedienteId = Number(req.params.id);
  const pool = await getPool();
  const out = await pool.request().input('expediente_id', sql.Int, expedienteId)
    .execute('sp_Indicios_ListarPorExpediente');
  res.json(out.recordset);
}

export async function crear(req: Request, res: Response) {
  const expedienteId = Number(req.params.id);
  const { descripcion, color, tamano, peso, ubicacion } = req.body;
  const pool = await getPool();

  // (opcional: validar que el expediente pertenezca al técnico)
  const out = await pool.request()
    .input('expediente_id', sql.Int, expedienteId)
    .input('descripcion', sql.NVarChar(255), descripcion)
    .input('color', sql.NVarChar(50), color ?? null)
    .input('tamano', sql.NVarChar(50), tamano ?? null)
    .input('peso', sql.Decimal(10,2), peso ?? null)
    .input('ubicacion', sql.NVarChar(200), ubicacion ?? null)
    .input('tecnico_id', sql.Int, req.user!.id)
    .execute('sp_Indicios_Crear');
  res.status(201).json({ id: out.recordset[0].id });
}

export async function actualizar(req: Request, res: Response) {
  const id = Number(req.params.id);
  const { descripcion, color, tamano, peso, ubicacion } = req.body;
  const pool = await getPool();
  const out = await pool.request()
    .input('id', sql.Int, id)
    .input('descripcion', sql.NVarChar(255), descripcion)
    .input('color', sql.NVarChar(50), color ?? null)
    .input('tamano', sql.NVarChar(50), tamano ?? null)
    .input('peso', sql.Decimal(10,2), peso ?? null)
    .input('ubicacion', sql.NVarChar(200), ubicacion ?? null)
    .execute('sp_Indicios_Actualizar');
  res.json({ updated: out.recordset[0].updated });
}

export async function activar(req: Request, res: Response) {
  const id = Number(req.params.id);
  const { activo } = req.body as { activo: boolean };
  const pool = await getPool();
  const out = await pool.request()
    .input('id', sql.Int, id)
    .input('activo', sql.Bit, activo ? 1 : 0)
    .execute('sp_Indicios_ActivarDesactivar');
  res.json({ updated: out.recordset[0].updated });
}
