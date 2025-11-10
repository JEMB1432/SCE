const supabase = require("../config/supabase");

class EvaluationType {
  static async findBySubjectId(subjectId) {
    const { data, error } = await supabase
      .from("evaluation_types")
      .select("*")
      .eq("subject_id", subjectId)
      .order("evaluation_order", { ascending: true });

    if (error) throw error;
    return data;
  }

  static async findById(id) {
    const { data, error } = await supabase
      .from("evaluation_types")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return data;
  }

  static async create(evaluationData) {
    const { data, error } = await supabase
      .from("evaluation_types")
      .insert([
        {
          subject_id: evaluationData.subjectId,
          name: evaluationData.name,
          description: evaluationData.description,
          weight: evaluationData.weight,
          max_score: evaluationData.maxScore || 100,
          evaluation_order: evaluationData.evaluationOrder,
          is_final_exam: evaluationData.isFinalExam || false,
        },
      ])
      .select();

    if (error) throw error;
    return data[0];
  }

  static async update(id, evaluationData) {
    const { data, error } = await supabase
      .from("evaluation_types")
      .update({
        name: evaluationData.name,
        description: evaluationData.description,
        weight: evaluationData.weight,
        max_score: evaluationData.maxScore,
        evaluation_order: evaluationData.evaluationOrder,
        is_final_exam: evaluationData.isFinalExam,
      })
      .eq("id", id)
      .select();

    if (error) throw error;
    return data[0];
  }

  static async delete(id) {
    const { error } = await supabase
      .from("evaluation_types")
      .delete()
      .eq("id", id);

    if (error) throw error;
    return true;
  }

  static async getEvaluationWeightsTotal(subjectId) {
    const { data, error } = await supabase
      .from("evaluation_types")
      .select("weight")
      .eq("subject_id", subjectId);

    if (error) throw error;

    const totalWeight = data.reduce(
      (sum, evalType) => sum + evalType.weight,
      0
    );
    return totalWeight;
  }
}

module.exports = EvaluationType;
