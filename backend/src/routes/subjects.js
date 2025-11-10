const express = require("express");
const router = express.Router();
const subjectController = require("../controllers/subjectController");
const evaluationTypeController = require("../controllers/evaluationTypeController");

// @route   GET /api/subjects
// @desc    Obtener todas las materias
// @access  Public
router.get("/", subjectController.getAllSubjects);

// @route   GET /api/subjects/:id
// @desc    Obtener materia por ID
// @access  Public
router.get("/:id", subjectController.getSubjectById);

// @route   GET /api/subjects/:id/evaluations
// @desc    Obtener materia con sus tipos de evaluación
// @access  Public
router.get("/:id/evaluations", subjectController.getSubjectWithEvaluations);

// @route   POST /api/subjects
// @desc    Crear nueva materia
// @access  Public
router.post("/", subjectController.createSubject);

// @route   PUT /api/subjects/:id
// @desc    Actualizar materia
// @access  Public
router.put("/:id", subjectController.updateSubject);

// @route   DELETE /api/subjects/:id
// @desc    Eliminar materia
// @access  Public
router.delete("/:id", subjectController.deleteSubject);

// Rutas de tipos de evaluación para esta materia
// @route   GET /api/subjects/:subjectId/evaluation-types
// @desc    Obtener tipos de evaluación de una materia
// @access  Public
router.get(
  "/:subjectId/evaluation-types",
  evaluationTypeController.getEvaluationTypesBySubject
);

module.exports = router;
