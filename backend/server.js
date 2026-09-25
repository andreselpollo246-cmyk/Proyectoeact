// =================================================================
// SENA SPACEHUB - BACKEND API REST INSUMO (Node.js + Express + JWT)
// Archivo: server.js
// FUNCIÓN: Proporciona el servidor HTTP con endpoints protegidos por JWT,
// control de roles (RBAC), login, logout y CRUD completo de equipos.
// =================================================================
const express = require('express');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = 'SENA_SPACEHUB_SECRET_KEY_2026_ADSO';

app.use(cors());
app.use(express.json());

const USERS = [
  { id: 999, nombreCompleto: 'Ing. Roberto Gómez', email: 'roberto.gomez@sena.edu.co', password: 'admin123password', role: 'Administrador' },
  { id: 101, nombreCompleto: 'Ana María Fajardo', email: 'ana.fajardo@sena.edu.co', password: 'aprendiz123password', role: 'Aprendiz' },
  { id: 202, nombreCompleto: 'Prof. Juan Carlos Pérez', email: 'instructor.perez@sena.edu.co', password: 'instructor123password', role: 'Instructor' }
];

let EQUIPOS = [
  { id: 1, placaSena: "SENA-1001", marcaModelo: "Lenovo ThinkPad L14 G3", ram: "16GB DDR4", ambiente: "Ambiente 301 - ADSO", estado: "Operativo" },
  { id: 2, placaSena: "SENA-1002", marcaModelo: "HP ProBook 440 G8", ram: "16GB DDR4", ambiente: "Ambiente 302 - Redes", estado: "En Mantenimiento" },
  { id: 3, placaSena: "SENA-1003", marcaModelo: "Dell Latitude 3420", ram: "32GB DDR5", ambiente: "Ambiente 301 - ADSO", estado: "Operativo" },
  { id: 4, placaSena: "SENA-1004", marcaModelo: "Lenovo ThinkPad L14 G3", ram: "16GB DDR4", ambiente: "Ambiente 303 - Hardware", estado: "Operativo" },
  { id: 5, placaSena: "SENA-1005", marcaModelo: "ASUS ExpertBook P2", ram: "8GB DDR4", ambiente: "Taller Prototipado 3D", estado: "Operativo" }
];

// Middleware de Validación JWT
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ statusCode: 401, error: 'Unauthorized', message: 'Token JWT requerido en cabecera Authorization: Bearer <token>' });

  jwt.verify(token, JWT_SECRET, (err, userPayload) => {
    if (err) return res.status(401).json({ statusCode: 401, error: 'Unauthorized', message: 'Token JWT inválido o expirado' });
    req.user = userPayload;
    next();
  });
};

// Middleware de Control de Roles (RBAC)
const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ statusCode: 403, error: 'Forbidden', message: `Acceso denegado para el rol '${req.user?.role}'` });
    }
    next();
  };
};

app.post('/api/v1/auth/login', (req, res) => {
  const { email, password } = req.body;
  const user = USERS.find(u => u.email === email && u.password === password);
  if (!user) return res.status(401).json({ statusCode: 401, error: 'Unauthorized', message: 'Credenciales inválidas' });

  const accessToken = jwt.sign({ sub: user.id, name: user.nombreCompleto, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '8h' });
  return res.json({ statusCode: 200, message: 'Autenticación exitosa', accessToken, user: { id: user.id, nombreCompleto: user.nombreCompleto, email: user.email, role: user.role } });
});

app.post('/api/v1/auth/logout', authenticateToken, (req, res) => {
  return res.json({ statusCode: 200, message: 'Sesión cerrada exitosamente en el servidor' });
});

app.get('/api/v1/equipos', authenticateToken, (req, res) => res.json(EQUIPOS));

app.post('/api/v1/equipos', authenticateToken, requireRole('Administrador'), (req, res) => {
  const { placaSena, marcaModelo, ram, ambiente, estado } = req.body;
  if (!placaSena || !marcaModelo) return res.status(400).json({ statusCode: 400, message: 'Faltan campos obligatorios' });
  const newEquipo = { id: Date.now(), placaSena: placaSena.toUpperCase(), marcaModelo, ram: ram || '16GB DDR4', ambiente: ambiente || 'Ambiente 301 - ADSO', estado: estado || 'Operativo' };
  EQUIPOS.unshift(newEquipo);
  res.status(201).json(newEquipo);
});

app.put('/api/v1/equipos/:placaSena', authenticateToken, requireRole('Administrador'), (req, res) => {
  const { placaSena } = req.params;
  const index = EQUIPOS.findIndex(e => e.placaSena.toUpperCase() === placaSena.toUpperCase());
  if (index === -1) return res.status(404).json({ statusCode: 404, message: 'Equipo no encontrado' });
  EQUIPOS[index] = { ...EQUIPOS[index], ...req.body };
  res.json(EQUIPOS[index]);
});

app.delete('/api/v1/equipos/:placaSena', authenticateToken, requireRole('Administrador'), (req, res) => {
  const { placaSena } = req.params;
  EQUIPOS = EQUIPOS.filter(e => e.placaSena.toUpperCase() !== placaSena.toUpperCase());
  res.json({ message: `Equipo ${placaSena} eliminado con éxito` });
});
// --- ENDPOINTS DE PRÉSTAMOS ---
let PRESTAMOS = [
  { id: 1, userId: 101, equipoPlaca: 'SENA-1001', horaInicio: '08:00 AM', estado: 'Activo', creadoPorRol: 'Aprendiz' }
];

