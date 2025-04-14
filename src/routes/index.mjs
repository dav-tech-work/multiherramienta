import { Router } from 'express';

import homeRoutes from './public.mjs';
import protegidasRoutes from './protegidas.mjs';
import testRoutes from './test.mjs';

import contactoApi from './api/contacto.mjs';
import emailApi from './api/email.mjs';

const router = Router();

// 🌐 Rutas públicas
router.use('/', homeRoutes);

// 🔐 Rutas privadas y admin
router.use('/private', protegidasRoutes);
router.use('/admin', protegidasRoutes);

// 🧪 Rutas de prueba/debug
router.use('/test', testRoutes);

// 📦 API REST
router.use('/api/contacto', contactoApi);
router.use('/api/email', emailApi);

export default router;
