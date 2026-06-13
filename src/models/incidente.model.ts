export type Prioridad = 'baja' | 'media' | 'alta';
export type EstadoIncidente = 'abierto' | 'en progreso' | 'resuelto';

export interface Incidente {
    readonly id: number;
    titulo: string;
    descripcion: string;
    reportadoPor: string;
    prioridad: Prioridad;
    estado: EstadoIncidente;
    fechaCreacion: Date;
}