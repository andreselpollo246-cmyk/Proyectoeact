import { useEffect, useState } from 'react';
import { prestamosService, type Prestamo } from '../../services/prestamosService';
import { equiposService, type Equipo } from '../../services/equiposService';
import { useAuth } from '../../context/AuthContext';
import PrestamoModal from '../../components/PrestamoModal/PrestamoModal';
import Swal from 'sweetalert2';
import './PrestamosPage.css';

export default function PrestamosPage() {
  const [prestamos, setPrestamos] = useState<Prestamo[]>([]);
  const [equipos, setEquipos] = useState<Equipo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const { isAdmin, user } = useAuth();

  // --- FASE 1: Carga de datos desde el servidor ---
  const loadPrestamos = async () => {
    try {
      setLoading(true);
      setError(null);
      const [prestamosData, equiposData] = await Promise.all([
        prestamosService.getAll(),
        equiposService.getAll()
      ]);
      setPrestamos(prestamosData);
      setEquipos(equiposData);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al cargar');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadPrestamos(); }, []);

  // --- FASE 2: Crear préstamo y mostrar alertas ---
  const handleCrearPrestamo = async (data: { aprendiz: string; ficha: string; equipoPlaca: string }) => {
    try {
      await prestamosService.create(data);
      loadPrestamos();
      Swal.fire({
        title: '¡Registrado!',
        text: 'El préstamo se ha creado exitosamente.',
        icon: 'success',
        background: '#1e293b',
        color: '#fff',
        confirmButtonColor: '#39A900'
      });
    } catch (err: unknown) {
      Swal.fire({ title: 'Error', text: 'No se pudo registrar el préstamo', icon: 'error', background: '#1e293b', color: '#fff' });
    }
  };

  // --- FASE 2: Devolver equipo ---
  const handleDevolver = async (id: number) => {
    const result = await Swal.fire({
      title: '¿Confirmar Devolución?',
      text: "El equipo quedará nuevamente disponible en el inventario.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#39A900',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, registrar devolución',
      cancelButtonText: 'Cancelar',
      background: '#1e293b',
      color: '#fff'
    });

    if (result.isConfirmed) {
      try {
        await prestamosService.devolver(id);
        loadPrestamos();
        Swal.fire({
          title: '¡Devuelto!',
          text: 'El equipo ha sido devuelto exitosamente.',
          icon: 'success',
          background: '#1e293b',
          color: '#fff',
          confirmButtonColor: '#39A900'
        });
      } catch (err) {
        Swal.fire({ title: 'Error', text: 'No se pudo procesar la devolución', icon: 'error', background: '#1e293b', color: '#fff' });
      }
    }
  };

  // --- INTERFAZ: Listado de préstamos ---
  return (
    <div className="prestamos-page">
      {/* Encabezado con botón para nuevo préstamo */}
      <div className="prestamos-page__header">
        <div>
          <h2 className="prestamos-page__title">Gestión de Préstamos</h2>
          <p className="prestamos-page__description">Control de asignación y devoluciones de equipos de cómputo.</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="prestamos-page__new">
          + Nuevo Préstamo
        </button>
      </div>

      {/* Tabla de préstamos (FASE 1) */}
      <div className="prestamos-page__panel">
        <h2 className="prestamos-page__panel-title">Historial de Préstamos Activos</h2>
        
        {error && <div className="form-error">{error}</div>}

        {loading ? (
          <div className="loading-state">Conectando con el servidor...</div>
        ) : (
          <div className="prestamos-page__table-wrap">
            <table className="prestamos-page__table">
              <thead className="prestamos-page__thead">
                <tr>
                  <th className="prestamos-page__cell">Aprendiz / Ficha</th>
                  <th className="prestamos-page__cell">Equipo (Placa)</th>
                  <th className="prestamos-page__cell">Hora Salida</th>
                  <th className="prestamos-page__cell">Estado</th>
                  <th className="p-3 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/60">
                {prestamos.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-750/50 transition-colors">
                    <td className="prestamos-page__cell">
                      {p.aprendiz} <span className="prestamos-page__student-ficha">Ficha: {p.ficha}</span>
                    </td>
                    <td className="prestamos-page__cell prestamos-page__plate">{p.equipoPlaca}</td>
                    <td className="prestamos-page__cell">{p.horaInicio}</td>
                    <td className="prestamos-page__cell">
                      <span className={`prestamos-page__status ${p.estado === 'Activo' ? 'prestamos-page__status--active' : 'prestamos-page__status--closed'}`}>
                        {p.estado}
                      </span>
                    </td>
                    {/* Botón de devolución (FASE 2) */}
                    <td className="prestamos-page__cell prestamos-page__actions">
                      {p.estado === 'Activo' && isAdmin && (
                        <button onClick={() => handleDevolver(p.id)} className="prestamos-page__return">
                          Devolver
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
                {prestamos.length === 0 && (
                  <tr>
                    <td colSpan={5} className="prestamos-page__empty">No hay préstamos registrados.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal (FASE 3) */}
      <PrestamoModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCrearPrestamo}
        isAdmin={isAdmin}
        defaultNombre={user?.nombreCompleto || user?.nombre || ''}
        defaultFicha={user?.ficha || ''}
        equipos={equipos}
      />
    </div>
  );
}