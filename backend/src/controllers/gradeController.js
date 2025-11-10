const Grade = require('../models/Grade');
const Enrollment = require('../models/Enrollment');

class GradeController {
  // GET /api/enrollments/:enrollmentId/grades
  async getGradesByEnrollment(req, res, next) {
    try {
      const { enrollmentId } = req.params;
      const grades = await Grade.findByEnrollmentId(enrollmentId);
      
      res.status(200).json({
        success: true,
        count: grades.length,
        data: grades
      });
    } catch (error) {
      next(error);
    }
  }

  // GET /api/students/:studentId/grades-summary
  async getStudentGradesSummary(req, res, next) {
    try {
      const { studentId } = req.params;
      const gradesSummary = await Grade.getStudentGradesSummary(studentId);
      
      res.status(200).json({
        success: true,
        data: gradesSummary
      });
    } catch (error) {
      next(error);
    }
  }

  // POST /api/grades
  async createOrUpdateGrade(req, res, next) {
    try {
      const {
        enrollmentId,
        evaluationTypeId,
        score,
        comments
      } = req.body;

      // Validaciones básicas
      if (!enrollmentId || !evaluationTypeId || score === undefined) {
        return res.status(400).json({
          success: false,
          message: 'Inscripción, tipo de evaluación y calificación son obligatorios'
        });
      }

      if (score < 0 || score > 100) {
        return res.status(400).json({
          success: false,
          message: 'La calificación debe estar entre 0 y 100'
        });
      }

      const enrollment = await Enrollment.findById(enrollmentId);
      if (!enrollment) {
        return res.status(404).json({
          success: false,
          message: 'Inscripción no encontrada'
        });
      }

      const gradeData = {
        enrollmentId,
        evaluationTypeId,
        score: parseFloat(score),
        comments
      };

      const grade = await Grade.createOrUpdate(gradeData);

      const finalGrade = await Grade.calculateFinalGrade(enrollmentId);

      res.status(200).json({
        success: true,
        message: 'Calificación guardada exitosamente',
        data: {
          grade,
          finalGrade
        }
      });
    } catch (error) {
      next(error);
    }
  }

  // GET /api/enrollments/:enrollmentId/final-grade
  async calculateFinalGrade(req, res, next) {
    try {
      const { enrollmentId } = req.params;

      const enrollment = await Enrollment.findById(enrollmentId);
      if (!enrollment) {
        return res.status(404).json({
          success: false,
          message: 'Inscripción no encontrada'
        });
      }

      const finalGrade = await Grade.calculateFinalGrade(enrollmentId);

      res.status(200).json({
        success: true,
        data: {
          enrollmentId,
          finalGrade: finalGrade !== null ? finalGrade : 'No calculable',
          isCalculable: finalGrade !== null
        }
      });
    } catch (error) {
      next(error);
    }
  }

  // GET /api/students/:studentId/final-grades
  async getStudentFinalGrades(req, res, next) {
    try {
      const { studentId } = req.params;
      const enrollments = await Enrollment.getStudentEnrollments(studentId);
      
      const finalGrades = await Promise.all(
        enrollments.map(async (enrollment) => {
          const finalGrade = await Grade.calculateFinalGrade(enrollment.id);
          return {
            enrollmentId: enrollment.id,
            subject: enrollment.subjects,
            academicYear: enrollment.academic_year,
            semester: enrollment.semester,
            finalGrade: finalGrade !== null ? finalGrade : 'No calculable',
            isCalculable: finalGrade !== null
          };
        })
      );

      res.status(200).json({
        success: true,
        data: finalGrades
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new GradeController();