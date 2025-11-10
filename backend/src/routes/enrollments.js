const express = require("express");
const router = express.Router();
const enrollmentController = require("../controllers/enrollmentController");
const gradeController = require("../controllers/gradeController");

// @route   GET /api/enrollments
// @desc    Obtener todas las inscripciones
// @access  Public
router.get("/", enrollmentController.getAllEnrollments);

// @route   GET /api/enrollments/:id
// @desc    Obtener inscripción por ID
// @access  Public
router.get("/:id", enrollmentController.getEnrollmentById);

// @route   GET /api/students/:studentId/enrollments
// @desc    Obtener inscripciones de un estudiante
// @access  Public
router.get(
  "/students/:studentId/enrollments",
  enrollmentController.getStudentEnrollments
);

// @route   GET /api/subjects/:subjectId/enrollments
// @desc    Obtener inscripciones de una materia
// @access  Public
router.get(
  "/subjects/:subjectId/enrollments",
  enrollmentController.getSubjectEnrollments
);

// @route   POST /api/enrollments
// @desc    Crear nueva inscripción
// @access  Public
router.post("/", enrollmentController.createEnrollment);

// @route   PUT /api/enrollments/:id
// @desc    Actualizar inscripción
// @access  Public
router.put("/:id", enrollmentController.updateEnrollment);

// @route   DELETE /api/enrollments/:id
// @desc    Eliminar inscripción
// @access  Public
router.delete("/:id", enrollmentController.deleteEnrollment);

// Rutas de calificaciones para esta inscripción
// @route   GET /api/enrollments/:enrollmentId/grades
// @desc    Obtener calificaciones de una inscripción
// @access  Public
router.get("/:enrollmentId/grades", gradeController.getGradesByEnrollment);

// @route   GET /api/enrollments/:enrollmentId/final-grade
// @desc    Calcular nota final de una inscripción
// @access  Public
router.get("/:enrollmentId/final-grade", gradeController.calculateFinalGrade);

module.exports = router;
