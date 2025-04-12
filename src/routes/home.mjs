import { Router } from 'express';
import { crearContenedor } from '../config/contenedor.mjs';

const router = Router();

const setup = async () => {
  const contenedor = await crearContenedor();
  router.get('/', contenedor.controllers.home);
};

await setup();

export default router;
