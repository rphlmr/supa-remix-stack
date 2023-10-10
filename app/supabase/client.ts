import { createBrowserClient } from "@supabase/auth-helpers-remix";

import { isBrowser } from "~/utils/is-browser";

export const supabase = createBrowserClient(
  isBrowser ? window.env.SUPABASE_URL : process.env.SUPABASE_URL,
  isBrowser ? window.env.SUPABASE_ANON_KEY : process.env.SUPABASE_ANON_KEY,
);
