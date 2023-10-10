import { useEffect, useState } from "react";

import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";

import type { Database } from "~/supabase";
import { requireSession, supabase } from "~/supabase";

export async function action({ request }: ActionFunctionArgs) {
  const { headers, supabase } = await requireSession(request);

  const { message } = Object.fromEntries(await request.formData());

  const { error } = await supabase
    .from("messages")
    .insert({ content: String(message) });

  if (error) {
    console.log(error);
  }

  return json(null, { headers });
}

export async function loader({ request }: LoaderFunctionArgs) {
  const { headers, supabase } = await requireSession(request);

  const { data } = await supabase.from("messages").select();

  return json({ messages: data ?? [] }, { headers });
}

export default function ChatScreen() {
  const { messages } = useLoaderData<typeof loader>();

  return (
    <div>
      <h1>Message feed</h1>

      <RealtimeMessages serverMessages={messages} />
      <Form method="post">
        <input type="text" name="message" />
        <button type="submit">Send</button>
      </Form>
    </div>
  );
}

type Message = Database["public"]["Tables"]["messages"]["Row"];

function RealtimeMessages({ serverMessages }: { serverMessages: Message[] }) {
  const [messages, setMessages] = useState(serverMessages);

  useEffect(() => {
    setMessages(serverMessages);
  }, [serverMessages]);

  useEffect(() => {
    // supabase?.realtime.setAuth(session.access_token);

    const channel = supabase
      ?.channel("*")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages" },
        (payload) => {
          const newMessage = payload.new as Message;

          if (!messages.find((message) => message.id === newMessage.id)) {
            setMessages([...messages, newMessage]);
          }
        },
      )
      .subscribe();

    return () => {
      if (channel) {
        supabase?.removeChannel(channel);
      }
    };
  }, [messages, setMessages]);

  return <pre>{JSON.stringify(messages, null, 2)}</pre>;
}
