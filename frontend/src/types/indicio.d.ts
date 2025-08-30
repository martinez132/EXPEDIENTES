export type Indicio = {
  id: number;
  expediente_id: number;
  descripcion: string;
  color?: string | null;
  tamano?: string | null;
  peso?: number | null;
  ubicacion?: string | null;
  tecnico_id: number;
  fecha_registro: string;
  activo: boolean;
};
