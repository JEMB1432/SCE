const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const userController = require("../controllers/userController");
const authMiddleware = require("../middleware/auth");

// Rutas públicas
router.post("/login", authController.login);
router.post(
  "/register",
  authMiddleware.authenticateToken,
  authMiddleware.requireAdmin,
  authController.register
);

// Rutas protegidas
router.get(
  "/me",
  authMiddleware.authenticateToken,
  authController.getCurrentUser
);

// Rutas de gestión de usuarios (solo admin)
router.get(
  "/users",
  authMiddleware.authenticateToken,
  authMiddleware.requireAdmin,
  userController.getAllUsers
);
router.get(
  "/users/:id",
  authMiddleware.authenticateToken,
  userController.getUserById
);
router.put(
  "/users/:id",
  authMiddleware.authenticateToken,
  authMiddleware.requireAdmin,
  userController.updateUser
);
router.delete(
  "/users/:id",
  authMiddleware.authenticateToken,
  authMiddleware.requireAdmin,
  userController.deleteUser
);

module.exports = router;
