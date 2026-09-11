import { useState, type FormEvent } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import RegistroForm from '../components/Registro/RegistroUsuario';
import { useAuth, type RolUsuario } from '../context/AuthContext';

export function LoginPage() {
  const navigate = useNavigate();
  const { loginSimulado } = useAuth();
  const [correo, setCorreo] = useState('usuario@sena.edu.co');
  const [rol, setRol] = useState<RolUsuario>('Aprendiz');

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    loginSimulado(correo, rol);
    navigate('/dashboard', { replace: true });
  };

  return (
    <main>
      <h1>Iniciar sesión</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="correo">Correo institucional</label>
        <input id="correo" type="email" value={correo} onChange={(event) => setCorreo(event.target.value)} required />
        <label htmlFor="rol">Rol</label>
        <select id="rol" value={rol} onChange={(event) => setRol(event.target.value as RolUsuario)}>
          <option value="Aprendiz">Aprendiz</option>
          <option value="Instructor">Instructor</option>
          <option value="Administrador">Administrador</option>
        </select>
        <button type="submit">Entrar</button>
      </form>
      <p><Link to="/registro">Crear una cuenta</Link></p>
    </main>
  );
}

export function RegistroPage() {
  return (
    <main>
      <RegistroForm />
      <Link to="/login">Volver al inicio de sesión</Link>
    </main>
  );
}

export function EquiposPage() {
  return (
    <section>
      <h1>Inventario</h1>
      <p>Consulta los equipos registrados.</p>
      <Link to="/inventario/nuevo">Registrar equipo</Link>
    </section>
  );
}

export function NuevoEquipoPage() {
  return (
    <section>
      <h1>Nuevo equipo</h1>
      <p>Formulario de registro de equipos.</p>
      <Link to="/inventario">Volver al inventario</Link>
    </section>
  );
}

export function DetalleEquipoPage() {
  const { placaSena } = useParams();

  return (
    <section>
      <h1>Detalle del equipo</h1>
      <p>Placa SENA: {placaSena}</p>
      <Link to="/inventario">Volver al inventario</Link>
    </section>
  );
}

export function SectionPage({ title }: { title: string }) {
  return (
    <section>
      <h1>{title}</h1>
      <p>Esta sección está lista para integrar su contenido.</p>
    </section>
  );
}
