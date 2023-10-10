import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";
import { json, type LinksFunction } from "@vercel/remix";

import tailwindStylesheetUrl from "./styles/tailwind.css";

export const links: LinksFunction = () => [
  {
    rel: "stylesheet preload prefetch",
    href: tailwindStylesheetUrl,
    as: "style",
  },
];

export function loader() {
  return json({
    env: {
      SUPABASE_URL: process.env.SUPABASE_URL!,
      SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY!,
    },
  });
}

export default function App() {
  const { env } = useLoaderData<typeof loader>();

  return (
    <html lang="en" className="h-full bg-neutral-50">
      <head>
        <meta charSet="utf-8" />
        <meta name="title" content="Supa Remix Stack" />
        <meta
          name="viewport"
          content="width=device-width,initial-scale=1.0,maximum-scale=1.0"
        />
        <Meta />
        <Links />
      </head>
      <body className="h-full">
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.env = ${JSON.stringify(env)}`,
          }}
        />
      </body>
    </html>
  );
}
