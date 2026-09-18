import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard', { replace: true });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-decoration"><span>SENA</span><strong>SpaceHub</strong><p>Gestiona tu inventario<br />de forma inteligente.</p></div>
      <div className="auth-card">
        <span className="eyebrow">ACCESO SEGURO</span>
        <h2>Iniciar sesión</h2>
        <p className="auth-subtitle">Ingresa a tu espacio de gestión SENA.</p>
      {error && <div className="form-error">{error}</div>}
      <form className="form-stack" onSubmit={handleSubmit}>
        <div className="field">
          <label htmlFor="loginEmail">Correo Institucional</label>
          <input id="loginEmail" type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="roberto.gomez@sena.edu.co" />
        </div>
        <div className="field">
          <label htmlFor="loginPassword">Contraseña</label>
          <input id="loginPassword" type="password" required autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
        </div>
        <button className="primary-button" type="submit" disabled={loading}>
          {loading ? 'Autenticando...' : 'Ingresar y Obtener JWT'}
        </button>
      </form>
      <p className="auth-footer">¿Aún no tienes cuenta? <Link to="/registro">Crear una cuenta</Link></p>
      </div>
    </div>
  );
}