const supabase = require("../config/supabase");

class Grade {
  static async findByEnrollmentId(enrollmentId) {
    const { data, error } = await supabase
      .from("grades")
      .select(
        `
        *,
        evaluation_types(
          name,
          weight,
          evaluation_order,
          is_final_exam
        )
      `
      )
      .eq("enrollment_id", enrollmentId)
      .order("evaluation_types(evaluation_order)", { ascending: true });

    if (error) throw error;
    return data;
  }

  static async findByStudentAndEvaluation(enrollmentId, evaluationTypeId) {
    const { data, error } = await supabase
      .from("grades")
      .select("*")
      .eq("enrollment_id", enrollmentId)
      .eq("evaluation_type_id", evaluationTypeId)
      .single();

    if (error) throw error;
    return data;
  }

  static async createOrUpdate(gradeData) {
    // Verificar si ya existe una calificación para esta evaluación
    const existingGrade = await this.findByStudentAndEvaluation(
      gradeData.enrollmentId,
      gradeData.evaluationTypeId
    );

    if (existingGrade) {
      // Actualizar calificación existente
      const { data, error } = await supabase
        .from("grades")
        .update({
          score: gradeData.score,
          comments: gradeData.comments,
          graded_at: new Date().toISOString(),
        })
        .eq("id", existingGrade.id)
        .select();

      if (error) throw error;
      return data[0];
    } else {
      // Crear nueva calificación
      const { data, error } = await supabase
        .from("grades")
        .insert([
          {
            enrollment_id: gradeData.enrollmentId,
            evaluation_type_id: gradeData.evaluationTypeId,
            score: gradeData.score,
            comments: gradeData.comments,
          },
        ])
        .select();

      if (error) throw error;
      return data[0];
    }
  }

  static async calculateFinalGrade(enrollmentId) {
    // Obtener todas las calificaciones del estudiante en esta materia
    const grades = await this.findByEnrollmentId(enrollmentId);

    if (grades.length === 0) return null;

    let weightedSum = 0;
    let totalWeight = 0;

    grades.forEach((grade) => {
      if (grade.score !== null) {
        weightedSum += grade.score * (grade.evaluation_types.weight / 100);
        totalWeight += grade.evaluation_types.weight;
      }
    });

    // Si no hay suficiente peso calificado, retornar null
    if (totalWeight === 0) return null;

    const finalGrade = (weightedSum / totalWeight) * 100;
    return Math.round(finalGrade * 100) / 100; // Redondear a 2 decimales
  }

  static async getStudentGradesSummary(studentId) {
    const { data, error } = await supabase
      .from("enrollments")
      .select(
        `
        id,
        academic_year,
        semester,
        status,
        subjects(
          subject_code,
          name,
          credits
        ),
        grades(
          score,
          evaluation_types(
            name,
            weight
          )
        )
      `
      )
      .eq("student_id", studentId);

    if (error) throw error;
    return data;
  }
}

module.exports = Grade;