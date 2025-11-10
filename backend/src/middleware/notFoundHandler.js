// src/middleware/notFoundHandler.js
function notFoundHandler(req, res, next) {
  res.status(404).json({
    success: false,
    message: `Ruta no encontrada: ${req.method} ${req.path}`,
    suggestion: 'Verifica la URL o consulta /api/info para ver los endpoints disponibles'
  });
}

module.exports = notFoundHandler;