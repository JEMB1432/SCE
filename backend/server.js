// server.js - VERSIÓN FINAL CON RUTAS
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
require("dotenv").config();

// Importar rutas principales
const apiRoutes = require("./src/routes/index");

// Importar middlewares
const errorHandler = require("./src/middleware/errorHandler");
const notFoundHandler = require("./src/middleware/notFoundHandler");

// Inicializar Express
const app = express();
const PORT = process.env.PORT || 3000;

// ======================
// MIDDLEWARES GLOBALES
// ======================
app.use(helmet());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || [
      "http://localhost:5500",
      "http://127.0.0.1:5500",
    ],
    credentials: true,
  })
);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// ======================
// LOGGING DE REQUESTS
// ======================
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// ======================
// RUTAS DE LA API
// ======================

// Health Check
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Sistema de Control de Estudiantes funcionando correctamente",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
    version: "1.0.0",
  });
});

// Info del sistema
app.get("/api/info", (req, res) => {
  res.json({
    success: true,
    data: {
      name: "Sistema de Control de Estudiantes",
      version: "1.0.0",
      description: "Sistema de gestión académica para instituciones educativas",
      database: "Supabase (PostgreSQL)",
      status: "Operacional",
    },
  });
});

// Rutas principales de la API
app.use("/api", apiRoutes);

// ======================
// MANEJO DE ERRORES
// ======================

// Ruta no encontrada (404)
app.use(notFoundHandler);

// Manejo centralizado de errores
app.use(errorHandler);

// ======================
// INICIO DEL SERVIDOR
// ======================
const startServer = () => {
  try {
    app.listen(PORT, () => {
      console.log("=".repeat(70));
      console.log("Servidor de Control de Estudiantes Iniciado");
      console.log("=".repeat(70));
      console.log(`Puerto: ${PORT}`);
      console.log(`Ambiente: ${process.env.NODE_ENV || "development"}`);
      console.log(`API URL: http://localhost:${PORT}/api`);
      console.log(`Health Check: http://localhost:${PORT}/api/health`);
      console.log(`Documentación: http://localhost:${PORT}/api`);
      console.log("=".repeat(70));
      console.log("Endpoints disponibles:");
      console.log("/api/students");
      console.log("/api/subjects");
      console.log("/api/enrollments");
      console.log("/api/grades");
      console.log("/api/evaluation-types");
      console.log("=".repeat(70));
    });
  } catch (error) {
    console.error("Error al iniciar el servidor:", error);
    process.exit(1);
  }
};

// Manejo graceful de cierre
process.on("SIGINT", () => {
  console.log("\nRecibida señal de cierre (SIGINT)");
  console.log("Cerrando servidor gracefulmente...");
  process.exit(0);
});

process.on("SIGTERM", () => {
  console.log("\nRecibida señal de terminación (SIGTERM)");
  console.log("Cerrando servidor gracefulmente...");
  process.exit(0);
});

// Iniciar servidor
startServer();

module.exports = app;
