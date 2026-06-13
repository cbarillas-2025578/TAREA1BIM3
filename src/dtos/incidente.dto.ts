import type { Prioridad } from '../models/incidente.model';

export interface CrearIncidenteDTO {
    maquinaId: string;
    titulo: string;
    descripcion: string;
    reportadoPor: string;
    prioridad: Prioridad;
}