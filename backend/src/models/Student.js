const supabase = require("../config/supabase");

class Student {
  static async findAll() {
    const { data, error } = await supabase
      .from("students")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      throw new Error(
        `Error al obtener los estudiantes, ERROR: ${error.message}`
      );
    }
    return data;
  }

  static async findById(id) {
    const { data, error } = await supabase
      .from("students")
      .select("*")
      .eq("id", id)
      .single();
    if (error) {
      throw new Error(
        `Error al obtener el estudiante con ID ${id}, ERROR: ${error.message}`
      );
    }
    return data;
  }

  static async create(studentData) {
    const { data, error } = await supabase
      .from("students")
      .insert([
        {
          student_code: studentData.studentCode,
          first_name: studentData.firstName,
          last_name: studentData.lastName,
          email: studentData.email,
          phone: studentData.phone,
          date_of_birth: studentData.dateOfBirth,
          address: studentData.address,
          status: studentData.status || "active",
        },
      ])
      .select();

    if (error) {
      throw new Error(`Error al crear el estudiante, ERROR: ${error.message}`);
    }
    return data[0];
  }

  static async update(id, studentData) {
    const { data, error } = await supabase
      .from("students")
      .update({
        first_name: studentData.firstName,
        last_name: studentData.lastName,
        email: studentData.email,
        phone: studentData.phone,
        date_of_birth: studentData.dateOfBirth,
        address: studentData.address,
        status: studentData.status,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select();

    if (error) {
      throw new Error(
        `Error al actualizar el estudiante con ID ${id}, ERROR: ${error.message}`
      );
    }
    return data[0];
  }

  static async delete(id) {
    const { error } = await supabase.from("students").delete().eq("id", id);

    if (error) {
      throw new Error(
        `Error al eliminar el estudiante con ID ${id}, ERROR: ${error.message}`
      );
    }
    return true;
  }

  static async getStudentWithGrades(studentId) {
    const { data, error } = await supabase
      .from("students")
      .select(
        `
        *,
        enrollments(
          academic_year,
          semester,
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
        )
      `
      )
      .eq("id", studentId)
      .single();

    if (error) {
      throw new Error(
        `Error al obtener el estudiante con calificaciones, ERROR: ${error.message}`
      );
    }
    return data;
  }
}

module.exports = Student;
