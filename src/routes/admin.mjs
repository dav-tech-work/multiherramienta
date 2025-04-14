import express from 'express';
const router = express.Router();

// 🛡 Panel de administración
router.get('/', (req, res) => {
  res.render('paginas/admin/panel', {
    titulo: 'Panel de Administración',
    zona: 'admin',
    usuario: req.usuario
  });
});

// 👥 Gestión de usuarios
router.get('/usuarios', (req, res) => {
  res.render('paginas/admin/usuarios', {
    titulo: 'Gestión de Usuarios',
    zona: 'admin'
  });
});

// 📄 Logs del sistema
router.get('/logs', (req, res) => {
  res.render('paginas/admin/logs', {
    titulo: 'Logs del Sistema',
    zona: 'admin'
  });
});

// ⚙️ Configuración
router.get('/config', (req, res) => {
  res.render('paginas/admin/configuracion', {
    titulo: 'Configuración del Sistema',
    zona: 'admin'
  });
});

// 📊 Auditoría
router.get('/auditoria', (req, res) => {
  res.render('paginas/admin/auditoria', {
    titulo: 'Auditoría del Sistema',
    zona: 'admin'
  });
});

// 🔧 Servicios del sistema
router.get('/servicios', (req, res) => {
  res.render('paginas/admin/servicios', {
    titulo: 'Servicios del Sistema',
    zona: 'admin'
  });
});

export default router;