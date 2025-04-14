import express from 'express';
const router = express.Router();

// 🧑‍💻 Panel del usuario autenticado
router.get('/', (req, res) => {
  res.render('paginas/private/dashboard', {
    titulo: 'Panel de Usuario',
    zona: 'private',
    usuario: req.usuario
  });
});

// 🚀 Herramientas avanzadas
router.get('/nmap', (req, res) => {
  res.render('paginas/private/nmap', {
    titulo: 'Escaneo Nmap',
    zona: 'private'
  });
});

router.get('/nikto', (req, res) => {
  res.render('paginas/private/nikto', {
    titulo: 'Escaneo Nikto',
    zona: 'private'
  });
});

router.get('/puertos', (req, res) => {
  res.render('paginas/private/puertos', {
    titulo: 'Escaneo de Puertos',
    zona: 'private'
  });
});

router.get('/ajustes', (req, res) => {
  res.render('paginas/private/ajustes', {
    titulo: 'Ajustes de Usuario',
    zona: 'private'
  });
});

router.get('/mensajes', (req, res) => {
  res.render('paginas/private/mensajes', {
    titulo: 'Mensajes',
    zona: 'private'
  });
});

router.get('/documentos', (req, res) => {
  res.render('paginas/private/documentos', {
    titulo: 'Documentos Subidos',
    zona: 'private'
  });
});

router.get('/reportes', (req, res) => {
  res.render('paginas/private/reportes', {
    titulo: 'Historial de Reportes',
    zona: 'private'
  });
});

export default router;