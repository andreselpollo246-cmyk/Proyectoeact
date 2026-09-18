import { useEffect, useState } from 'react';
import { prestamosService, type Prestamo } from '../../services/prestamosService';
import { equiposService, type Equipo } from '../../services/equiposService';
import { useAuth } from '../../context/AuthContext';
import PrestamoModal from '../../components/PrestamoModal/PrestamoModal';
import Swal from 'sweetalert2';

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
    <div className="space-y-6">
      {/* Encabezado con botón para nuevo préstamo */}
      <div className="p-6 bg-slate-800 border border-slate-700 rounded-2xl text-white shadow-xl flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-sena">Gestión de Préstamos</h2>
          <p className="text-xs text-slate-400">Control de asignación y devoluciones de equipos de cómputo.</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="px-4 py-2.5 bg-sena hover:bg-emerald-600 text-slate-900 font-extrabold rounded-xl text-xs transition shadow-lg">
          + Nuevo Préstamo
        </button>
      </div>

      {/* Tabla de préstamos (FASE 1) */}
      <div className="p-6 bg-slate-800 border border-slate-700 rounded-2xl text-white shadow-xl">
        <h2 className="text-xl font-bold text-sena mb-4">Historial de Préstamos Activos</h2>
        
        {error && <div className="p-3 mb-4 bg-rose-900/80 border border-rose-500 rounded-xl text-rose-200 text-xs font-mono">{error}</div>}

        {loading ? (
          <div className="text-center py-8 text-slate-400 font-mono text-xs animate-pulse">Conectando con el servidor...</div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-slate-700">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-900 text-slate-400 uppercase">
                <tr>
                  <th className="p-3">Aprendiz / Ficha</th>
                  <th className="p-3">Equipo (Placa)</th>
                  <th className="p-3">Hora Salida</th>
                  <th className="p-3">Estado</th>
                  <th className="p-3 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/60">
                {prestamos.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-750/50 transition-colors">
                    <td className="p-3 text-white font-sans">
                      {p.aprendiz} <span className="text-slate-500 block text-[10px]">Ficha: {p.ficha}</span>
                    </td>
                    <td className="p-3 text-sena font-bold">{p.equipoPlaca}</td>
                    <td className="p-3 text-slate-400">{p.horaInicio}</td>
                    <td className="p-3">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${p.estado === 'Activo' ? 'bg-sky-500/20 text-sky-400' : 'bg-slate-500/20 text-slate-400'}`}>
                        {p.estado}
                      </span>
                    </td>
                    {/* Botón de devolución (FASE 2) */}
                    <td className="p-3 text-right font-sans">
                      {p.estado === 'Activo' && isAdmin && (
                        <button onClick={() => handleDevolver(p.id)} className="px-3 py-1.5 bg-slate-700 hover:bg-sky-600 rounded-lg text-xs font-bold transition shadow">
                          Devolver
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
                {prestamos.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-6 text-center text-slate-500 font-sans">No hay préstamos registrados.</td>
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