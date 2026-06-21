import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

// Singleton pattern: prevent creating multiple Supabase browser instances.
// Each call to createBrowserClient() allocates a new realtime connection and
// internal state; reusing one instance avoids duplicate connections and
// reduces memory/GC pressure on the client.
let client: ReturnType<typeof createBrowserClient> | undefined;

export const createClient = () => {
  if (!client) {
    client = createBrowserClient(supabaseUrl!, supabaseKey!);
  }
  return client;
};
