import { exec } from 'child_process';

export const mostrarInicio = (req, res) => {
    res.render('paginas/public/inicio', {
        titulo: 'Inicio - SysTools',
        descripcion: 'Herramientas básicas para redes y sistemas.',
        zona: 'public'
      });      
};

export const mostrarIp = (req, res) => {
  res.render('paginas/public/ip', {
    titulo: 'Tu IP Pública',
    zona: 'public'
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
      resultado: []
    });
  };
  

export const procesarEscaner = (req, res) => {
    const { rango } = req.body;
  
    if (!rango) {
      return res.render('paginas/public/escaner', {
        titulo: 'Escáner LAN',
        descripcion: 'Escanea una red local para detectar dispositivos activos.',
        zona: 'public',
        resultado: ['Rango no válido']
      });
    }
  
    exec(`nmap -sn ${rango}`, (err, stdout) => {
      if (err) {
        return res.render('paginas/public/escaner', {
          titulo: 'Escáner LAN',
          descripcion: 'Escaneo fallido al ejecutar Nmap.',
          zona: 'public',
          resultado: ['Error al ejecutar nmap']
        });
      }
  
      const ips = stdout.match(/\d+\.\d+\.\d+\.\d+/g) || [];
      res.render('paginas/public/escaner', {
        titulo: 'Escáner LAN',
        descripcion: 'Resultados del escaneo.',
        zona: 'public',
        resultado: [...new Set(ips)]
      });
    });
  };
  

  export const mostrarWhois = (req, res) => {
    res.render('paginas/public/whois', {
      titulo: 'Consulta WHOIS',
      descripcion: 'Consulta los datos WHOIS de un dominio.',
      zona: 'public',
      resultado: null
    });
  };
  

export const procesarWhois = (req, res) => {
  const { dominio } = req.body;
  if (!dominio) return res.render('paginas/public/whois', { titulo: 'Consulta WHOIS', zona: 'public', resultado: 'Dominio inválido' });

  exec(`whois ${dominio}`, (err, stdout) => {
    if (err) return res.render('paginas/public/whois', { titulo: 'Consulta WHOIS', zona: 'public', resultado: 'Error en whois' });

    res.render('paginas/public/whois', { titulo: 'Consulta WHOIS', zona: 'public', resultado: stdout });
  });
};

export const mostrarDNS = (req, res) => {
    res.render('paginas/public/dns', {
      titulo: 'Herramientas DNS',
      descripcion: 'Consulta registros DNS de dominios fácilmente.',
      zona: 'public',
      resultado: null
    });
  };
  

export const procesarDNS = (req, res) => {
  const { dominio, tipo } = req.body;
  if (!dominio || !tipo) return res.render('paginas/public/dns', { titulo: 'Herramientas DNS', zona: 'public', resultado: 'Datos incompletos' });

  exec(`dig +short ${dominio} ${tipo}`, (err, stdout) => {
    if (err) return res.render('paginas/public/dns', { titulo: 'Herramientas DNS', zona: 'public', resultado: 'Error en dig' });

    res.render('paginas/public/dns', { titulo: 'Herramientas DNS', zona: 'public', resultado: stdout });
  });
};
