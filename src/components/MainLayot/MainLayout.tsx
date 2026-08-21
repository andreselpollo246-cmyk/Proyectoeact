import { Outlet } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';
 
export default function MainLayout() {
  return (
    <div className="layout-shell">
      {/* Componente Navbar Aislado */}
      <Navbar />
 
      <main className="content-viewport">
        {/* Aquí React Router inyecta la página que coincida con la URL */}
        <Outlet />
      </main>
    </div>
  );
}
 