import express from 'express';
import path from 'node:path';
import config from './config/index.mjs';

import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';

import routes from './routes/index.mjs';

const app = express();

// 🛡️ Seguridad básica con Helmet
app.use(helmet());

// 📋 Logging solo en desarrollo
if (config.IS_DEV) {
  app.use(morgan('dev'));
}

// 🍪 Soporte para cookies
app.use(cookieParser());

// 🔠 Body parsers con límites definidos en la config
app.use(express.json({ limit: config.LIMITS.JSON }));
app.use(express.urlencoded({ extended: true, limit: config.LIMITS.URLENCODED }));

// 🚨 Limitador de peticiones para proteger de abusos
app.use(rateLimit({
  windowMs: config.RATE_LIMIT.WINDOW_MS,
  max: config.RATE_LIMIT.MAX_REQUESTS,
  message: config.RATE_LIMIT.MESSAGE
}));

// 📁 Archivos estáticos (public/) con caché
app.use(express.static(config.PUBLIC, {
  maxAge: config.CACHE.MAX_AGE
}));

// 🧠 Motor de vistas (EJS)
app.set('views', path.join(config.ROOT, 'views'));
app.set('view engine', 'ejs');

// 🌍 Rutas principales montadas
app.use('/', routes);

export default app;
