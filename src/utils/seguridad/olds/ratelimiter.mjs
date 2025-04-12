import config from "../../../config/index.mjs";
import { registrar } from "../../servicios/logger.mjs";

class RateLimiter {
  constructor(
    maxIntentos = config.RATE_LIMIT.MAX_REQUESTS,
    tiempoBloqueoMs = config.RATE_LIMIT.WINDOW_MS,
    limpiezaIntervalMs = 10 * 60 * 1000
  ) {
    this.maxIntentos = maxIntentos;
    this.tiempoBloqueo = tiempoBloqueoMs;
    this.intentos = new Map(); // Almacena el estado por clave (generalmente la IP)
    this.maxEntradas = config.RATE_LIMIT.STORE_SIZE || 10000;
    this.ipsSospechosas = new Set();

    // Iniciar limpieza periódica para eliminar entradas antiguas
    this.intervaloLimpieza = setInterval(() => {
      this.limpiarBloqueosExpirados();
    }, limpiezaIntervalMs);

    registrar(
      `Rate limiter inicializado: ${maxIntentos} puntos por ${tiempoBloqueoMs / 1000}s`,
      "info"
    );
  }

  /**
   * Verifica si la solicitud de la clave dada puede procesarse teniendo en cuenta
   * el contador actual y el peso de la solicitud.
   *
   * @param {string} clave - Identificador único (por ejemplo, la IP).
   * @param {number} weight - Peso de la solicitud (por defecto 1).
   * @returns {boolean} - true si se puede procesar la solicitud, false en caso contrario.
   */
  verificar(clave, weight = 1) {
    const ahora = Date.now();
    if (!this.intentos.has(clave)) {
      this.intentos.set(clave, {
        contador: 0,
        inicioVentana: ahora,
        bloqueoHasta: null,
        intentosFallidos: 0,
        patron: [],
      });
    }

    const estado = this.intentos.get(clave);

    // Si se excede la ventana de tiempo, reiniciamos el contador y actualizamos la ventana.
    if (ahora - estado.inicioVentana > this.tiempoBloqueo) {
      estado.contador = 0;
      estado.inicioVentana = ahora;
      estado.bloqueoHasta = null;
    }

    // Si está bloqueado, se actualiza el bloqueo y se rechaza.
    if (estado.bloqueoHasta && ahora < estado.bloqueoHasta) {
      estado.bloqueoHasta = Math.min(
        estado.bloqueoHasta + this.tiempoBloqueo * 0.1,
        ahora + this.tiempoBloqueo * 3
      );
      return false;
    }

    return estado.contador < this.maxIntentos;
  }

  /**
   * Registra la solicitud para una clave, aumentando el contador según el peso.
   * También gestiona intentos fallidos, patrón de solicitudes y bloqueos.
   *
   * @param {string} clave - Identificador único (por ejemplo, la IP).
   * @param {string} ruta - Ruta solicitada.
   * @param {boolean} exito - Indica si la solicitud fue exitosa (para resetear fallos).
   * @param {number} weight - Peso de la solicitud.
   */
  registrar(clave, ruta = "", exito = true, weight = 1) {
    const ahora = Date.now();
    if (!this.intentos.has(clave)) {
      this.intentos.set(clave, {
        contador: 0,
        inicioVentana: ahora,
        bloqueoHasta: null,
        intentosFallidos: 0,
        patron: [],
      });
    }
    const estado = this.intentos.get(clave);

    // Reiniciamos si la ventana de tiempo se ha agotado
    if (ahora - estado.inicioVentana > this.tiempoBloqueo) {
      estado.contador = 0;
      estado.inicioVentana = ahora;
      estado.bloqueoHasta = null;
    }

    // Incrementamos el contador en función del peso recibido
    estado.contador += weight;
    estado.ultimoAcceso = ahora;

    // Guardamos un historial de la solicitud (hasta 10 entradas)
    estado.patron.push({
      ruta,
      tiempo: ahora,
      exito,
    });
    if (estado.patron.length > 10) {
      estado.patron.shift();
    }

    if (!exito) {
      estado.intentosFallidos++;
      if (estado.intentosFallidos >= 5) {
        this.ipsSospechosas.add(clave);
        registrar(
          `IP marcada como sospechosa: ${clave} (${estado.intentosFallidos} intentos fallidos)`,
          "warn"
        );
        estado.bloqueoHasta = ahora + this.tiempoBloqueo * 3;
        return;
      }
    } else {
      estado.intentosFallidos = 0;
    }

    // Si se supera el límite, se establece el bloqueo
    if (estado.contador >= this.maxIntentos) {
      estado.bloqueoHasta = ahora + this.tiempoBloqueo;
      registrar(
        `Rate limit aplicado a ${clave} por ${this.tiempoBloqueo / 1000}s`,
        "warn"
      );
    }

    this.detectarPatronesAtaque(clave, estado);

    if (this.intentos.size > this.maxEntradas) {
      this.controlarTamano();
    }
  }

