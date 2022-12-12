import type { LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useOutletContext } from "@remix-run/react";

import { getSession } from "~/supabase";
import type { SupabaseContext } from "~/supabase/types";

export async function loader({ request }: LoaderArgs) {
  const { session, headers } = await getSession(request);

  if (session) return redirect("/chat", { headers });

  return json(null, { headers });
}

export default function Login() {
  const { supabase } = useOutletContext<SupabaseContext>() || {};

  return (
    <div className="flex h-screen flex-col items-center justify-center space-y-6">
      <h1>SupaChat</h1>

      <button
        className="rounded bg-blue-500 p-2 text-white"
        onClick={() => supabase?.auth.signInWithOAuth({ provider: "github" })}
      >
        Continue with GitHub
      </button>
    </div>
  );
}
