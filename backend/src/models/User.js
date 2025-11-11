const supabase = require("../config/supabase");
const bcrypt = require("bcrypt");

class User {
  static async findByEmail(email) {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    if (error) return null;
    return data;
  }

  static async findById(id) {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", id)
      .single();

    if (error) return null;
    return data;
  }

  static async create(userData) {
    // Hash de la contraseña
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(userData.password, saltRounds);

    const { data, error } = await supabase
      .from("users")
      .insert([
        {
          email: userData.email,
          password_hash: hashedPassword,
          role: userData.role || "teacher",
          first_name: userData.firstName,
          last_name: userData.lastName,
          is_active: userData.isActive !== undefined ? userData.isActive : true,
        },
      ])
      .select();

    if (error) throw error;
    return data[0];
  }

  static async updateLastLogin(userId) {
    const { error } = await supabase
      .from("users")
      .update({
        last_login: new Date().toISOString(),
      })
      .eq("id", userId);

    if (error) throw error;
    return true;
  }

  static async comparePassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

  static async findAll() {
    const { data, error } = await supabase
      .from("users")
      .select(
        "id, email, role, first_name, last_name, is_active, created_at, last_login"
      )
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data;
  }

  static async updateUser(id, userData) {
    const updateData = {
      role: userData.role,
      first_name: userData.firstName,
      last_name: userData.lastName,
      is_active: userData.isActive,
    };

    // Si se proporciona una nueva contraseña, hashearla
    if (userData.password) {
      const saltRounds = 10;
      updateData.password_hash = await bcrypt.hash(
        userData.password,
        saltRounds
      );
    }

    const { data, error } = await supabase
      .from("users")
      .update(updateData)
      .eq("id", id)
      .select(
        "id, email, role, first_name, last_name, is_active, created_at, last_login"
      );

    if (error) throw error;
    return data[0];
  }

  static async deleteUser(id) {
    const { error } = await supabase.from("users").delete().eq("id", id);

    if (error) throw error;
    return true;
  }
}

module.exports = User;
