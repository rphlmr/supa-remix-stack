import { redirect } from "@remix-run/node";

import { createRedirectTo } from "~/utils/http.server";

import { getServerClient } from "./client.server";

/**
 * This is a helper function to get the session from the request.
 *
 * It will return the `session`, `headers` set by supabase and an `authenticated supabase client` **OR** an `anon supabase client` if there is no session.
 *
 * **NOTE:** In order for the set-cookie header to be set, `headers` must be returned as part of the loader/action response
 *
 * @example
 *export async function loader({ request }: LoaderArgs) {
 *  const { session, headers } = await getSession(request);
 *  // you have to check if the session is null to know if the user is authenticated or not
 *  if (session) return redirect("/app", { headers });
 *
 *  // in order for the set-cookie header to be set,
 *  // headers must be returned as part of the loader/action response
 *  return json(null, { headers });
 *}
 */

export async function getSession(request: Request) {
  const { supabase, headers } = getServerClient(request);
  const {
    data: { session },
  } = await supabase.auth.getSession();

  return { session, headers, supabase };
}

/**
 * This is a helper function to assert the session from the request.
 *
 * It will return the `session`, `headers` set by supabase and an `authenticated supabase client`.
 *
 * If there is no `session`, it redirects default to `/`.
 *
 * **NOTE:** In order for the set-cookie header to be set, `headers` must be returned as part of the loader/action response
 *
 * @example
 *export async function loader({ request }: LoaderArgs) {
 *  const { session, headers } = await requireSession(request);
 *
 *  // you are sure that the user is authenticated
 *  // in order for the set-cookie header to be set,
 *  // headers must be returned as part of the loader/action response
 *  return json({ user: session.user }, { headers });
 *}
 */

export async function requireSession(
  request: Request,
  { onFailRedirectTo = "/" }: { onFailRedirectTo?: string } = {}
) {
  const { session, supabase, headers } = await getSession(request);

  if (!session)
    throw redirect(`${onFailRedirectTo}?${createRedirectTo(request)}`, {
      headers,
    });

  return { session, supabase, headers };
}
