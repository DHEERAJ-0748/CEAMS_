import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY || process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Supabase URL or Key (SUPABASE_KEY or SUPABASE_ANON_KEY) is missing in environment variables');
}

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
