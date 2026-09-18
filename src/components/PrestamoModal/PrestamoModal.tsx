import React, { useState } from 'react';
import type { Equipo } from '../../services/equiposService';

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
    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-md rounded-2xl p-6 shadow-2xl text-white relative">
        <div className="flex justify-between items-center mb-4 border-b border-slate-800 pb-3">
          <h3 className="text-lg font-bold text-sena">Registrar Nuevo Préstamo</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white font-bold cursor-pointer">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 font-mono text-xs">
          <div>
            <label className="block font-bold text-slate-300 mb-1">Seleccionar Equipo</label>
            <select required value={equipoPlaca} onChange={(e) => setEquipoPlaca(e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white">
              <option value="">-- Selecciona un equipo --</option>
              {equipos.map((equipo) => (
                <option key={equipo.id} value={equipo.placaSena}>
                  {equipo.placaSena} - {equipo.marcaModelo}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block font-bold text-slate-300 mb-1">Aprendiz</label>
            <input type="text" required value={aprendiz} onChange={(e) => setAprendiz(e.target.value)} disabled={!isAdmin} className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white disabled:opacity-50" />
          </div>
          <div>
            <label className="block font-bold text-slate-300 mb-1">Ficha</label>
            <input type="text" required value={ficha} onChange={(e) => setFicha(e.target.value)} disabled={!isAdmin} className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white disabled:opacity-50" />
          </div>

          <div className="flex justify-end gap-3 pt-4 font-sans">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-xs font-bold cursor-pointer">Cancelar</button>
            <button type="submit" disabled={loading} className="px-4 py-2 bg-sena hover:bg-emerald-600 text-slate-900 font-extrabold rounded-xl text-xs cursor-pointer">{loading ? 'Guardando...' : 'Asignar Equipo'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}