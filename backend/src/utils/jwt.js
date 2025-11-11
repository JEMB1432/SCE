const jwt = require("jsonwebtoken");

class JWTUtils {
  static generateToken(payload) {
    return jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || "7d",
    });
  }

  static verifyToken(token) {
    try {
      return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      throw new Error("Token inválido o expirado");
    }
  }

  static extractTokenFromHeader(authHeader) {
    if (!authHeader) {
      throw new Error("Token de autorización requerido");
    }

    const parts = authHeader.split(" ");
    if (parts.length !== 2 || parts[0] !== "Bearer") {
      throw new Error("Formato de token inválido");
    }

    return parts[1];
  }
}

module.exports = JWTUtils;
