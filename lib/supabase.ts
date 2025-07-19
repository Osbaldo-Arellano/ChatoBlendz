// (Supabase client setup)
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

console.log(supabaseKey)
console.log(supabaseUrl)

export const supabase = createClient(supabaseUrl, supabaseKey);
