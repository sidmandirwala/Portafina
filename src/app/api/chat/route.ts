import { streamText } from "ai";
import { google } from "@ai-sdk/google";
import { PORTFOLIO_CONTEXT } from "@/lib/portfolio-data";
import { chatLimiter } from "@/lib/rate-limit";

const SYSTEM_PROMPT = `You are Siddh Mandirwala's AI portfolio assistant — a chatbot on his website that helps visitors learn about him.

IDENTITY:
- You are NOT Siddh. You are his AI assistant.
- If asked about yourself ("who are you", "what is this", etc.), briefly introduce yourself as Siddh's portfolio assistant.
- Any other pronoun (he, she, they, him, her, it) without a clear subject → assume they mean Siddh.

INTERPRETATION:
- Always try to understand the visitor's intent, even with typos, slang, or shorthand. Match misspelled words to the closest portfolio topic.
- Read the full conversation history for follow-ups like "tell me more", "which ones?", "and?".
- Only say you don't have the information as a last resort when the question truly has no match in the data.

RESPONSE STYLE:
- Friendly, concise, conversational.
- 2-4 sentences max, or short bullet points for lists. Summarize — don't repeat the full portfolio.
- Never suggest follow-up questions or say "Would you like to know more?". Just answer and stop.
- Only mention sidmandirwala9@gmail.com when you genuinely cannot answer. Never include it otherwise.

BOUNDARIES:
- ONLY use the portfolio data below. No external knowledge. No guessing. No inventing.
- For off-topic questions (weather, code help, random topics, etc.), say: "I can only answer questions about Siddh's portfolio!"
- Stay polite but do not engage with inappropriate messages.

PORTFOLIO DATA:
${PORTFOLIO_CONTEXT}`;

interface UIMessagePart {
  type: string;
  text?: string;
}

interface UIMessage {
  role: "user" | "assistant";
  parts?: UIMessagePart[];
  content?: string;
}

function convertMessages(messages: UIMessage[]) {
  return messages.map((msg) => ({
    role: msg.role,
    content:
      msg.content ??
      (msg.parts ?? [])
        .filter((p) => p.type === "text" && p.text)
        .map((p) => p.text)
        .join(""),
  }));
}

const FALLBACK_MESSAGE =
  "The assistant is taking a break right now! Feel free to browse the portfolio or reach out to Siddh directly at sidmandirwala9@gmail.com.";

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "127.0.0.1";
  const { success } = await chatLimiter.limit(ip);
  if (!success) {
    return new Response("You've reached your daily question limit. Please try again tomorrow.", { status: 429 });
  }

  try {
    const { messages } = await req.json();

    const result = streamText({
      model: google("gemma-3-4b-it"),
      system: SYSTEM_PROMPT,
      messages: convertMessages(messages),
      temperature: 0,
      maxOutputTokens: 200,
      maxRetries: 1,
    });

    const response = result.toTextStreamResponse();

    // Consume a small chunk to catch immediate API errors
    const reader = response.body?.getReader();
    if (!reader) throw new Error("No stream");
    const { value } = await reader.read();
    reader.releaseLock();

    // If we got here, streaming works — return a new response with the first chunk reattached
    const firstChunk = value ? new ReadableStream({
      start(controller) {
        controller.enqueue(value);
        const pump = response.body!.getReader();
        function read() {
          pump.read().then(({ done, value }) => {
            if (done) { controller.close(); return; }
            controller.enqueue(value);
            read();
          }).catch(() => controller.close());
        }
        read();
      }
    }) : response.body;

    return new Response(firstChunk, { headers: response.headers });
  } catch {
    return new Response(FALLBACK_MESSAGE);
  }
}
