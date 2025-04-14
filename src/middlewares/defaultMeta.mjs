export function aplicarDatosPorDefecto(req, res, next) {
    res.locals.titulo = 'SysTools';
    res.locals.descripcion = 'Herramientas online para técnicos de redes y sistemas';
    res.locals.estilosExtra = [];
    res.locals.tema = 'tema-oscuro';
    res.locals.zona = 'public';
    res.locals.usuario = req.session?.usuario || null;
    next();
  }
  