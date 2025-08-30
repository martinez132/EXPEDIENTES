import { http } from './http';
import type { Indicio } from '../types/indicio';

export function listIndiciosPorExpediente(idExpediente: number) {
  return http(`/expedientes/${idExpediente}/indicios`, { auth: true }) as Promise<Indicio[]>;
}

export function createIndicio(idExpediente: number, body: Partial<Indicio>) {
  return http(`/expedientes/${idExpediente}/indicios`, { method: 'POST', body, auth: true }) as Promise<Indicio>;
}

export function updateIndicio(id: number, body: Partial<Indicio>) {
  return http(`/indicios/${id}`, { method: 'PUT', body, auth: true }) as Promise<Indicio>;
}

export function toggleIndicioActivo(id: number, activo: boolean) {
  return http(`/indicios/${id}/activo`, { method: 'PATCH', body: { activo }, auth: true }) as Promise<Indicio>;
}
