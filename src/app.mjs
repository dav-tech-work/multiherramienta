import express from 'express';
import path from 'node:path';
import config from './config/index.mjs';

import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import session from 'express-session';
import ejsMate from 'ejs-mate';

import routes from './routes/public.mjs';
import { aplicarDatosPorDefecto } from './middlewares/defaultMeta.mjs';
import { csrfProtection } from './middlewares/csrf.mjs';

const app = express();

// 🧠 Configurar EJS-mate como motor de vistas
app.engine('ejs', ejsMate);
app.set('views', path.join(config.ROOT, 'views'));
app.set('view engine', 'ejs');

// 🛡️ Seguridad básica con Helmet
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      ...helmet.contentSecurityPolicy.getDefaultDirectives(),
      "script-src": ["'self'", "'unsafe-inline'", "https://unpkg.com", "https://cdnjs.cloudflare.com"],
      "style-src": ["'self'", "'unsafe-inline'", "https://unpkg.com", "https://cdnjs.cloudflare.com"],
      "img-src": ["'self'", "data:", "https:"],
      "font-src": ["'self'", "https://cdnjs.cloudflare.com"]
    },
  }
}));

// 📋 Logging solo en desarrollo
if (config.IS_DEV) {
  app.use(morgan('dev'));
}

// 🍪 Soporte para cookies y sesiones
app.use(cookieParser());
app.use(session({
  secret: process.env.SESSION_SECRET || 'secreto-desarrollo',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: !config.IS_DEV,
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 horas
  }
}));

// 🔠 Body parsers con límites definidos en la config
app.use(express.json({ limit: config.LIMITS.JSON }));
app.use(express.urlencoded({ extended: true, limit: config.LIMITS.URLENCODED }));

// 🚨 Limitador de peticiones para proteger de abusos
app.use(rateLimit({
  windowMs: config.RATE_LIMIT.WINDOW_MS,
  max: config.RATE_LIMIT.MAX_REQUESTS,
  message: config.RATE_LIMIT.MESSAGE
}));

// 📁 Archivos estáticos (public/) con caché y tipos MIME
express.static.mime.define({'text/css': ['css']});
express.static.mime.define({'application/javascript': ['js']});
app.use(express.static(config.PUBLIC, {
  maxAge: config.CACHE.MAX_AGE,
  setHeaders: (res, path) => {
    if (path.endsWith('.css')) {
      res.setHeader('Content-Type', 'text/css');
    }
    if (path.endsWith('.js')) {
      res.setHeader('Content-Type', 'application/javascript');
    }
  }
}));

// ✅ Middleware de metadatos por defecto
app.use(aplicarDatosPorDefecto);

// 🛡️ Protección CSRF para todas las rutas excepto las que empiezan por /api
app.use((req, res, next) => {
  if (!req.path.startsWith('/api/')) {
    return csrfProtection(req, res, next);
  }
  next();
});

// 🌍 Rutas públicas, privadas y admin
app.use('/', routes);

export default app;
