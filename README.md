# Supa Remix Stack

A quick start for Remix apps with Supabase.

Learn more about [Remix Stacks](https://remix.run/stacks).
Learn more about [Supabase Auth Helper](https://supabase.com/docs/guides/auth/auth-helpers/remix).

```
npx create-remix@latest --template rphlmr/supa-remix-stack
```

## What's in the stack

> ⚠️ Typescript only

- [GitHub authentication](https://supabase.com/docs/guides/auth/auth-github)
- [Supabase Remix Auth Helper](https://supabase.com/docs/guides/auth/auth-helpers/remix)
- [Supabase JS SDK](https://supabase.com/docs/reference/javascript)
- Vercel deploy target
- Styling with [Tailwind](https://tailwindcss.com/)
- Raw unstyled components with [HeadlessUI](https://headlessui.com/)
- Icons with [Heroicons](https://heroicons.com/)
- Utility function to efficiently merge Tailwind CSS classes in JS without style conflicts with [Tailwind Merge](https://github.com/dcastil/tailwind-merge)
- Tailwind official plugins :
  - [Typography](https://tailwindcss.com/docs/typography-plugin)
  - [Forms](https://github.com/tailwindlabs/tailwindcss-forms)
  - [Aspect Ratio](https://github.com/tailwindlabs/tailwindcss-aspect-ratio)
  - [Line Clamp](https://github.com/tailwindlabs/tailwindcss-line-clamp)
- Tailwind unofficial plugins :
  - [Tailwind Scrollbar](https://github.com/adoxography/tailwind-scrollbar)
- Tailwind Eslint
- Code formatting with [Prettier](https://prettier.io)
  - [Tailwind Prettier](https://github.com/tailwindlabs/prettier-plugin-tailwindcss)
- Linting with [ESLint](https://eslint.org)
  - [Tailwind Eslint](https://github.com/francoismassart/eslint-plugin-tailwindcss)
- Static Types with [TypeScript](https://typescriptlang.org)

Not a fan of bits of the stack? Fork it, change it, and use `npx create-remix --template your/repo`! Make it your own.

## Development

From your terminal:

```sh
npm run dev
```

This starts your app in development mode, rebuilding assets on file changes.

## Deployment

First, build your app for production:

```sh
npm run build
```

Then run the app in production mode:

```sh
npm start
```

Now you'll need to pick a host to deploy it to.

## Seed your DB
Run `seed/script.sql` in your Supabase project SQL editor.

### Bonus: Generate types from your DB
> You need to login to Supabase first with `supabase login`
> More info : https://supabase.com/docs/reference/cli

```sh
supabase gen types typescript --project-id your_project_id > app/supabase/db_types.ts
```


### DIY

If you're familiar with deploying node applications, the built-in Remix app server is production-ready.

Make sure to deploy the output of `remix build`

- `build/`
- `public/build/`
