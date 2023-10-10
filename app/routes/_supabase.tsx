import { useEffect } from "react";

import { json } from "@remix-run/node";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { Outlet, useLoaderData, useRevalidator } from "@remix-run/react";

import { getServerClient } from "~/supabase";
import { supabase } from "~/supabase/client";

// this uses Pathless Layout Routes [1] to wrap up all our Supabase logic

// [1] https://remix.run/docs/en/v1/guides/routing#pathless-layout-routes

export async function loader({ request }: LoaderFunctionArgs) {
  const { supabase, headers } = getServerClient(request);

  const {
    data: { session },
  } = await supabase.auth.getSession();

  // in order for the set-cookie header to be set,
  // headers must be returned as part of the loader response
  return json(
    {
      session,
    },
    {
      headers,
    },
  );
}

export default function Supabase() {
  const { session } = useLoaderData<typeof loader>();
  const { revalidate } = useRevalidator();

  const serverAccessToken = session?.access_token;

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.access_token !== serverAccessToken) {
        // server and client are out of sync.
        // Remix recalls active loaders after actions complete
        revalidate();
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [serverAccessToken, revalidate]);

  return <Outlet />;
}
