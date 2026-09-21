import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { equiposService, type Equipo } from '../../services/equiposService';
import './DetalleEquipoPage.css';

export default function DetalleEquipoPage() {
  const { placaSena } = useParams<{ placaSena: string }>();
  const [equipo, setEquipo] = useState<Equipo | null>(null);
  const [ram, setRam] = useState('16GB DDR4');
  const [ambiente, setAmbiente] = useState('');
  const [estado, setEstado] = useState<'Operativo' | 'En Mantenimiento'>('Operativo');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    equiposService.getAll()
      .then((data) => {
        const found = data.find((e) => e.placaSena.toUpperCase() === placaSena?.toUpperCase());
        if (found) {
          setEquipo(found);
          setRam(found.ram);
          setAmbiente(found.ambiente);
          setEstado(found.estado);
        }
      })
      .catch((err: unknown) => setError(err instanceof Error ? err.message : 'Error al cargar'));
  }, [placaSena]);

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    try {
      await equiposService.update(placaSena!, { ram, ambiente, estado });
      navigate('/inventario');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al actualizar');
    }
  };

  if (!equipo && !error) return <div className="loading-state">Cargando recurso...</div>;

  return (
    <div className="page-section form-page detalle-equipo-page">
      <span className="eyebrow">INVENTARIO / EDITAR</span><h1>Editar equipo</h1>
      <p className="page-lead">Placa SENA: <strong>{placaSena}</strong></p>
      {error && <div className="form-error">{error}</div>}
      <form className="form-card form-grid" onSubmit={handleUpdate}>
        <div className="field">
          <label>Memoria RAM</label>
          <select value={ram} onChange={(e) => setRam(e.target.value)}>
            <option value="8GB DDR4">8GB DDR4</option>
            <option value="16GB DDR4">16GB DDR4</option>
            <option value="32GB DDR5">32GB DDR5</option>
          </select>
        </div>
        <div className="field">
          <label>Estado Técnico</label>
          <select value={estado} onChange={(e) => setEstado(e.target.value as 'Operativo' | 'En Mantenimiento')}>
            <option value="Operativo">Operativo</option>
            <option value="En Mantenimiento">En Mantenimiento</option>
          </select>
        </div>
        <div className="field full-width">
          <label>Ambiente Asignado</label>
          <input type="text" value={ambiente} onChange={(e) => setAmbiente(e.target.value)} />
        </div>
        <div className="form-actions full-width">
          <button type="button" onClick={() => navigate('/inventario')}>Volver</button>
          <button type="submit">Actualizar Recurso (PUT)</button>
        </div>
      </form>
    </div>
  );
}