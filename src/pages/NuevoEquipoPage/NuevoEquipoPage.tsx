import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { equiposService } from '../../services/equiposService';

export default function NuevoEquipoPage() {
  const [placaSena, setPlacaSena] = useState('');
  const [marcaModelo, setMarcaModelo] = useState('');
  const [ram, setRam] = useState('16GB DDR4');
  const [ambiente, setAmbiente] = useState('Ambiente 301 - ADSO');
  const [estado, setEstado] = useState<'Operativo' | 'En Mantenimiento'>('Operativo');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    try {
      await equiposService.create({ placaSena, marcaModelo, ram, ambiente, estado });
      navigate('/inventario');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al guardar equipo');
    }
  };

  return (
    <div>
      <h2>Registrar Nuevo Equipo (POST)</h2>
      <p>Utilizando equiposService.create()</p>
      {error && <div>{error}</div>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Placa SENA</label>
          <input type="text" required placeholder="SENA-1006" value={placaSena} onChange={(e) => setPlacaSena(e.target.value)} />
        </div>
        <div>
          <label>Marca / Modelo</label>
          <input type="text" required placeholder="Lenovo ThinkPad L14 G3" value={marcaModelo} onChange={(e) => setMarcaModelo(e.target.value)} />
        </div>
        <div>
          <div>
            <label>Memoria RAM</label>
            <select value={ram} onChange={(e) => setRam(e.target.value)}>
              <option value="8GB DDR4">8GB DDR4</option>
              <option value="16GB DDR4">16GB DDR4</option>
              <option value="32GB DDR5">32GB DDR5</option>
            </select>
          </div>
          <div>
            <label>Estado Inicial</label>
            <select value={estado} onChange={(e) => setEstado(e.target.value as 'Operativo' | 'En Mantenimiento')}>
              <option value="Operativo">Operativo</option>
              <option value="En Mantenimiento">En Mantenimiento</option>
            </select>
          </div>
        </div>
        <div>
          <label>Ambiente Asignado</label>
          <input type="text" required value={ambiente} onChange={(e) => setAmbiente(e.target.value)} />
        </div>
        <div>
          <button type="button" onClick={() => navigate('/inventario')}>Cancelar</button>
          <button type="submit">Guardar Equipo (POST)</button>
        </div>
      </form>
    </div>
  );
}