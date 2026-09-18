import React, { createContext, useContext, useState } from 'react';
import { authService } from '../services/authService';

export type RolUsuario = 'Aprendiz' | 'Instructor' | 'Administrador';

export interface Usuario {
  id: number;
  nombre: string;
  nombreCompleto?: string;
  ficha?: string;
  correo: string;
  rol: RolUsuario;
}

interface AuthContextType {
  user: Usuario | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Token y usuario viven en el mismo lugar (sessionStorage) para que nunca queden desincronizados.
// api.ts lee la clave 'token' de aquí para armar el header Authorization.
const TOKEN_KEY = 'token';
const USER_KEY = 'spacehub_user';

function loadStoredUser(): Usuario | null {
  try {
    const token = sessionStorage.getItem(TOKEN_KEY);
    const saved = sessionStorage.getItem(USER_KEY);
    return token && saved ? (JSON.parse(saved) as Usuario) : null;
  } catch {
    return null;
  }
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<Usuario | null>(loadStoredUser);

  const login = async (email: string, password: string) => {
    // Llama a POST /api/v1/auth/login del backend. Si las credenciales son malas, apiFetch lanza Error.
    const res = await authService.login({ email, password });

    // Traducimos la forma del backend (nombreCompleto/email/role) a la que usa el frontend (nombre/correo/rol)
    const usuario: Usuario = {
      id: res.user.id,
      nombre: res.user.nombreCompleto,
      nombreCompleto: res.user.nombreCompleto,
      ficha: res.user.ficha ?? '',
      correo: res.user.email,
      rol: res.user.role,
    };

    sessionStorage.setItem(TOKEN_KEY, res.accessToken);
    sessionStorage.setItem(USER_KEY, JSON.stringify(usuario));
    setUser(usuario);
  };

  const logout = async () => {
    await authService.logout(); // avisa al servidor (ya lleva el token todavía)
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(USER_KEY);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isAdmin: user?.rol === 'Administrador', login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext)!;
