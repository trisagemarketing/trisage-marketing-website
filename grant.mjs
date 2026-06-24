import { createClient } from '@supabase/supabase-js';

// Need the service role key to bypass RLS and potentially run admin stuff
// But wait, the supabase js client cannot run raw SQL via the REST API unless you use a Postgres function (RPC).
// Wait, is there a simpler way? Let's just create a seed script that uses the supabase CLI or we can check what's going on.
