import config from './index.mjs';
import { mostrarHome } from '../controllers/homeController.mjs';

export const crearContenedor = async () => {
  const ipService = await import('../services/red/ipService.mjs');
  const escaneoService = await import('../services/red/escaneoService.mjs');
  const redController = await import('../controllers/redController.mjs');
  const usuarioController = await import('../controllers/usuarioController.mjs');

  return {
    config,
    services: {
      ip: ipService.default,
      escaneo: escaneoService.default
    },
    controllers: {
      home: mostrarHome,
      red: redController.default,
      usuarios: usuarioController.default
    }
  };
};
