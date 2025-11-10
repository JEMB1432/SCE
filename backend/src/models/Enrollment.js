const supabase = require("../config/supabase");

class Enrollment {
  static async findAll() {
    const { data, error } = await supabase
      .from("enrollments")
      .select(
        `
            *,
            students(first_name, last_name, student_code),
            subjects(name, subject_code, credits)
        `
      )
      .order("academic_year", { ascending: false })
      .order("semester", { ascending: false });

    if (error) {
      throw new Error(
        `Error al obtener las inscripciones, ERROR: ${error.message}`
      );
    }
    return data;
  }

  static async findById(id) {
    const { data, error } = await supabase
      .from("enrollments")
      .select(
        `
        *,
        students(*),
        subjects(*)
      `
      )
      .eq("id", id)
      .single();

    if (error) {
      throw new Error(
        `Error al obtener la inscripción con ID ${id}, ERROR: ${error.message}`
      );
    }
    return data;
  }

  static async findByStudentAndSubject(
    studentId,
    subjectId,
    academicYear,
    semester
  ) {
    const { data, error } = await supabase
      .from("enrollments")
      .select("*")
      .eq("student_id", studentId)
      .eq("subject_id", subjectId)
      .eq("academic_year", academicYear)
      .eq("semester", semester)
      .single();

    if (error) {
      throw new Error(`ERROR: ${error.message}`);
    }
    return data;
  }

  static async create(enrollmentData) {
    const { data, error } = await supabase
      .from("enrollments")
      .insert([
        {
          student_id: enrollmentData.studentId,
          subject_id: enrollmentData.subjectId,
          academic_year: enrollmentData.academicYear,
          semester: enrollmentData.semester,
          status: enrollmentData.status || "enrolled",
        },
      ])
      .select();

    if (error) {
      throw new Error(`Error al crear la inscripción, ERROR: ${error.message}`);
    }
    return data[0];
  }

  static async update(id, enrollmentData) {
    const { data, error } = await supabase
      .from("enrollments")
      .update({
        academic_year: enrollmentData.academicYear,
        semester: enrollmentData.semester,
        status: enrollmentData.status,
      })
      .eq("id", id)
      .select();

    if (error) {
      throw new Error(
        `Error al actualizar la inscripción con ID ${id}, ERROR: ${error.message}`
      );
    }
    return data[0];
  }

  static async delete(id) {
    const { error } = await supabase.from("enrollments").delete().eq("id", id);

    if (error) {
      throw new Error(
        `Error al eliminar la inscripción con ID ${id}, ERROR: ${error.message}`
      );
    }
    return true;
  }

  static async getStudentEnrollments(studentId) {
    const { data, error } = await supabase
      .from("enrollments")
      .select(
        `
        *,
        subjects(*),
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

    if (error) {
      throw new Error(
        `Error al obtener las inscripciones del ID ${studentId}, ERROR: ${error.message}`
      );
    }
    return data;
  }

  static async getSubjectEnrollments(subjectId, academicYear, semester) {
    const { data, error } = await supabase
      .from("enrollments")
      .select(
        `
        *,
        students(first_name, last_name, student_code, email)
      `
      )
      .eq("subject_id", subjectId)
      .eq("academic_year", academicYear)
      .eq("semester", semester);

    if (error) {
      throw new Error(
        `Error al obtener las inscripciones de la materia ID ${subjectId}, ERROR: ${error.message}`
      );
    }
    return data;
  }
}

module.exports = Enrollment;
