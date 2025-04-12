import { Router } from 'express';

import homeRoutes from './home.mjs';
import privateRoutes from './protegidas.mjs';
import testRoutes from './test.mjs';

import contactoApi from './api/contacto.mjs';
import emailApi from './api/email.mjs';

const router = Router();

// 🌐 Rutas públicas
router.use('/', homeRoutes);

// 🔐 Rutas privadas (requieren autenticación)
router.use('/private', privateRoutes);

// 🧪 Rutas de prueba/debug
router.use('/test', testRoutes);

// 📦 API REST
router.use('/api/contacto', contactoApi);
router.use('/api/email', emailApi);

export default router;
