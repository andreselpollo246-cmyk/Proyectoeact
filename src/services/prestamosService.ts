import { apiFetch } from './api';

export interface Prestamo {
  id: number;
  aprendiz: string;
  ficha: string;
  equipoPlaca: string;
  horaInicio: string;
  estado: 'Activo' | 'Devuelto';
  creadoPorRol: string;
}

export const prestamosService = {
  getAll: async (): Promise<Prestamo[]> => {
    return apiFetch<Prestamo[]>('/prestamos');
  },
  create: async (data: { aprendiz: string; ficha: string; equipoPlaca: string }): Promise<Prestamo> => {
    return apiFetch<Prestamo>('/prestamos', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  devolver: async (id: number): Promise<Prestamo> => {
    return apiFetch<Prestamo>(`/prestamos/${id}/devolver`, {
      method: 'PUT',
    });
  }
};

export default prestamosService;