import { Link } from 'react-router-dom';

export default function NavBar() {
  return (
    <header>
      <div>
        <span>SENA SpaceHub</span>
        <nav>
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/inventario">Inventario Equipos</Link>
        </nav>
      </div>
    </header>
  );
}
