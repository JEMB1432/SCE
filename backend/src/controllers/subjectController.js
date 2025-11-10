const Subject = require('../models/Subject');
const EvaluationType = require('../models/EvaluationType');

class SubjectController {
  // GET /api/subjects
  async getAllSubjects(req, res, next) {
    try {
      const subjects = await Subject.findAll();
      
      res.status(200).json({
        success: true,
        count: subjects.length,
        data: subjects
      });
    } catch (error) {
      next(error);
    }
  }

  // GET /api/subjects/:id
  async getSubjectById(req, res, next) {
    try {
      const { id } = req.params;
      const subject = await Subject.findById(id);
      
      if (!subject) {
        return res.status(404).json({
          success: false,
          message: 'Materia no encontrada'
        });
      }

      res.status(200).json({
        success: true,
        data: subject
      });
    } catch (error) {
      next(error);
    }
  }

  // GET /api/subjects/:id/evaluations
  async getSubjectWithEvaluations(req, res, next) {
    try {
      const { id } = req.params;
      const subjectWithEvaluations = await Subject.getSubjectWithEvaluations(id);
      
      if (!subjectWithEvaluations) {
        return res.status(404).json({
          success: false,
          message: 'Materia no encontrada'
        });
      }

      res.status(200).json({
        success: true,
        data: subjectWithEvaluations
      });
    } catch (error) {
      next(error);
    }
  }

  // POST /api/subjects
  async createSubject(req, res, next) {
    try {
      const {
        subjectCode,
        name,
        description,
        credits,
        hoursPerWeek,
        semesterAvailable,
        status
      } = req.body;

      if (!subjectCode || !name) {
        return res.status(400).json({
          success: false,
          message: 'Código y nombre de la materia son obligatorios'
        });
      }

      const subjectData = {
        subjectCode,
        name,
        description,
        credits: credits || 3,
        hoursPerWeek: hoursPerWeek || 4,
        semesterAvailable,
        status: status || 'active'
      };

      const newSubject = await Subject.create(subjectData);

      res.status(201).json({
        success: true,
        message: 'Materia creada exitosamente',
        data: newSubject
      });
    } catch (error) {
      next(error);
    }
  }

  // PUT /api/subjects/:id
  async updateSubject(req, res, next) {
    try {
      const { id } = req.params;
      const {
        name,
        description,
        credits,
        hoursPerWeek,
        semesterAvailable,
        status
      } = req.body;

      const existingSubject = await Subject.findById(id);
      if (!existingSubject) {
        return res.status(404).json({
          success: false,
          message: 'Materia no encontrada'
        });
      }

      const subjectData = {
        name,
        description,
        credits,
        hoursPerWeek,
        semesterAvailable,
        status
      };

      const updatedSubject = await Subject.update(id, subjectData);

      res.status(200).json({
        success: true,
        message: 'Materia actualizada exitosamente',
        data: updatedSubject
      });
    } catch (error) {
      next(error);
    }
  }

  // DELETE /api/subjects/:id
  async deleteSubject(req, res, next) {
    try {
      const { id } = req.params;

      const existingSubject = await Subject.findById(id);
      if (!existingSubject) {
        return res.status(404).json({
          success: false,
          message: 'Materia no encontrada'
        });
      }

      await Subject.delete(id);

      res.status(200).json({
        success: true,
        message: 'Materia eliminada exitosamente'
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new SubjectController();