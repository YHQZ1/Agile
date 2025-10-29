const supabase = require('./config/supabaseClient');

async function testConnection() {
  try {
    const { error } = await supabase
      .from('authentication')
      .select('id', { count: 'exact', head: true })
      .limit(1);

    if (error) {
      throw error;
    }

    console.log('✅ Supabase connection successful');
  } catch (err) {
    console.error('❌ Supabase connection failed:', err.message || err);
  }
}

testConnection();