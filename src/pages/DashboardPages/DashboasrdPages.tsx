import { useEffect, useState } from 'react';
import { dashboardService, type DashboardStats } from '../../services/dashboardService';
import './DashboardPages.css';

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadStats = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await dashboardService.getStats();
        setStats(data);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'No se pudieron cargar las estadísticas');
      } finally {
        setLoading(false);
      }
    };
    loadStats();
  }, []);

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

      {error && <div className="form-error">{error}</div>}

      {loading ? (
        <div className="loading-state">Cargando estadísticas...</div>
      ) : stats && (
        <>
          <div className="stats-grid stats-grid--dashboard">
            <div className="stat-card stat-card--green">
              <span className="stat-icon">▦</span>
              <span className="stat-label">Equipos totales</span>
              <strong>{stats.totalEquipos}</strong>
              <small>{stats.equiposOperativos} operativos · {stats.equiposMantenimiento} en mantenimiento</small>
            </div>
            <div className="stat-card stat-card--blue">
              <span className="stat-icon">↗</span>
              <span className="stat-label">Préstamos activos</span>
              <strong>{stats.prestamosActivos}</strong>
              <small>Ocupación global: {stats.tasaOcupacionGlobal}</small>
            </div>
            <div className="stat-card stat-card--orange">
              <span className="stat-icon">⚠</span>
              <span className="stat-label">Incidencias</span>
              <strong>{stats.incidencias.total}</strong>
              <small>{stats.incidencias.alta} alta · {stats.incidencias.media} media</small>
            </div>
          </div>

          <div className="labs-card">
            <div className="labs-card__heading">
              <span className="eyebrow">OCUPACIÓN</span>
              <h2>Laboratorios y ambientes</h2>
            </div>
            <div className="labs-list">
              {stats.laboratoriosOcupacion.map((lab) => (
                <div className="lab-row" key={lab.nombre}>
                  <div className="lab-row__top">
                    <span className={`lab-dot ${lab.activo ? 'lab-dot--on' : 'lab-dot--off'}`} />
                    <span className="lab-name">{lab.nombre}</span>
                    <span className="lab-pct">{lab.porcentaje}%</span>
                  </div>
                  <div className="lab-bar">
                    <div className="lab-bar__fill" style={{ width: `${lab.porcentaje}%` }} />
                  </div>
                </div>
              ))}
              {stats.laboratoriosOcupacion.length === 0 && (
                <p className="lab-empty">No hay ambientes registrados todavía.</p>
              )}
            </div>
          </div>
        </>
      )}

    </section>
  );
}
