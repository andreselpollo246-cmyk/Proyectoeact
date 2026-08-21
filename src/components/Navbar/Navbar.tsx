import { NavLink  } from 'react-router-dom';
import './Navbar.css';
 
export default function Navbar() {
  return (
    <header className="navbar header">
        <h1>SpaceHub</h1>
        <nav>
            <NavLink
                to="/dashboard"
                className={({ isActive }) => isActive ? 'nav-active' : 'nav-item'}>
                Dashboard
            </NavLink>
            <NavLink
            to="/Inventario"
             className={({ isActive }) => isActive ? 'nav-active' : 'nav-item'}>
            Inventario
            </NavLink>
            <NavLink
            to="/Prestamos"
             className={({ isActive }) => isActive ? 'nav-active' : 'nav-item'}>
            Prestamos
            </NavLink>
            <NavLink
            to="/Inventario"
             className={({ isActive }) => isActive ? 'nav-active' : 'nav-item'}>
            Inventario
            </NavLink>
            <NavLink
            to="/Ticketera"
             className={({ isActive }) => isActive ? 'nav-active' : 'nav-item'}>
            Ticketera
            </NavLink>
      </nav>
    </header>
  );
}
 