import { createClient } from "@supabase/supabase-js";
import { leadsLimiter } from "@/lib/rate-limit";

const NAME_REGEX = /^[a-zA-ZÀ-ÖØ-öø-ÿ' \-.]{2,100}$/;
const EMAIL_REGEX = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

export async function POST(req: Request) {
  let body;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid request body" }, { status: 400 });
  }
  const { name, email, website, loaded_at } = body;

  // Honeypot check — bots fill hidden fields, real users don't
  if (website && website.trim().length > 0) {
    return Response.json({ success: true });
  }

  // Time-based check — bots submit instantly, humans take at least 3 seconds
  // Only enforce if loaded_at is provided (graceful for clients without it)
  if (loaded_at !== undefined && loaded_at !== null) {
    const loadedAt = parseInt(loaded_at, 10);
    if (isNaN(loadedAt) || Date.now() - loadedAt < 3000) {
      return Response.json({ success: true });
    }
  }

  // Rate limiting — only counts real (non-bot) traffic
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "127.0.0.1";
  const { success } = await leadsLimiter.limit(ip);
  if (!success) {
    return Response.json({ error: "Too many requests. Please try again later." }, { status: 429 });
  }
  const trimmedName = name?.trim();
  const trimmedEmail = email?.trim().toLowerCase();

  if (!trimmedName || !trimmedEmail) {
    return Response.json({ error: "Name and email are required" }, { status: 400 });
  }

  if (!NAME_REGEX.test(trimmedName)) {
    return Response.json({ error: "Please enter a valid name" }, { status: 400 });
  }

  if (trimmedEmail.length > 254 || !EMAIL_REGEX.test(trimmedEmail)) {
    return Response.json({ error: "Please enter a valid email address" }, { status: 400 });
  }

  const { error } = await supabase.from("leads").insert({ name: trimmedName, email: trimmedEmail });

  if (error) {
    return Response.json({ error: "Something went wrong" }, { status: 500 });
  }

  return Response.json({ success: true });
}
