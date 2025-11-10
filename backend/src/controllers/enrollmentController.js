const Enrollment = require('../models/Enrollment');

class EnrollmentController {
  // GET /api/enrollments
  async getAllEnrollments(req, res, next) {
    try {
      const enrollments = await Enrollment.findAll();
      
      res.status(200).json({
        success: true,
        count: enrollments.length,
        data: enrollments
      });
    } catch (error) {
      next(error);
    }
  }

  // GET /api/enrollments/:id
  async getEnrollmentById(req, res, next) {
    try {
      const { id } = req.params;
      const enrollment = await Enrollment.findById(id);
      
      if (!enrollment) {
        return res.status(404).json({
          success: false,
          message: 'Inscripción no encontrada'
        });
      }

      res.status(200).json({
        success: true,
        data: enrollment
      });
    } catch (error) {
      next(error);
    }
  }

  // GET /api/students/:studentId/enrollments
  async getStudentEnrollments(req, res, next) {
    try {
      const { studentId } = req.params;
      const enrollments = await Enrollment.getStudentEnrollments(studentId);
      
      res.status(200).json({
        success: true,
        count: enrollments.length,
        data: enrollments
      });
    } catch (error) {
      next(error);
    }
  }

  // GET /api/subjects/:subjectId/enrollments
  async getSubjectEnrollments(req, res, next) {
    try {
      const { subjectId } = req.params;
      const { academicYear, semester } = req.query;
      
      if (!academicYear || !semester) {
        return res.status(400).json({
          success: false,
          message: 'Año académico y semestre son requeridos'
        });
      }

      const enrollments = await Enrollment.getSubjectEnrollments(
        subjectId, 
        academicYear, 
        parseInt(semester)
      );
      
      res.status(200).json({
        success: true,
        count: enrollments.length,
        data: enrollments
      });
    } catch (error) {
      next(error);
    }
  }

  // POST /api/enrollments
  async createEnrollment(req, res, next) {
    try {
      const {
        studentId,
        subjectId,
        academicYear,
        semester,
        status
      } = req.body;

      if (!studentId || !subjectId || !academicYear || !semester) {
        return res.status(400).json({
          success: false,
          message: 'Estudiante, materia, año académico y semestre son obligatorios'
        });
      }

      const existingEnrollment = await Enrollment.findByStudentAndSubject(
        studentId, subjectId, academicYear, semester
      );

      if (existingEnrollment) {
        return res.status(409).json({
          success: false,
          message: 'El estudiante ya está inscrito en esta materia para el período académico especificado'
        });
      }

      const enrollmentData = {
        studentId,
        subjectId,
        academicYear,
        semester: parseInt(semester),
        status: status || 'enrolled'
      };

      const newEnrollment = await Enrollment.create(enrollmentData);

      res.status(201).json({
        success: true,
        message: 'Inscripción creada exitosamente',
        data: newEnrollment
      });
    } catch (error) {
      next(error);
    }
  }

  // PUT /api/enrollments/:id
  async updateEnrollment(req, res, next) {
    try {
      const { id } = req.params;
      const {
        academicYear,
        semester,
        status
      } = req.body;

      const existingEnrollment = await Enrollment.findById(id);
      if (!existingEnrollment) {
        return res.status(404).json({
          success: false,
          message: 'Inscripción no encontrada'
        });
      }

      const enrollmentData = {
        academicYear,
        semester: parseInt(semester),
        status
      };

      const updatedEnrollment = await Enrollment.update(id, enrollmentData);

      res.status(200).json({
        success: true,
        message: 'Inscripción actualizada exitosamente',
        data: updatedEnrollment
      });
    } catch (error) {
      next(error);
    }
  }

  // DELETE /api/enrollments/:id
  async deleteEnrollment(req, res, next) {
    try {
      const { id } = req.params;

      const existingEnrollment = await Enrollment.findById(id);
      if (!existingEnrollment) {
        return res.status(404).json({
          success: false,
          message: 'Inscripción no encontrada'
        });
      }

      await Enrollment.delete(id);

      res.status(200).json({
        success: true,
        message: 'Inscripción eliminada exitosamente'
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new EnrollmentController();