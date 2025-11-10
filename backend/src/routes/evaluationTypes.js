const express = require("express");
const router = express.Router();
const evaluationTypeController = require("../controllers/evaluationTypeController");

// @route   POST /api/evaluation-types
// @desc    Crear nuevo tipo de evaluación
// @access  Public
router.post("/", evaluationTypeController.createEvaluationType);

// @route   PUT /api/evaluation-types/:id
// @desc    Actualizar tipo de evaluación
// @access  Public
router.put("/:id", evaluationTypeController.updateEvaluationType);

// @route   DELETE /api/evaluation-types/:id
// @desc    Eliminar tipo de evaluación
// @access  Public
router.delete("/:id", evaluationTypeController.deleteEvaluationType);

module.exports = router;
