export type Estado = 'pendiente' | 'aprobado' | 'rechazado';

export type Expediente = {
  id: number;
  codigo: string;
  descripcion: string;
  fecha_registro: string;
  tecnico_id: number;
  estado: Estado;
  justificacion?: string | null;
  aprobador_id?: number | null;
  fecha_estado?: string | null;
  activo: boolean;
};

export type PagedExpedientes = {
  data: Expediente[];
  pagina: number;
  total: number;
  pageSize: number;
};
