import { Outlet, useNavigate } from 'react-router-dom';
import NavBar from '../../components/Navbar/Navbar';
import { useAuth } from '../../context/AuthContext';

export default function MainLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div>
      <NavBar />
      <div>
        <div>
          <span>Sesión Activa:</span>
          <strong>{user?.nombre || 'Usuario Autenticado'}</strong>
          <span>
            {user?.rol || 'Rol'}
          </span>
        </div>
        <button
          onClick={handleLogout}
        >
          Cerrar Sesión
        </button>
      </div>
      <main>
        <Outlet />
      </main>
    </div>
  );
}