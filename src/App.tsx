import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layaouts/MainLayout/MainLayout';
import DashboardPage from './pages/DashboardPages/DashboasrdPages';
import { RegistroPage } from './pages/Page';
import LoginPage from './pages/LoginPage/LoginPage';
import EquiposPage from './pages/EquiposPages/EquiposPages';
import DetalleEquipoPage from './pages/DetalleEquipoPage/DetalleEquipoPage';
import NuevoEquipoPage from './pages/NuevoEquipoPage/NuevoEquipoPage';
import { ProtectedRoute } from './routes/ProtectedRoute';
import { PrestamosPage } from './pages';

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/registro" element={<RegistroPage />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="inventario" element={<EquiposPage />} />
          <Route path="prestamos" element={<PrestamosPage />} />

          <Route element={<ProtectedRoute requiredRole="Administrador" />}>
            <Route path="inventario/nuevo" element={<NuevoEquipoPage />} />
            <Route path="inventario/:placaSena" element={<DetalleEquipoPage />} />
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}