const express = require("express");
const router = express.Router();

// Importar todas las rutas
const studentRoutes = require("./students");
const subjectRoutes = require("./subjects");
const enrollmentRoutes = require("./enrollments");
const gradeRoutes = require("./grades");
const evaluationTypeRoutes = require("./evaluationTypes");
const authRoutes = require('./auth');

// Usar las rutas
router.use("/students", studentRoutes);
router.use("/subjects", subjectRoutes);
router.use("/enrollments", enrollmentRoutes);
router.use("/grades", gradeRoutes);
router.use("/evaluation-types", evaluationTypeRoutes);
router.use('/auth', authRoutes);


// Ruta de documentación de la API
router.get("/", (req, res) => {
  res.json({
    success: true,
    message: "API del Sistema de Control de Estudiantes",
    version: "1.0.0",
    endpoints: {
      students: {
        "GET /api/students": "Obtener todos los estudiantes",
        "GET /api/students/:id": "Obtener estudiante por ID",
        "GET /api/students/:id/grades": "Obtener calificaciones del estudiante",
        "POST /api/students": "Crear nuevo estudiante",
        "PUT /api/students/:id": "Actualizar estudiante",
        "DELETE /api/students/:id": "Eliminar estudiante",
      },
      subjects: {
        "GET /api/subjects": "Obtener todas las materias",
        "GET /api/subjects/:id": "Obtener materia por ID",
        "GET /api/subjects/:id/evaluations": "Obtener materia con evaluaciones",
        "GET /api/subjects/:subjectId/evaluation-types":
          "Obtener tipos de evaluación",
        "POST /api/subjects": "Crear nueva materia",
        "PUT /api/subjects/:id": "Actualizar materia",
        "DELETE /api/subjects/:id": "Eliminar materia",
      },
      enrollments: {
        "GET /api/enrollments": "Obtener todas las inscripciones",
        "GET /api/enrollments/:id": "Obtener inscripción por ID",
        "GET /api/students/:studentId/enrollments":
          "Obtener inscripciones del estudiante",
        "GET /api/subjects/:subjectId/enrollments":
          "Obtener inscripciones de la materia",
        "GET /api/enrollments/:enrollmentId/grades":
          "Obtener calificaciones de la inscripción",
        "GET /api/enrollments/:enrollmentId/final-grade": "Calcular nota final",
        "POST /api/enrollments": "Crear nueva inscripción",
        "PUT /api/enrollments/:id": "Actualizar inscripción",
        "DELETE /api/enrollments/:id": "Eliminar inscripción",
      },
      grades: {
        "GET /api/students/:studentId/grades-summary":
          "Resumen de calificaciones",
        "GET /api/students/:studentId/final-grades":
          "Notas finales del estudiante",
        "POST /api/grades": "Crear o actualizar calificación",
      },
      evaluationTypes: {
        "POST /api/evaluation-types": "Crear tipo de evaluación",
        "PUT /api/evaluation-types/:id": "Actualizar tipo de evaluación",
        "DELETE /api/evaluation-types/:id": "Eliminar tipo de evaluación",
      },
    },
  });
});

module.exports = router;
