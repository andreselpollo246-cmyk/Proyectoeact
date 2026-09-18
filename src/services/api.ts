// =================================================================
// Archivo: src/services/api.ts
//RESPONSABILIDAD: Helper central HTTP que adjunta automáticamente el token JWT
//desde sessionStorage y maneja las URLs base utilizando VITE_API_URL.
// =================================================================
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';

export async function apiFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = sessionStorage.getItem('token');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${endpoint}`, { ...options, headers });
  } catch {
    // fetch solo lanza aquí cuando NO hay conexión con el servidor (apagado, puerto equivocado, CORS bloqueado)
    throw new Error(`No se pudo conectar con el servidor (${API_BASE_URL}). ¿Está corriendo el backend?`);
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    // Token vencido/ inválido con sesión abierta: limpiamos y mandamos al login
    if (response.status === 401 && token) {
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('spacehub_user');
      window.location.href = '/login';
    }
    throw new Error(data.message || 'Error en la comunicación con la API REST');
  }
  return data as T;
}
