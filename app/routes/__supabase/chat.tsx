import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { redirect, json } from "@remix-run/node";
import { Form, Outlet, useLoaderData } from "@remix-run/react";

import { requireSession } from "~/supabase";

export async function action({ request }: ActionArgs) {
  const { supabase, headers } = await requireSession(request);

  const { error } = await supabase.auth.signOut();

  if (error) {
    return json({ error }, { headers });
  }

  return redirect("/", { headers });
}

export async function loader({ request }: LoaderArgs) {
  const { session, headers } = await requireSession(request);

  return json({ user: session.user }, { headers });
}

export default function AuthenticatedLayout() {
  const { user } = useLoaderData<typeof loader>();
  return (
    <div>
      <h1>Authenticated Layout</h1>
      <h2>Hello {user.email}</h2>
      <Form method="post" action=".">
        <button type="submit" className="bg-gray-900 p-2 text-white">
          Logout
        </button>
      </Form>

      <Outlet />
    </div>
  );
}