  /**
   * Verifica y registra la solicitud con el peso indicado.
   * Retorna true si se permite la solicitud, false en caso contrario.
   *
   * @param {string} clave - Identificador único (por ejemplo, la IP).
   * @param {string} ruta - Ruta solicitada.
   * @param {number} weight - Peso de la solicitud.
   */
  permitir(clave, ruta = "", weight = 0.5) {
    // Si la IP ya está marcada como sospechosa y ha acumulado suficientes puntos, se rechaza.
    if (this.ipsSospechosas.has(clave)) {
      const estado = this.intentos.get(clave);
      if (estado && estado.contador > this.maxIntentos / 2) {
        return false;
      }
    }

    const permitido = this.verificar(clave, weight);
    if (!permitido) return false;

    this.registrar(clave, ruta, true, weight);
    return true;
  }

  // Detecta patrones sospechosos de abuso (por ejemplo, accesos muy rápidos o escaneo de rutas).
  detectarPatronesAtaque(clave, estado) {
    const patron = estado.patron;
    if (patron.length < 5) return;

    const tiempos = patron.map((p) => p.tiempo);
    let accesosRapidos = 0;
    for (let i = 1; i < tiempos.length; i++) {
      if (tiempos[i] - tiempos[i - 1] < 500) {
        accesosRapidos++;
      }
    }
    if (accesosRapidos >= 4) {
      this.ipsSospechosas.add(clave);
      registrar(
        `Posible bot detectado: ${clave} (${accesosRapidos} accesos rápidos)`,
        "warn"
      );
      estado.bloqueoHasta = Date.now() + this.tiempoBloqueo * 2;
    }

    const rutas = new Set(patron.map((p) => p.ruta));
    if (rutas.size >= 5 && patron.length >= 5) {
      this.ipsSospechosas.add(clave);
      registrar(
        `Posible escaneo de rutas: ${clave} (${rutas.size} rutas diferentes)`,
        "warn"
      );
    }
  }

  // Limpia las entradas de IPs que ya no están bloqueadas y elimina las que llevan inactivas más de 1 hora.
  limpiarBloqueosExpirados() {
    const ahora = Date.now();
    for (const [clave, estado] of this.intentos.entries()) {
      if (estado.bloqueoHasta && ahora >= estado.bloqueoHasta) {
        estado.contador = 0;
        estado.bloqueoHasta = null;
      }
      if (ahora - estado.ultimoAcceso > 60 * 60 * 1000) {
        this.intentos.delete(clave);
        this.ipsSospechosas.delete(clave);
      }
    }
    registrar(
      `Rate limiter: ${this.intentos.size} IPs en seguimiento, ${this.ipsSospechosas.size} sospechosas`,
      "debug"
    );
  }

  // Controla el tamaño del almacén eliminando el 20% de las entradas más antiguas.
  controlarTamano() {
    const entradas = Array.from(this.intentos.entries())
      .map(([clave, estado]) => ({ clave, ultimoAcceso: estado.ultimoAcceso }))
      .sort((a, b) => a.ultimoAcceso - b.ultimoAcceso);
    const eliminar = Math.floor(entradas.length * 0.2);
    for (let i = 0; i < eliminar; i++) {
      this.intentos.delete(entradas[i].clave);
      this.ipsSospechosas.delete(entradas[i].clave);
    }
    registrar(`Rate limiter: eliminadas ${eliminar} entradas antiguas`, "debug");
  }

  // Devuelve estadísticas actuales del rate limiter.
  obtenerEstadisticas() {
    return {
      totalIPs: this.intentos.size,
      ipsBloqueadas: Array.from(this.intentos.entries()).filter(
        ([, estado]) => estado.bloqueoHasta && estado.bloqueoHasta > Date.now()
      ).length,
      ipsSospechosas: this.ipsSospechosas.size,
    };
  }

  // Detiene el intervalo de limpieza al finalizar la aplicación.
  detener() {
    if (this.intervaloLimpieza) {
      clearInterval(this.intervaloLimpieza);
      registrar("Rate limiter detenido correctamente", "info");
    }
  }
}

export default RateLimiter;
