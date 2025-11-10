const EvaluationType = require('../models/EvaluationType');
const Subject = require('../models/Subject');

class EvaluationTypeController {
  // GET /api/subjects/:subjectId/evaluation-types
  async getEvaluationTypesBySubject(req, res, next) {
    try {
      const { subjectId } = req.params;
      const evaluationTypes = await EvaluationType.findBySubjectId(subjectId);
      
      res.status(200).json({
        success: true,
        count: evaluationTypes.length,
        data: evaluationTypes
      });
    } catch (error) {
      next(error);
    }
  }

  // POST /api/evaluation-types
  async createEvaluationType(req, res, next) {
    try {
      const {
        subjectId,
        name,
        description,
        weight,
        maxScore,
        evaluationOrder,
        isFinalExam
      } = req.body;

      if (!subjectId || !name || weight === undefined) {
        return res.status(400).json({
          success: false,
          message: 'Materia, nombre y peso son obligatorios'
        });
      }

      const subject = await Subject.findById(subjectId);
      if (!subject) {
        return res.status(404).json({
          success: false,
          message: 'Materia no encontrada'
        });
      }

      const currentTotalWeight = await EvaluationType.getEvaluationWeightsTotal(subjectId);
      if (currentTotalWeight + weight > 100) {
        return res.status(400).json({
          success: false,
          message: `El peso total de las evaluaciones no puede exceder 100%. Actual: ${currentTotalWeight}%, Nuevo: ${weight}%`
        });
      }

      const evaluationData = {
        subjectId,
        name,
        description,
        weight: parseFloat(weight),
        maxScore: maxScore || 100,
        evaluationOrder: evaluationOrder || 1,
        isFinalExam: isFinalExam || false
      };

      const newEvaluationType = await EvaluationType.create(evaluationData);

      res.status(201).json({
        success: true,
        message: 'Tipo de evaluación creado exitosamente',
        data: newEvaluationType
      });
    } catch (error) {
      next(error);
    }
  }

  // PUT /api/evaluation-types/:id
  async updateEvaluationType(req, res, next) {
    try {
      const { id } = req.params;
      const {
        name,
        description,
        weight,
        maxScore,
        evaluationOrder,
        isFinalExam
      } = req.body;

      const existingEvaluation = await EvaluationType.findById(id);
      if (!existingEvaluation) {
        return res.status(404).json({
          success: false,
          message: 'Tipo de evaluación no encontrado'
        });
      }

      const evaluationData = {
        name,
        description,
        weight: parseFloat(weight),
        maxScore,
        evaluationOrder,
        isFinalExam
      };

      const updatedEvaluation = await EvaluationType.update(id, evaluationData);

      res.status(200).json({
        success: true,
        message: 'Tipo de evaluación actualizado exitosamente',
        data: updatedEvaluation
      });
    } catch (error) {
      next(error);
    }
  }

  // DELETE /api/evaluation-types/:id
  async deleteEvaluationType(req, res, next) {
    try {
      const { id } = req.params;

      const existingEvaluation = await EvaluationType.findById(id);
      if (!existingEvaluation) {
        return res.status(404).json({
          success: false,
          message: 'Tipo de evaluación no encontrado'
        });
      }

      await EvaluationType.delete(id);

      res.status(200).json({
        success: true,
        message: 'Tipo de evaluación eliminado exitosamente'
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new EvaluationTypeController();