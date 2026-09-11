import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { loginSimulado } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      loginSimulado(email, 'Aprendiz');
      navigate('/dashboard');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Iniciar Sesión API SENA</h2>
      {error && <div>{error}</div>}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="loginEmail">Correo Institucional</label>
          <input id="loginEmail" type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="roberto.gomez@sena.edu.co" />
        </div>
        <div>
          <label htmlFor="loginPassword">Contraseña</label>
          <input id="loginPassword" type="password" required autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Autenticando...' : 'Ingresar y Obtener JWT'}
        </button>
      </form>
    </div>
  );
}