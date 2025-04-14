import { exec } from 'child_process';
import { sanitize } from '../utils/seguridad/sanitize.mjs';

export const mostrarInicio = (req, res) => {
    res.render('paginas/public/inicio', {
        titulo: 'Inicio - SysTools',
        descripcion: 'Herramientas básicas para redes y sistemas.',
        zona: 'public',
        vista: 'inicio'
    });      
};

export const mostrarIp = (req, res) => {
  res.render('paginas/public/ip', {
    titulo: 'Tu IP Pública',
    zona: 'public',
    vista: 'ip'
  });
};

export const obtenerIpPublica = (req, res) => {
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  res.json({ ip });
};

export const mostrarEscaner = (req, res) => {
    res.render('paginas/public/escaner', {
      titulo: 'Escáner LAN Básico',
      descripcion: 'Escanea una red local para detectar dispositivos activos.',
      zona: 'public',
      vista: 'escaner',
      resultado: []
    });
};

export const procesarEscaner = async (req, res) => {
    const { rango } = req.body;
    
    if (!rango) {
        return res.status(400).json({ 
            error: 'Rango de red no proporcionado' 
        });
    }

    const rangoSanitizado = sanitize.text(rango);
    
    exec(`nmap -sn ${rangoSanitizado}`, (err, stdout) => {
        if (err) {
            return res.status(500).json({ 
                error: 'Error al realizar el escaneo de red' 
            });
        }

        const ips = stdout.match(/\d+\.\d+\.\d+\.\d+/g) || [];
        res.json({
            success: true,
            resultado: [...new Set(ips)]
        });
    });
};

export const mostrarWhois = (req, res) => {
    res.render('paginas/public/whois', {
      titulo: 'Consulta WHOIS',
      descripcion: 'Consulta los datos WHOIS de un dominio.',
      zona: 'public',
      vista: 'whois',
      resultado: null
    });
};

export const procesarWhois = async (req, res) => {
    const { dominio } = req.body;
    
    if (!dominio) {
        return res.status(400).json({ 
            error: 'Dominio no proporcionado' 
        });
    }

    const dominioSanitizado = sanitize.text(dominio);
    
    exec(`whois ${dominioSanitizado}`, (err, stdout) => {
        if (err) {
            return res.status(500).json({ 
                error: 'Error al realizar la consulta WHOIS' 
            });
        }

        res.json({
            success: true,
            resultado: stdout.trim()
        });
    });
};

export const mostrarDNS = (req, res) => {
    res.render('paginas/public/dns', {
      titulo: 'Herramientas DNS',
      descripcion: 'Consulta registros DNS de dominios fácilmente.',
      zona: 'public',
      vista: 'dns',
      resultado: null
    });
};

export const procesarDNS = async (req, res) => {
    const { dominio, tipo } = req.body;
    
    if (!dominio || !tipo) {
        return res.status(400).json({ 
            error: 'Datos incompletos para la consulta DNS' 
        });
    }

    const dominioSanitizado = sanitize.text(dominio);
    const tipoSanitizado = sanitize.text(tipo);
    
    exec(`dig +short ${dominioSanitizado} ${tipoSanitizado}`, (err, stdout) => {
        if (err) {
            return res.status(500).json({ 
                error: 'Error al realizar la consulta DNS' 
            });
        }

        res.json({
            success: true,
            resultado: stdout.trim()
        });
    });
};
