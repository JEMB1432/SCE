const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Faltan variables de entorno de Supabase');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const testConnection = async () => {
  try {
    const { data, error } = await supabase.from('students').select('count');
    if (error) throw error;
    console.log('Conexión a Supabase establecida');
  } catch (error) {
    console.error('Error conectando a Supabase:', error.message);
  }
};

if (process.env.NODE_ENV === 'development') {
  testConnection();
}

module.exports = supabase;