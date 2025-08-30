import { http } from './http';
import type { Expediente, PagedExpedientes } from '../types/expediente';

export function listExpedientes(params?: { pagina?: number; q?: string; estado?: string }) {
  const q = new URLSearchParams();
  if (params?.pagina) q.set('pagina', String(params.pagina));
  if (params?.q) q.set('q', params.q);
  if (params?.estado) q.set('estado', params.estado);
  const qs = q.toString() ? `?${q.toString()}` : '';
  return http(`/expedientes${qs}`, { auth: true }) as Promise<PagedExpedientes>;
}

export function getExpediente(id: number) {
  return http(`/expedientes/${id}`, { auth: true }) as Promise<Expediente>;
}

export function createExpediente(body: Partial<Expediente>) {
  return http('/expedientes', { method: 'POST', body, auth: true }) as Promise<Expediente>;
}

export function updateExpediente(id: number, body: Partial<Expediente>) {
  return http(`/expedientes/${id}`, { method: 'PUT', body, auth: true }) as Promise<Expediente>;
}

export function cambiarEstado(id: number, body: { estado: 'aprobado'|'rechazado'; justificacion: string }) {
  return http(`/expedientes/${id}/estado`, { method: 'PATCH', body, auth: true }) as Promise<Expediente>;
}

export function toggleActivo(id: number, activo: boolean) {
  return http(`/expedientes/${id}/activo`, { method: 'PATCH', body: { activo }, auth: true }) as Promise<Expediente>;
}
