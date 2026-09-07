import { createClient } from '@supabase/supabase-js';

/**
 * Creates a stateless, public Supabase client using the anon key.
 * This client does NOT read or write cookies, and does NOT have access to authenticated user sessions.
 * It must be used strictly for public read-only queries (e.g., fetching published blogs).
 * This prevents Next.js from flagging the route as dynamic due to cookie usage.
 */
export function createPublicClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
