# 🔧 Multiherramienta Técnica

Aplicación web modular con utilidades diseñadas para técnicos de sistemas y redes.  
Incluye funcionalidades públicas como escaneo de red e IP pública, y una zona privada y administrativa protegida por login.

---

## 🚀 Características principales

- Backend modular en **Node.js + Express**
- Vistas dinámicas con **EJS**
- Arquitectura sólida, escalable y mantenible
- Sistema de **logs avanzado** con rotación y compresión
- Gestión de IP y red como microservicios SaaS
- Seguridad mejorada con Helmet, CSRF, Rate Limit, Sanitizers
- Sistema de internacionalización y temas (oscuro/claro)
- Preparado para despliegue en producción vía Docker

---

## 📁 Estructura del proyecto

```plaintext
.
├── public/               # Archivos estáticos (CSS, JS, imágenes)
│   ├── css/              # Estilos globales y por secciones (public, private, admin)
│   ├── js/               # Scripts divididos en config, core, ui, servicios
│   └── img/              # Imágenes
│
├── src/
│   ├── app.mjs           # Inicializa la app Express
│   ├── server.mjs        # Arranca el servidor
│   ├── config/           # Configuración general y contenedor DI
│   ├── controllers/      # Controladores por dominio
│   ├── models/           # Modelos de datos
│   ├── routes/           # Rutas organizadas (api y normales)
│   ├── middlewares/      # Middlewares personalizados
│   └── utils/            # Lógica común: idioma, seguridad, servicios, optimización
│
├── views/
│   ├── layout.ejs        # Plantilla base
│   ├── partials/         # Encabezado, scripts, alertas, footer...
│   └── paginas/          # Vistas por zona: public, private, admin
│
├── uploads/              # Archivos subidos (creada automáticamente)
├── logs/                 # Logs con rotación y compresión
├── .env                  # Variables de entorno
├── .gitignore
└── package.json
```

---

## ⚙️ Instalación

```bash
git clone https://github.com/tuusuario/multiherramienta.git
cd multiherramienta
npm install
```

---

## 🧪 Ejecución local

```bash
npm run dev
# o directamente
node src/server.mjs
```

La app se levantará en:  
[http://localhost:3000](http://localhost:3000)

---

## 🌐 Variables de entorno (`.env`)

```env
PORT=3000
NODE_ENV=development

EMAIL_HOST=smtp.ejemplo.com
EMAIL_PORT=587
EMAIL_USER=usuario@ejemplo.com
EMAIL_PASS=contraseña
```

---

## 🔐 Seguridad implementada

- `helmet`: cabeceras seguras
- `express-rate-limit`: protección contra abusos
- `cookie-parser`: gestión de cookies/sesiones
- `csrf`: protección contra ataques CSRF
- `input sanitization`: entradas limpias
- `logger`: sistema de trazas con rotación y compresión

---

## 📦 TODO (pendientes)

- [ ] Panel administrativo completo
- [ ] Gestión de usuarios y logs desde el frontend
- [ ] Exportación e importación de datos
- [ ] Escaneo de red real vía backend (nmap + Node.js)
- [ ] Despliegue en contenedor Docker

---

## 🧠 Licencia

MIT © [Daniel Arribas](https://daniel-arribas-velazquez.dav-tech.work/)