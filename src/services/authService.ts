// =================================================================
// Archivo: src/services/authService.ts
//RESPONSABILIDAD: Capa de servicio dedicada a la autenticación (Login y Logout).
//Encapsula las peticiones HTTP al API de autenticación.
// =================================================================
import { apiFetch } from './api';
import type { RolUsuario } from '../context/AuthContext';

export interface LoginCredentials {
  email: string;
  password: string;
}

// Forma EXACTA en que el backend devuelve al usuario (server.js -> /auth/login)
export interface UsuarioApi {
  id: number;
  nombreCompleto: string;
  email: string;
  role: RolUsuario;
  ficha?: string;
}

export interface AuthResponse {
  statusCode: number;
  message: string;
  accessToken: string;
  user: UsuarioApi;
}

export const authService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    return apiFetch<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },

  logout: async (): Promise<{ message: string }> => {
    try {
      return await apiFetch<{ message: string }>('/auth/logout', {
        method: 'POST',
      });
    } catch {
      return { message: 'Sesión cerrada localmente' };
    }
  },
};

export default authService;
