import { createServerClient } from "@supabase/auth-helpers-remix";

import type { Database } from "./db_types";

export function getServerClient(
  request: Request,
  // Cloudflare Workers / Page doesn't have access to process.env, so we need to pass values from loader/action context
  options?: { supabaseUrl?: string; supabaseAnonKey?: string }
) {
  if (!process.env.SUPABASE_URL) {
    throw new Error("SUPABASE_URL env is missing");
  }

  if (!process.env.SUPABASE_ANON_KEY) {
    throw new Error("SUPABASE_ANON_KEY env is missing");
  }

  const response = new Response();

  const supabase = createServerClient<Database>(
    options?.supabaseUrl ?? process.env.SUPABASE_URL,
    options?.supabaseAnonKey ?? process.env.SUPABASE_ANON_KEY,
    {
      request,
      response,
    }
  );

  return { supabase, headers: response.headers };
}
