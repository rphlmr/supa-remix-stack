import type { Session, SupabaseClient } from "@supabase/auth-helpers-remix";

declare global {
  interface Window {
    env: {
      SUPABASE_URL: string;
      SUPABASE_ANON_KEY: string;
      SERVER_URL: string;
    };
  }
  namespace NodeJS {
    interface ProcessEnv {
      SUPABASE_URL: string;
      SUPABASE_ANON_KEY: string;
    }
  }
}
