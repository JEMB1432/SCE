const JWTUtils = require("../utils/jwt");
const User = require("../models/User");

const authMiddleware = {
  // Middleware para verificar token JWT
  authenticateToken: async (req, res, next) => {
    try {
      const token = JWTUtils.extractTokenFromHeader(req.headers.authorization);
      const decoded = JWTUtils.verifyToken(token);

      // Verificar que el usuario aún existe y está activo
      const user = await User.findById(decoded.userId);
      if (!user || !user.is_active) {
        return res.status(401).json({
          success: false,
          message: "Usuario no autorizado o inactivo",
        });
      }

      // Agregar información del usuario al request
      req.user = {
        id: user.id,
        email: user.email,
        role: user.role,
        firstName: user.first_name,
        lastName: user.last_name,
      };

      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: error.message,
      });
    }
  },

  // Middleware para verificar rol de administrador
  requireAdmin: (req, res, next) => {
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Se requieren privilegios de administrador",
      });
    }
    next();
  },

  // Middleware para verificar rol de profesor o admin
  requireTeacherOrAdmin: (req, res, next) => {
    if (!["admin", "teacher"].includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Se requieren privilegios de profesor o administrador",
      });
    }
    next();
  },
};

module.exports = authMiddleware;
