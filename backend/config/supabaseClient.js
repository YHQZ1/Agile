const { createClient } = require('@supabase/supabase-js');
const {
  SUPABASE_URL,
  SUPABASE_SERVICE_ROLE_KEY,
  SUPABASE_ANON_KEY,
  NODE_ENV,
} = require('./env');

const supabaseKey = SUPABASE_SERVICE_ROLE_KEY || SUPABASE_ANON_KEY;

if (!SUPABASE_URL) {
  throw new Error('Missing SUPABASE_URL. Set it in backend/.env');
}

if (!supabaseKey) {
  throw new Error('Missing Supabase key. Provide SUPABASE_SERVICE_ROLE_KEY (preferred) or SUPABASE_ANON_KEY.');
}

if (!SUPABASE_SERVICE_ROLE_KEY && NODE_ENV === 'production') {
  console.warn('[supabaseClient] Using anon key in production. Prefer SUPABASE_SERVICE_ROLE_KEY for server-side access.');
}

const supabase = createClient(SUPABASE_URL, supabaseKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

module.exports = supabase;
