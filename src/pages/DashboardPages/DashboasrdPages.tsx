import './DashboardPages.css';

export default function DashboardPage() {
	return (
		<section className="page-section dashboard-page">
			<div className="page-heading">
				<div>
					<span className="eyebrow">CENTRO DE CONTROL</span>
					<h1>Hola, bienvenido 👋</h1>
					<p>Consulta el estado general del inventario de SpaceHub.</p>
				</div>
				<div className="heading-accent">SENA <span>●</span></div>
			</div>
			<div className="stats-grid">
				<div className="stat-card stat-card--green"><span className="stat-icon">▦</span><span className="stat-label">Equipos registrados</span><strong>Inventario</strong><small>Gestión centralizada</small></div>
				<div className="stat-card stat-card--blue"><span className="stat-icon">↗</span><span className="stat-label">Préstamos</span><strong>Control total</strong><small>Asignaciones y devoluciones</small></div>
				<div className="stat-card stat-card--orange"><span className="stat-icon">✦</span><span className="stat-label">SpaceHub</span><strong>Operación activa</strong><small>Plataforma de gestión SENA</small></div>
			</div>
			<div className="welcome-card">
				<div><span className="eyebrow">GESTIÓN INTELIGENTE</span><h2>Todo tu inventario, en un solo lugar.</h2><p>Administra equipos, consulta disponibilidad y mantén el control de cada préstamo de forma sencilla.</p></div>
				<div className="welcome-orb">✦</div>
			</div>
		</section>
	);
}
