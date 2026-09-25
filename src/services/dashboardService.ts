// =================================================================
// Archivo: src/services/dashboardService.ts
// RESPONSABILIDAD: Capa de servicio para las estadísticas del dashboard.
// Consume GET /api/v1/dashboard/stats (protegido por JWT vía apiFetch).
// =================================================================
import { apiFetch } from './api';

export interface Incidencias {
  total: number;
  alta: number;
  media: number;
}

export interface LaboratorioOcupacion {
  nombre: string;
  porcentaje: number;
  activo: boolean;
}

export interface DashboardStats {
  totalEquipos: number;
  equiposOperativos: number;
  equiposMantenimiento: number;
  prestamosActivos: number;
  tasaOcupacionGlobal: string;
  incidencias: Incidencias;
  laboratoriosOcupacion: LaboratorioOcupacion[];
}

export const dashboardService = {
  getStats: async (): Promise<DashboardStats> => {
    return apiFetch<DashboardStats>('/dashboard/stats');
  },
};

export default dashboardService;
