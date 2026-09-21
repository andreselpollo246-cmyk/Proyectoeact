import React, { useState } from 'react';
import type { Equipo } from '../../services/equiposService';
import './PrestamoModal.css';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { aprendiz: string; ficha: string; equipoPlaca: string }) => Promise<void>;
  isAdmin: boolean;
  defaultNombre: string;
  defaultFicha: string;
  equipos: Equipo[];
}

export default function PrestamoModal({ isOpen, onClose, onSubmit, isAdmin, defaultNombre, defaultFicha, equipos }: Props) {
  const [equipoPlaca, setEquipoPlaca] = useState('');
  const [aprendiz, setAprendiz] = useState(defaultNombre);
  const [ficha, setFicha] = useState(defaultFicha);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit({ aprendiz, ficha, equipoPlaca });
      setEquipoPlaca('');
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="prestamo-modal-overlay">
      <div className="prestamo-modal">
        <div className="prestamo-modal__header">
          <h3 className="prestamo-modal__title">Registrar Nuevo Préstamo</h3>
          <button onClick={onClose} className="prestamo-modal__close">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="prestamo-modal__form">
          <div>
            <label className="prestamo-modal__label">Seleccionar Equipo</label>
            <select required value={equipoPlaca} onChange={(e) => setEquipoPlaca(e.target.value)} className="prestamo-modal__control">
              <option value="">-- Selecciona un equipo --</option>
              {equipos.map((equipo) => (
                <option key={equipo.id} value={equipo.placaSena}>
                  {equipo.placaSena} - {equipo.marcaModelo}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="prestamo-modal__label">Aprendiz</label>
            <input type="text" required value={aprendiz} onChange={(e) => setAprendiz(e.target.value)} disabled={!isAdmin} className="prestamo-modal__control" />
          </div>
          <div>
            <label className="prestamo-modal__label">Ficha</label>
            <input type="text" required value={ficha} onChange={(e) => setFicha(e.target.value)} disabled={!isAdmin} className="prestamo-modal__control" />
          </div>

          <div className="prestamo-modal__actions">
            <button type="button" onClick={onClose} className="prestamo-modal__cancel">Cancelar</button>
            <button type="submit" disabled={loading} className="prestamo-modal__submit">{loading ? 'Guardando...' : 'Asignar Equipo'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}