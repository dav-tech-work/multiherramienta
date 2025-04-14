import express from 'express';
import rutasPrivadas from './private.mjs';
import rutasAdmin from './admin.mjs';

const router = express.Router();

// 🔐 Middleware general para rutas protegidas (simulado)
const requireAuth = (req, res, next) => {
  const autenticado = true; // Sustituir con lógica real de sesión, JWT, etc.

  if (!autenticado) {
    return res.status(403).render('paginas/public/acceso_denegado', {
      titulo: 'Acceso Denegado',
      tipo: 'error',
      idioma: req.idioma,
      t: req.traducciones,
      mensaje: '🔒 Necesitas estar autenticado para acceder a esta sección.'
    });
  }
  next();
};

// 🔐 Monta rutas privadas
router.use('/private', requireAuth, rutasPrivadas);

// 🛡 Monta rutas admin
router.use('/admin', requireAuth, rutasAdmin);

export default router;
