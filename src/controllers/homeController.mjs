export const mostrarHome = (req, res) => {
    res.render('paginas/public/index', {
      titulo: 'Inicio - SysTools',
      zona: 'public'
    });
  };
  