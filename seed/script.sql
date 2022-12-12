create table if not exists messages (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references auth.users not null default(auth.uid()),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    content text not null
);

alter table public.messages ENABLE row level security;

create policy "authenticated users can read messages" on "public"."messages" as permissive for
select to authenticated using (true);

create policy "users can insert their own messages" on "public"."messages" as permissive for
insert to authenticated with check (user_id = auth.uid());

alter table public.messages replica identity full;