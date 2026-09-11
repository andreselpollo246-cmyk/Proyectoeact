import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
  requiredRole?: 'Administrador' | 'Aprendiz' | 'Instructor';
}

export function ProtectedRoute({ requiredRole }: ProtectedRouteProps) {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  if (requiredRole && user?.rol !== requiredRole) {
    return (
      <div>
        <h2>HTTP 403 - Acceso Denegado</h2>
        <p>
          Tu rol actual es <strong>{user?.rol}</strong>. Requieres permisos de <strong>{requiredRole}</strong>.
        </p>
      </div>
    );
  }
  return <Outlet />;
}

export default ProtectedRoute;