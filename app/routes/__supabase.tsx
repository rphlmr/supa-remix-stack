import { useEffect, useMemo, useState } from "react";

import { json } from "@remix-run/node";
import type { LoaderArgs } from "@remix-run/node";
import { Outlet, useFetcher, useLoaderData } from "@remix-run/react";
import { createBrowserClient } from "@supabase/auth-helpers-remix";

import { getServerClient } from "~/supabase";
import type { SupabaseContext } from "~/supabase";

// this uses Pathless Layout Routes [1] to wrap up all our Supabase logic

// [1] https://remix.run/docs/en/v1/guides/routing#pathless-layout-routes

export async function loader({ request }: LoaderArgs) {
  // environment variables may be stored somewhere other than
  // `process.env` in runtimes other than node
  // we need to pipe these Supabase environment variables to the browser
  const env = {
    SUPABASE_URL: process.env.SUPABASE_URL!,
    SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY!,
  };

  const { supabase, headers } = getServerClient(request);

  const {
    data: { session },
  } = await supabase.auth.getSession();

  // in order for the set-cookie header to be set,
  // headers must be returned as part of the loader response
  return json(
    {
      env,
      session,
    },
    {
      headers,
    }
  );
}

export default function Supabase() {
  const { env, session } = useLoaderData<typeof loader>();
  const fetcher = useFetcher();

  // it is important to create a single instance of Supabase
  // to use across client components - outlet context 👇
  const [supabase] = useState(() =>
    createBrowserClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY)
  );

  const serverAccessToken = session?.access_token;

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.access_token !== serverAccessToken) {
        // server and client are out of sync.
        // Remix recalls active loaders after actions complete
        fetcher.submit(null, {
          method: "post",
          action: "/refresh",
        });
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [serverAccessToken, supabase, fetcher]);

  const context: SupabaseContext = useMemo(
    () => ({
      supabase,
      session,
    }),
    [supabase, session]
  );

  return <Outlet context={context} />;
}
