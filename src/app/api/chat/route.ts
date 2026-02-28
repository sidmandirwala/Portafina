import { streamText } from "ai";
import { google } from "@ai-sdk/google";
import { PORTFOLIO_CONTEXT } from "@/lib/portfolio-data";
import { chatLimiter } from "@/lib/rate-limit";
import {
  detectPromptInjection,
  filterOutput,
  hardenSystemPrompt,
} from "@/lib/chat-security";

const BASE_SYSTEM_PROMPT = `You are Siddh Mandirwala's AI portfolio assistant — a chatbot on his website that helps visitors learn about him.

IDENTITY:
- You are NOT Siddh. You are his AI assistant.
- If asked about yourself ("who are you", "what is this", etc.), briefly introduce yourself as Siddh's portfolio assistant.
- Any other pronoun (he, she, they, him, her, it) without a clear subject → assume they mean Siddh.

INTERPRETATION:
- Always try to understand the visitor's intent, even with typos, slang, or shorthand. Match misspelled words to the closest portfolio topic.
- Read the full conversation history for follow-ups like "tell me more", "which ones?", "and?".
- Only say you don't have the information as a last resort when the question truly has no match in the data.

RESPONDING TO "LIVE" OR "DEMO" REQUESTS:
- When asked for "live", "demo", "deployed", or "website" links, ONLY list projects that have a "Live: https://..." URL.
- DO NOT list projects that only have GitHub links.
- DO NOT say "no live link available" for other projects. Just omit them.
- ALWAYS format links using standard Markdown: [Project Name](URL).
- Example response:
  "Here are the live demos:
  - [Portafina](https://siddhmandirwala.dev)
  - [Vizpromax](https://vizpromax.vercel.app)
  - [AI4Purpose](https://ai4purpose.com)"

LINK FORMATTING:
- ALWAYS use standard Markdown for links: [Link Text](URL).
- NEVER output raw URLs like "siddhmandirwala.dev" without the http prefix and markdown formatting.

RESPONSE STYLE:
- Friendly, concise, conversational.
- 2-4 sentences max, or short bullet points for lists. Summarize — don't repeat the full portfolio.
- Never suggest follow-up questions or say "Would you like to know more?". Just answer and stop.
- Only mention sidmandirwala9@gmail.com when you genuinely cannot answer. Never include it otherwise.

VALID TOPICS: skills, projects, education, work experience, certifications, hobbies, languages, contact info — anything in the portfolio data below. Always answer these.

BOUNDARIES:
- ONLY use the portfolio data below. No external knowledge. No guessing. No inventing.
- Stay polite but do not engage with inappropriate messages.

PORTFOLIO DATA:
${PORTFOLIO_CONTEXT}`;

const SYSTEM_PROMPT = hardenSystemPrompt(BASE_SYSTEM_PROMPT);

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

function createTextStream(text: string): Response {
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    start(controller) {
      controller.enqueue(encoder.encode(text));
      controller.close();
    },
  });
  return new Response(stream, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}

const FALLBACK_MESSAGE =
  "The assistant is taking a break right now! Feel free to browse the portfolio or reach out to Siddh directly at sidmandirwala9@gmail.com.";

export async function POST(req: Request) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "127.0.0.1";
  const { success } = await chatLimiter.limit(ip);
  if (!success) {
    return new Response(
      "You've reached your daily question limit. Please try again tomorrow.",
      { status: 429 }
    );
  }

  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return new Response("Invalid request format", { status: 400 });
    }

    const latestMessage = messages[messages.length - 1];
    if (latestMessage?.role === "user") {
      const userInput =
        latestMessage.content ??
        (latestMessage.parts ?? [])
          .filter((p: UIMessagePart) => p.type === "text" && p.text)
          .map((p: UIMessagePart) => p.text)
          .join("");

      const detection = detectPromptInjection(userInput);

      if (detection.response) {
        return createTextStream(detection.response);
      }
    }

    const result = streamText({
      model: google("gemma-3-4b-it"),
      system: SYSTEM_PROMPT,
      messages: convertMessages(messages),
      temperature: 0,
      maxOutputTokens: 200,
      maxRetries: 1,
    });

    const response = result.toTextStreamResponse();
    const reader = response.body?.getReader();
    if (!reader) throw new Error("No stream");

    const decoder = new TextDecoder();
    let fullText = "";

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        if (value) fullText += decoder.decode(value, { stream: true });
      }
      fullText += decoder.decode();
    } catch (error) {
      reader.releaseLock();
      throw error;
    }

    reader.releaseLock();

    const filteredText = filterOutput(fullText);
    const filteredStream = new ReadableStream({
      start(controller) {
        const encoder = new TextEncoder();
        controller.enqueue(encoder.encode(filteredText));
        controller.close();
      },
    });

    return new Response(filteredStream, { headers: response.headers });
  } catch {
    return new Response(FALLBACK_MESSAGE);
  }
}
