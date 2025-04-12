import crypto from "crypto";

const csrf = {
  generarToken: () => {
    return crypto.randomBytes(32).toString("hex");
  },

  validarToken: (tokenRecibido, tokenGuardado) => {
    if (!tokenRecibido || !tokenGuardado) return false;

    try {
      // Verificar que ambos tokens tienen la misma longitud
      if (tokenRecibido.length !== tokenGuardado.length) return false;
      
      // Comparación segura
      return crypto.timingSafeEqual(
        Buffer.from(tokenRecibido),
        Buffer.from(tokenGuardado)
      );
    } catch (err) {
      return false;
    }
  }
};

export default csrf;
