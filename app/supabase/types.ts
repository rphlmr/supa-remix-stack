import type { Session, SupabaseClient } from "@supabase/auth-helpers-remix";

declare global {
  interface Window {
    env: {
      SUPABASE_URL: string | undefined;
      SUPABASE_ANON_KEY: string | undefined;
      SERVER_URL: string | undefined;
    };
  }
}

export type SupabaseContext = {
  supabase: SupabaseClient;
  session: Session | null;
} | null;
