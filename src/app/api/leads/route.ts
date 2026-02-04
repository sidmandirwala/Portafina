import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

export async function POST(req: Request) {
  const { name, email } = await req.json();

  if (!name?.trim() || !email?.trim()) {
    return Response.json({ error: "Name and email are required" }, { status: 400 });
  }

  const { error } = await supabase.from("leads").insert({ name: name.trim(), email: email.trim() });

  if (error) {
    return Response.json({ error: "Something went wrong" }, { status: 500 });
  }

  return Response.json({ success: true });
}
