// Configuración base de seguridad
const seguridad = {
    // Sanitización de entrada
    sanitize: {
        text: (input) => {
            if (typeof input !== 'string') return '';
            return input
                .replace(/[<>"'`=&\/\\(){}[\];!%$#@*+,:?^~]/g, '')
                .replace(/\b(?:on\w+|javascript:|data:|vbscript:|expression\(|eval\(|alert\(|document\.|window\.|localStorage\.|sessionStorage\.|indexedDB\.|XMLHttpRequest)\b/gi, '')
                .replace(/<!--[\s\S]*?-->/g, '')
                .substring(0, 500);
        },
        url: (url) => {
            if (typeof url !== 'string') return '';
            try {
                const urlObj = new URL(url);
                const allowedDomains = [
                    'davidalvarez.dev',
                    'cdn.davidalvarez.dev',
                    'cdnjs.cloudflare.com'
                ];
                if (!['http:', 'https:'].includes(urlObj.protocol)) return '';
                if (!allowedDomains.some(domain => urlObj.hostname.endsWith(domain))) return '';
                return urlObj.toString();
            } catch {
                if (url.startsWith('/') || url.startsWith('#')) {
                    return url.replace(/[^\w\-\/\?\&\=\.#]/g, '');
                }
                return '';
            }
        },
        json: (input) => {
            if (typeof input === 'string') {
                try {
                    input = JSON.parse(input);
                } catch {
                    return null;
                }
            }

            const sanitizeValue = (value) => {
                if (typeof value === 'string') return seguridad.sanitize.text(value);
                if (Array.isArray(value)) return value.map(v => sanitizeValue(v));
                if (typeof value === 'object' && value !== null) {
                    return Object.fromEntries(
                        Object.entries(value)
                            .filter(([k]) => k.length <= 50)
                            .map(([k, v]) => [
                                seguridad.sanitize.text(k),
                                sanitizeValue(v)
                            ])
                    );
                }
                return value;
            };

            return sanitizeValue(input);
        },
        html: (input) => {
            if (typeof input !== 'string') return '';
            const div = document.createElement('div');
            div.textContent = input;
            return div.innerHTML;
        }
    },

    // Validación de entrada
    validate: {
        text: (input, maxLength = 1000) => {
            if (typeof input !== 'string') return false;
            if (input.length > maxLength) return false;
            return !/[<>'"&`]/.test(input) && !/\b(?:javascript|expression|eval)\b/i.test(input);
        },
        url: (url) => {
            if (typeof url !== 'string') return false;
            try {
                const urlObj = new URL(url);
                if (!['http:', 'https:'].includes(urlObj.protocol)) return false;
                const allowedDomains = [
                    'davidalvarez.dev',
                    'cdn.davidalvarez.dev',
                    'cdnjs.cloudflare.com'
                ];
                return allowedDomains.some(domain => urlObj.hostname.endsWith(domain));
            } catch {
                return (url.startsWith('/') || url.startsWith('#')) && !/[<>'"&`]/.test(url);
            }
        },
        email: (email) => {
            if (typeof email !== 'string') return false;
            return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,20}$/.test(email) &&
                   email.length <= 254;
        },
        phone: (phone) => {
            if (typeof phone !== 'string') return false;
            return /^[+]?[(]?[0-9]{1,4}[)]?[-\s.0-9]{7,15}$/.test(phone);
        }
    },

    // Protección contra CSRF
    csrf: {
        token: null,
        setToken: () => {
            const buffer = new Uint8Array(32);
            crypto.getRandomValues(buffer);
            seguridad.csrf.token = Array.from(buffer)
                .map(b => b.toString(16).padStart(2, '0'))
                .join('');
            return seguridad.csrf.token;
        },
        validateToken: (token) => {
            if (!token || typeof token !== 'string') return false;
            return token === seguridad.csrf.token;
        }
    },

    // Gestión segura de localStorage
    storage: {
        set: (key, value) => {
            const keysPermitidas = ['theme', 'language'];
            if (!keysPermitidas.includes(key)) return false;
            try {
                const valorSeguro = seguridad.sanitize.text(value);
                if (!valorSeguro) return false;
                const valorFinal = key === 'theme' ? valorSeguro : 
                    btoa(encodeURIComponent(valorSeguro));
                localStorage.setItem(key, valorFinal);
                return true;
            } catch {
                return false;
            }
        },
        get: (key) => {
            const keysPermitidas = ['theme', 'language'];
            if (!keysPermitidas.includes(key)) return null;
            try {
                const valor = localStorage.getItem(key);
                if (!valor) return null;
                const valorFinal = key === 'theme' ? valor : 
                    decodeURIComponent(atob(valor));
                return seguridad.sanitize.text(valorFinal);
            } catch {
                return null;
            }
        },
        remove: (key) => {
            const keysPermitidas = ['theme', 'language'];
            if (!keysPermitidas.includes(key)) return false;
            try {
                localStorage.removeItem(key);
                return true;
            } catch {
                return false;
            }
        }
    },

    // Control de intentos (rate limiting)
    intentos: {},
    verificarIntentos: (accion) => {
        const ahora = Date.now();
        const maxIntentos = 5;
        const tiempoBloqueo = 15 * 60 * 1000;

        if (!seguridad.intentos[accion]) {
            seguridad.intentos[accion] = {
                contador: 0,
                ultimoIntento: ahora,
                bloqueoHasta: null
            };
        }

        const datos = seguridad.intentos[accion];
        if (datos.bloqueoHasta && ahora < datos.bloqueoHasta) return false;
        if (datos.bloqueoHasta && ahora >= datos.bloqueoHasta) {
            datos.contador = 0;
            datos.bloqueoHasta = null;
        }

        return datos.contador < maxIntentos;
    },
    registrarIntento: (accion) => {
        const ahora = Date.now();
        if (!seguridad.intentos[accion]) {
            seguridad.intentos[accion] = {
                contador: 0,
                ultimoIntento: ahora,
                bloqueoHasta: null
            };
        }

        const datos = seguridad.intentos[accion];
        datos.contador++;
        datos.ultimoIntento = ahora;
        if (datos.contador >= 5) {
            datos.bloqueoHasta = ahora + (15 * 60 * 1000);
        }
    }
};

// Protecciones inmediatas (antes de DOMContentLoaded)
if (window.self !== window.top) {
    window.top.location = window.self.location;
}

// Inicialización al cargar
document.addEventListener('DOMContentLoaded', () => {
    // Sobreescribir localStorage
    const originalSetItem = localStorage.setItem;
    const originalGetItem = localStorage.getItem;
    const originalRemoveItem = localStorage.removeItem;

    localStorage.setItem = (key, value) => seguridad.storage.set(key, value);
    localStorage.getItem = (key) => seguridad.storage.get(key);
    localStorage.removeItem = (key) => seguridad.storage.remove(key);

    // Limpieza periódica de intentos
    setInterval(() => {
        const ahora = Date.now();
        for (const [key, datos] of Object.entries(seguridad.intentos)) {
            if (datos.bloqueoHasta && ahora >= datos.bloqueoHasta) {
                delete seguridad.intentos[key];
            }
        }
    }, 60000);

    // Token CSRF
    seguridad.csrf.setToken();

    // Copiar texto: sanitizado
    document.addEventListener('copy', (e) => {
        const selection = document.getSelection();
        if (selection) {
            e.clipboardData.setData('text/plain', seguridad.sanitize.text(selection.toString()));
            e.preventDefault();
        }
    });

    // ⚠️ Protección activa
    document.addEventListener("contextmenu", (e) => e.preventDefault());

    document.addEventListener("keydown", (e) => {
        if ((e.ctrlKey && ["u", "i", "j", "s"].includes(e.key.toLowerCase())) || 
            e.key === "F12" || 
            (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "i")) {
            e.preventDefault();
            return false;
        }
    });

    document.onkeypress = function(event) {
        if (event.ctrlKey && (event.keyCode === 10 || event.keyCode === 13)) {
            event.preventDefault();
        }
    };

    document.onmousedown = function(event) {
        if(event.button === 2) {
            event.preventDefault();
            return false;
        }
    };

    document.addEventListener('selectstart', (e) => {
        e.preventDefault();
    });
});

// Exportar objeto
window.seguridad = seguridad;
