import { Link } from 'react-router-dom';
import './Navbar.css';

export default function NavBar() {
  return (
    <header className="navbar">
      <div className="navbar__inner">
        <Link className="navbar__brand" to="/dashboard">
          <span className="navbar__brand-mark">SENA</span>
          <span className="navbar__brand-name">SpaceHub</span>
        </Link>
        <nav className="navbar__links" aria-label="Navegación principal">
          <Link className="navbar__link" to="/dashboard">Dashboard</Link>
          <Link className="navbar__link" to="/inventario">Inventario</Link>
          <Link className="navbar__link" to="/prestamos">Préstamos</Link>
        </nav>
      </div>
    </header>
  );
}
