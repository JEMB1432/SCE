const express = require("express");
const router = express.Router();
const gradeController = require("../controllers/gradeController");

// @route   GET /api/students/:studentId/grades-summary
// @desc    Obtener resumen de calificaciones de un estudiante
// @access  Public
router.get(
  "/students/:studentId/grades-summary",
  gradeController.getStudentGradesSummary
);

// @route   GET /api/students/:studentId/final-grades
// @desc    Obtener notas finales de un estudiante
// @access  Public
router.get(
  "/students/:studentId/final-grades",
  gradeController.getStudentFinalGrades
);

// @route   POST /api/grades
// @desc    Crear o actualizar calificación
// @access  Public
router.post("/", gradeController.createOrUpdateGrade);

module.exports = router;