// Función helper para obtener info completa del préstamo con datos del usuario
const getPrestamosConDetalles = (prestamos) => {
  return prestamos.map(p => {
    const usuario = USERS.find(u => u.id === p.userId);
    return {
      id: p.id,
      userId: p.userId,
      aprendiz: p.aprendiz || usuario?.nombreCompleto || 'Desconocido',
      ficha: p.ficha || usuario?.ficha || 'N/A',
      equipoPlaca: p.equipoPlaca,
      horaInicio: p.horaInicio,
      estado: p.estado,
      creadoPorRol: p.creadoPorRol
    };
  });
};

app.get('/api/v1/prestamos', authenticateToken, (req, res) => {
  if (req.user.role === 'Aprendiz') {
    const misPrestamos = PRESTAMOS.filter(p => p.userId === req.user.sub);
    return res.json(getPrestamosConDetalles(misPrestamos));
  }
  res.json(getPrestamosConDetalles(PRESTAMOS));
});

app.post('/api/v1/prestamos', authenticateToken, (req, res) => {
  // El frontend envía { aprendiz, ficha, equipoPlaca }
  const { aprendiz, ficha, equipoPlaca } = req.body;

  if (!equipoPlaca) {
    return res.status(400).json({ statusCode: 400, message: 'Falta el equipo (equipoPlaca)' });
  }
  const equipo = EQUIPOS.find(e => e.placaSena.toUpperCase() === String(equipoPlaca).toUpperCase());
  if (!equipo) {
    return res.status(404).json({ statusCode: 404, message: 'Equipo no encontrado' });
  }

  let userId = null;
  let nombreAprendiz = aprendiz;
  let fichaAprendiz = ficha;

  if (req.user.role === 'Aprendiz') {
    // Un aprendiz solo puede prestar a su propio nombre
    const usuario = USERS.find(u => u.id === req.user.sub);
    userId = req.user.sub;
    nombreAprendiz = usuario?.nombreCompleto || req.user.name;
    fichaAprendiz = ficha || usuario?.ficha;
  } else if (!nombreAprendiz) {
    return res.status(400).json({ statusCode: 400, message: 'Falta el nombre del aprendiz' });
  }

  const nuevoPrestamo = {
    id: Date.now(),
    userId,
    aprendiz: nombreAprendiz,
    ficha: fichaAprendiz || 'N/A',
    equipoPlaca: equipo.placaSena,
    horaInicio: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    estado: 'Activo',
    creadoPorRol: req.user.role
  };
  PRESTAMOS.unshift(nuevoPrestamo);

  res.status(201).json(getPrestamosConDetalles([nuevoPrestamo])[0]);
});

app.put('/api/v1/prestamos/:id/devolver', authenticateToken, (req, res) => {
  const index = PRESTAMOS.findIndex(p => p.id === Number(req.params.id));
  if (index !== -1) {
    PRESTAMOS[index].estado = 'Devuelto';
    const prestamo = getPrestamosConDetalles([PRESTAMOS[index]])[0];
    res.json(prestamo);
  } else {
    res.status(404).json({ message: 'Préstamo no encontrado' });
  }
});
// --- ENDPOINT ANALÍTICO PARA EL DASHBOARD ---
app.get('/api/v1/dashboard/stats', authenticateToken, (req, res) => {
  const totalEquipos = EQUIPOS.length;
  const equiposOperativos = EQUIPOS.filter(e => e.estado === 'Operativo').length;
  const equiposMantenimiento = EQUIPOS.filter(e => e.estado === 'En Mantenimiento' || e.estado === 'Mantenimiento' || e.estado === 'Dañado').length;
  const prestamosActivos = PRESTAMOS.filter(p => p.estado === 'Activo').length;
  
  const incidenciasAlta = EQUIPOS.filter(e => e.estado === 'Dañado').length;
  const incidenciasMedia = EQUIPOS.filter(e => e.estado === 'En Mantenimiento' || e.estado === 'Mantenimiento').length;

  res.json({
    totalEquipos,
    equiposOperativos,
    equiposMantenimiento,
    prestamosActivos,
    tasaOcupacionGlobal: totalEquipos > 0 ? Math.round((prestamosActivos / totalEquipos) * 100) + '%' : '0%',
    incidencias: {
      total: incidenciasAlta + incidenciasMedia,
      alta: incidenciasAlta,
      media: incidenciasMedia
    },
    laboratoriosOcupacion: getOcupacionPorAmbiente()
  });
});

// Calcula, para cada ambiente registrado en EQUIPOS, qué porcentaje de sus
// equipos está actualmente prestado (préstamo con estado 'Activo').
function getOcupacionPorAmbiente() {
  const porAmbiente = {};
  EQUIPOS.forEach(e => {
    if (!porAmbiente[e.ambiente]) porAmbiente[e.ambiente] = { total: 0, prestados: 0 };
    porAmbiente[e.ambiente].total += 1;
  });

  const placasPrestadas = new Set(
    PRESTAMOS.filter(p => p.estado === 'Activo').map(p => p.equipoPlaca.toUpperCase())
  );
  EQUIPOS.forEach(e => {
    if (placasPrestadas.has(e.placaSena.toUpperCase())) {
      porAmbiente[e.ambiente].prestados += 1;
    }
  });

  return Object.entries(porAmbiente).map(([nombre, { total, prestados }]) => ({
    nombre,
    porcentaje: total > 0 ? Math.round((prestados / total) * 100) : 0,
    activo: prestados > 0
  }));
}


if (require.main === module) {
  app.listen(PORT, () => console.log(`🚀 Servidor corriendo en http://localhost:${PORT}/api/v1`));
}

module.exports = { app };
