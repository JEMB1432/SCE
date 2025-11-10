const Student = require('../models/Student');

class StudentController {
  // GET /api/students
  async getAllStudents(req, res, next) {
    try {
      const students = await Student.findAll();
      
      res.status(200).json({
        success: true,
        count: students.length,
        data: students
      });
    } catch (error) {
      next(error);
    }
  }

  // GET /api/students/:id
  async getStudentById(req, res, next) {
    try {
      const { id } = req.params;
      const student = await Student.findById(id);
      
      if (!student) {
        return res.status(404).json({
          success: false,
          message: 'Estudiante no encontrado'
        });
      }

      res.status(200).json({
        success: true,
        data: student
      });
    } catch (error) {
      next(error);
    }
  }

  // GET /api/students/:id/grades
  async getStudentGrades(req, res, next) {
    try {
      const { id } = req.params;
      const studentWithGrades = await Student.getStudentWithGrades(id);
      
      if (!studentWithGrades) {
        return res.status(404).json({
          success: false,
          message: 'Estudiante no encontrado'
        });
      }

      res.status(200).json({
        success: true,
        data: studentWithGrades
      });
    } catch (error) {
      next(error);
    }
  }

  // POST /api/students
  async createStudent(req, res, next) {
    try {
      const {
        studentCode,
        firstName,
        lastName,
        email,
        phone,
        dateOfBirth,
        address,
        status
      } = req.body;

      if (!studentCode || !firstName || !lastName || !email) {
        return res.status(400).json({
          success: false,
          message: 'Código de estudiante, nombre, apellido y email son obligatorios'
        });
      }

      const studentData = {
        studentCode,
        firstName,
        lastName,
        email,
        phone,
        dateOfBirth,
        address,
        status
      };

      const newStudent = await Student.create(studentData);

      res.status(201).json({
        success: true,
        message: 'Estudiante creado exitosamente',
        data: newStudent
      });
    } catch (error) {
      next(error);
    }
  }

  // PUT /api/students/:id
  async updateStudent(req, res, next) {
    try {
      const { id } = req.params;
      const {
        firstName,
        lastName,
        email,
        phone,
        dateOfBirth,
        address,
        status
      } = req.body;

      const existingStudent = await Student.findById(id);
      if (!existingStudent) {
        return res.status(404).json({
          success: false,
          message: 'Estudiante no encontrado'
        });
      }

      const studentData = {
        firstName,
        lastName,
        email,
        phone,
        dateOfBirth,
        address,
        status
      };

      const updatedStudent = await Student.update(id, studentData);

      res.status(200).json({
        success: true,
        message: 'Estudiante actualizado exitosamente',
        data: updatedStudent
      });
    } catch (error) {
      next(error);
    }
  }

  // DELETE /api/students/:id
  async deleteStudent(req, res, next) {
    try {
      const { id } = req.params;

      const existingStudent = await Student.findById(id);
      if (!existingStudent) {
        return res.status(404).json({
          success: false,
          message: 'Estudiante no encontrado'
        });
      }

      await Student.delete(id);

      res.status(200).json({
        success: true,
        message: 'Estudiante eliminado exitosamente'
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new StudentController();