// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://lehejzxalcxgmerptlhs.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxlaGVqenhhbGN4Z21lcnB0bGhzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgzNTI5MTMsImV4cCI6MjA2MzkyODkxM30.KQcVj1GhVo0lwUsK8Xv7FlqH2hdbzVtQyr_3bkNj5fU";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);