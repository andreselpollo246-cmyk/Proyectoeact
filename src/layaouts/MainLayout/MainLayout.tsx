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
    <div className="app-shell">
      <NavBar />
      <div className="session-bar">
        <div className="session-info">
          <span className="session-dot" />
          <span className="session-label">Sesión activa</span>
          <strong>{user?.nombre || 'Usuario Autenticado'}</strong>
          <span className="role-pill">{user?.rol || 'Rol'}</span>
        </div>
        <button
          className="logout-button"
          onClick={handleLogout}
        >
          Salir
        </button>
      </div>
      <main className="content-shell">
        <Outlet />
      </main>
    </div>
  );
}