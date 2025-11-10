const express = require("express");
const router = express.Router();
const studentController = require("../controllers/studentController");

// @route   GET /api/students
// @desc    Obtener todos los estudiantes
// @access  Public
router.get("/", studentController.getAllStudents);

// @route   GET /api/students/:id
// @desc    Obtener estudiante por ID
// @access  Public
router.get("/:id", studentController.getStudentById);

// @route   GET /api/students/:id/grades
// @desc    Obtener calificaciones de un estudiante
// @access  Public
router.get("/:id/grades", studentController.getStudentGrades);

// @route   POST /api/students
// @desc    Crear nuevo estudiante
// @access  Public
router.post("/", studentController.createStudent);

// @route   PUT /api/students/:id
// @desc    Actualizar estudiante
// @access  Public
router.put("/:id", studentController.updateStudent);

// @route   DELETE /api/students/:id
// @desc    Eliminar estudiante
// @access  Public
router.delete("/:id", studentController.deleteStudent);

module.exports = router;
