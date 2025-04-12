import dotenv from 'dotenv';
dotenv.config();

import path from 'node:path';
import { existsSync, mkdirSync } from 'node:fs';

// 🔍 Entorno
const IS_PROD = process.env.NODE_ENV === 'production';
const IS_DEV = process.env.NODE_ENV === 'development';
const IS_TEST = process.env.NODE_ENV === 'test';

// 🔌 Configuración básica
const PORT = process.env.PORT || 3000;
const ROOT = process.cwd(); // <- se usa para base absoluta

// 📁 Rutas del sistema
const PATHS = {
  ROOT,
  UPLOADS: path.join(ROOT, 'uploads'),
  PUBLIC: path.join(ROOT, 'public'),
  LOGS: path.join(ROOT, 'logs')
};

// Asegurar carpetas necesarias
Object.values(PATHS).forEach((dir) => {
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
});

// 🕒 Caché de archivos estáticos
const CACHE = {
  MAX_AGE: '1d'
};

// 📦 Límites de tamaño para body
const LIMITS = {
  FORM: '1mb',
  JSON: '1mb',
  URLENCODED: '1mb'
};

// 📧 Configuración del correo
const EMAIL = {
  HOST: process.env.EMAIL_HOST,
  PORT: process.env.EMAIL_PORT,
  USER: process.env.EMAIL_USER,
  PASS: process.env.EMAIL_PASS,
  FROM: 'noreply@example.com'  // <- personalízalo si quieres
};

// 🔐 Rate limiting global
const RATE_LIMIT = {
  WINDOW_MS: 5 * 60 * 1000,  // 5 minutos
  MAX_REQUESTS: 100,
  MESSAGE: 'Demasiadas peticiones, espera un poco.'
};

// 📋 Configuración de logs
const LOG = {
  LEVEL: 'info',                // debug, info, warn, error
  FILE_SIZE: 1024 * 1024,       // 1 MB
  MAX_FILES: 10                 // Archivos rotados
};

// 🧠 Exportar toda la configuración
export default {
  IS_PROD,
  IS_DEV,
  IS_TEST,
  PORT,
  ROOT,                     // ✅ ahora sí disponible en app.mjs
  PATHS,
  PUBLIC: PATHS.PUBLIC,     // ✅ express.static() lo necesita
  CACHE,
  LIMITS,
  EMAIL,
  RATE_LIMIT,
  LOG
};
