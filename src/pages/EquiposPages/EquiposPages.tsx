import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { equiposService, type Equipo } from '../../services/equiposService';
import { useAuth } from '../../context/AuthContext';

export default function EquiposPage() {
  const [equipos, setEquipos] = useState<Equipo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isAdmin } = useAuth();

  const loadEquipos = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await equiposService.getAll();
      setEquipos(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadEquipos(); }, []);

  const handleDelete = async (placaSena: string) => {
    if (!window.confirm(`¿Eliminar el equipo ${placaSena}?`)) return;
    try {
      await equiposService.remove(placaSena);
      loadEquipos();
    } catch (err: unknown) {
      alert(`Error API: ${err instanceof Error ? err.message : 'Error al eliminar'}`);
    }
  };

  return (
    <div className="page-section">
      <div className="page-heading">
        <div>
          <span className="eyebrow">RECURSOS TECNOLÓGICOS</span><h1>Inventario de equipos</h1>
          <p>Datos obtenidos a través de la capa de servicio (equiposService.ts)</p>
        </div>
        {isAdmin && (
          <Link to="/inventario/nuevo">
            + Registrar equipo
          </Link>
        )}
      </div>

      {error && <div className="form-error">{error}</div>}

      {loading ? (
        <div className="loading-state">Cargando inventario...</div>
      ) : (
        <div className="table-card">
          <table>
            <thead>
              <tr>
                <th>Placa SENA</th>
                <th>Marca/Modelo</th>
                <th>RAM</th>
                <th>Ambiente</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {equipos.map((eq) => (
                <tr key={eq.placaSena}>
                  <td>{eq.placaSena}</td>
                  <td>{eq.marcaModelo}</td>
                  <td>{eq.ram}</td>
                  <td>{eq.ambiente}</td>
                  <td>
                    <span>
                      {eq.estado}
                    </span>
                  </td>
                  <td>
                    <Link to={`/inventario/${eq.placaSena}`}>Editar</Link>
                    {isAdmin && (
                      <button onClick={() => handleDelete(eq.placaSena)}>Eliminar</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}