const User = require("../models/User");
const JWTUtils = require("../utils/jwt");

class AuthController {
  // POST /api/auth/login
  async login(req, res, next) {
    try {
      const { email, password } = req.body;

      // Validaciones
      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: "Email y contraseña son requeridos",
        });
      }

      // Buscar usuario
      const user = await User.findByEmail(email);
      if (!user) {
        return res.status(401).json({
          success: false,
          message: "Credenciales inválidas",
        });
      }

      // Verificar si el usuario está activo
      if (!user.is_active) {
        return res.status(401).json({
          success: false,
          message: "Cuenta desactivada. Contacte al administrador.",
        });
      }

      // Verificar contraseña
      const isPasswordValid = await User.comparePassword(
        password,
        user.password_hash
      );
      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          message: "Credenciales inválidas",
        });
      }

      // Actualizar último login
      await User.updateLastLogin(user.id);

      // Generar token JWT
      const token = JWTUtils.generateToken({
        userId: user.id,
        email: user.email,
        role: user.role,
      });

      // Respuesta exitosa
      res.status(200).json({
        success: true,
        message: "Login exitoso",
        data: {
          token,
          user: {
            id: user.id,
            email: user.email,
            role: user.role,
            firstName: user.first_name,
            lastName: user.last_name,
          },
        },
      });
    } catch (error) {
      next(error);
    }
  }

  // GET /api/auth/me
  async getCurrentUser(req, res, next) {
    try {
      res.status(200).json({
        success: true,
        data: {
          user: req.user,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  // POST /api/auth/register (Solo admin)
  async register(req, res, next) {
    try {
      const { email, password, firstName, lastName, role } = req.body;

      // Validaciones
      if (!email || !password || !firstName || !lastName) {
        return res.status(400).json({
          success: false,
          message: "Todos los campos son requeridos",
        });
      }

      if (password.length < 6) {
        return res.status(400).json({
          success: false,
          message: "La contraseña debe tener al menos 6 caracteres",
        });
      }

      // Verificar si el usuario ya existe
      const existingUser = await User.findByEmail(email);
      if (existingUser) {
        return res.status(409).json({
          success: false,
          message: "El usuario ya existe",
        });
      }

      // Crear usuario
      const userData = {
        email,
        password,
        firstName,
        lastName,
        role: role || "teacher",
      };

      const newUser = await User.create(userData);

      res.status(201).json({
        success: true,
        message: "Usuario creado exitosamente",
        data: {
          user: {
            id: newUser.id,
            email: newUser.email,
            role: newUser.role,
            firstName: newUser.first_name,
            lastName: newUser.last_name,
            isActive: newUser.is_active,
            createdAt: newUser.created_at,
          },
        },
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AuthController();