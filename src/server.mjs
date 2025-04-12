import app from './app.mjs';
import config from './config/index.mjs';

let server;

try {
  server = app.listen(config.PORT, () => {
    console.log(`🚀 Servidor iniciado en http://localhost:${config.PORT}`);
  });
} catch (error) {
  console.error('❌ Error al iniciar el servidor:', error);
  process.exit(1);
}

export default server;
