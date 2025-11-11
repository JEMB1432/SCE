const User = require("../models/User");

class UserController {
  // GET /api/users (Solo admin)
  async getAllUsers(req, res, next) {
    try {
      const users = await User.findAll();

      res.status(200).json({
        success: true,
        count: users.length,
        data: users,
      });
    } catch (error) {
      next(error);
    }
  }

  // GET /api/users/:id (Solo admin o el propio usuario)
  async getUserById(req, res, next) {
    try {
      const { id } = req.params;

      // Verificar permisos (admin o el propio usuario)
      if (req.user.role !== "admin" && req.user.id !== id) {
        return res.status(403).json({
          success: false,
          message: "No tienes permisos para ver este usuario",
        });
      }

      const user = await User.findById(id);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "Usuario no encontrado",
        });
      }

      // No enviar el hash de la contraseña
      const { password_hash, ...userData } = user;

      res.status(200).json({
        success: true,
        data: userData,
      });
    } catch (error) {
      next(error);
    }
  }

  // PUT /api/users/:id (Solo admin)
  async updateUser(req, res, next) {
    try {
      const { id } = req.params;
      const { firstName, lastName, role, isActive, password } = req.body;

      const userData = {
        firstName,
        lastName,
        role,
        isActive,
        password,
      };

      const updatedUser = await User.updateUser(id, userData);

      res.status(200).json({
        success: true,
        message: "Usuario actualizado exitosamente",
        data: updatedUser,
      });
    } catch (error) {
      next(error);
    }
  }

  // DELETE /api/users/:id (Solo admin)
  async deleteUser(req, res, next) {
    try {
      const { id } = req.params;

      // No permitir eliminar el propio usuario
      if (req.user.id === id) {
        return res.status(400).json({
          success: false,
          message: "No puedes eliminar tu propio usuario",
        });
      }

      await User.deleteUser(id);

      res.status(200).json({
        success: true,
        message: "Usuario eliminado exitosamente",
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new UserController();