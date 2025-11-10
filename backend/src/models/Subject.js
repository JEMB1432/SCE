const supabase = require("../config/supabase");

class Subject {
  static async findAll() {
    const { data, error } = await supabase
      .from("subjects")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(`Error al obtener las materias, ERROR: ${error.message}`);
    }
    return data;
  }

  static async findById(id) {
    const { data, error } = await supabase
      .from("subjects")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      throw new Error(
        `Error al obtener la materia con ID ${id}, ERROR: ${error.message}`
      );
    }
    return data;
  }

  static async create(subjectData) {
    const { data, error } = await supabase
      .from("subjects")
      .insert([
        {
          subject_code: subjectData.subjectCode,
          name: subjectData.name,
          description: subjectData.description,
          credits: subjectData.credits,
          hours_per_week: subjectData.hoursPerWeek,
          semester_available: subjectData.semesterAvailable,
          status: subjectData.status || "active",
        },
      ])
      .select();

    if (error) {
      throw new Error(`Error al crear la materia, ERROR: ${error.message}`);
    }
    return data[0];
  }

  static async update(id, subjectData) {
    const { data, error } = await supabase
      .from("subjects")
      .update({
        name: subjectData.name,
        description: subjectData.description,
        credits: subjectData.credits,
        hours_per_week: subjectData.hoursPerWeek,
        semester_available: subjectData.semesterAvailable,
        status: subjectData.status,
      })
      .eq("id", id)
      .select();

    if (error) {
      throw new Error(
        `Error al actualizar la materia con ID ${id}, ERROR: ${error.message}`
      );
    }
    return data[0];
  }

  static async delete(id) {
    const { error } = await supabase.from("subjects").delete().eq("id", id);

    if (error) {
      throw new Error(
        `Error al eliminar la materia con ID ${id}, ERROR: ${error.message}`
      );
    }
    return true;
  }

  static async getSubjectWithEvaluations(subjectId) {
    const { data, error } = await supabase
      .from("subjects")
      .select(
        `
        *,
        evaluation_types(*)
      `
      )
      .eq("id", subjectId)
      .single();

    if (error) throw error;
    return data;
  }
}

module.exports = Subject;
