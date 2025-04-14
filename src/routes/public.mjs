import express from 'express';
import {
  mostrarInicio,
  mostrarIp,
  obtenerIpPublica,
  mostrarEscaner,
  procesarEscaner,
  mostrarWhois,
  procesarWhois,
  mostrarDNS,
  procesarDNS
} from '../controllers/publicController.mjs';

const router = express.Router();

// 📄 Página de inicio pública
router.get('/', mostrarInicio);

// 🌐 IP pública
router.get('/ip', mostrarIp);
router.get('/api/ip', obtenerIpPublica);

// 🖧 Escaneo LAN básico
router.get('/escaner-red', mostrarEscaner);
router.post('/escaner-red', procesarEscaner);

// 🔎 WHOIS
router.get('/whois', mostrarWhois);
router.post('/whois', procesarWhois);

// 📡 DNS
router.get('/dns', mostrarDNS);
router.post('/dns', procesarDNS);

export default router;
