import { Link, useParams } from 'react-router-dom';
import RegistroForm from '../components/Registro/RegistroUsuario';

export function RegistroPage() {
  return (
    <main className="auth-page">
      <RegistroForm />
      <Link className="auth-footer" to="/login">Volver al inicio de sesión</Link>
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
