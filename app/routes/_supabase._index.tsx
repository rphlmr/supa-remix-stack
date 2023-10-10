import type { LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";

import { getSession, supabase } from "~/supabase";

export async function loader({ request }: LoaderFunctionArgs) {
  const { session, headers } = await getSession(request);

  if (session) return redirect("/chat", { headers });

  return json(null, { headers });
}

export default function Login() {
  return (
    <div className="flex h-screen flex-col items-center justify-center space-y-6">
      <h1>SupaChat</h1>

      <button
        className="rounded bg-blue-500 p-2 text-white"
        onClick={() => supabase.auth.signInWithOAuth({ provider: "github" })}
      >
        Continue with GitHub
      </button>
    </div>
  );
}
