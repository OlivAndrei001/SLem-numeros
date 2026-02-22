
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://xvkprodimxdshfekcfmf.supabase.co';
const supabaseKey = 'sb_publishable_mRMGvnHxIXThpA_K-5Wctw_bjeQs-Un';

export const supabase = createClient(supabaseUrl, supabaseKey);
