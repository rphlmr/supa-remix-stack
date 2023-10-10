CREATE TABLE IF NOT EXISTS messages (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id uuid REFERENCES auth.users NOT NULL DEFAULT(auth.uid()),
    created_at timestamp WITH time zone DEFAULT timezone('utc'::text, NOW()) NOT NULL,
    content text NOT NULL
);

ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

CREATE policy "authenticated users can read messages" ON "public"."messages" AS permissive FOR
SELECT TO authenticated USING (TRUE);

CREATE policy "users can insert their own messages" ON "public"."messages" AS permissive FOR
INSERT TO authenticated WITH CHECK (user_id = auth.uid());

ALTER TABLE public.messages replica identity FULL;

ALTER publication supabase_realtime
ADD TABLE "public"."messages";