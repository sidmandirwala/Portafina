import { streamText } from "ai";
import { google } from "@ai-sdk/google";
import { PORTFOLIO_CONTEXT } from "@/lib/portfolio-data";
import { chatLimiter } from "@/lib/rate-limit";
import {
  detectPromptInjection,
  filterOutput,
  hardenSystemPrompt,
} from "@/lib/chat-security";

// Base system prompt (will be hardened with security header)
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

BOUNDARIES:
- ONLY use the portfolio data below. No external knowledge. No guessing. No inventing.
- For off-topic questions (weather, code help, random topics, etc.), say: "I can only answer questions about Siddh's portfolio!"
- Stay polite but do not engage with inappropriate messages.

PORTFOLIO DATA:
${PORTFOLIO_CONTEXT}`;

// Apply Layer 3: System Prompt Hardening
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

    // Edge case: Validate messages array exists and has content
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return new Response("Invalid request format", { status: 400 });
    }

    // Layer 1: Input Sanitization - Check the latest user message for prompt injection
    const latestMessage = messages[messages.length - 1];
    if (latestMessage?.role === "user") {
      // Extract text from the message (handles both content and parts formats)
      const userInput =
        latestMessage.content ??
        (latestMessage.parts ?? [])
          .filter((p: UIMessagePart) => p.type === "text" && p.text)
          .map((p: UIMessagePart) => p.text)
          .join("");

      // Detect prompt injection attempts
      const detection = detectPromptInjection(userInput);

      // If it's a legitimate security question, return helpful response as a stream
      if (detection.isLegitQuestion && detection.response) {
        const encoder = new TextEncoder();
        const stream = new ReadableStream({
          start(controller) {
            controller.enqueue(encoder.encode(detection.response));
            controller.close();
          },
        });
        return new Response(stream, {
          headers: {
            "Content-Type": "text/plain; charset=utf-8",
          },
        });
      }

      // If it's an attack, return playful response as a stream
      if (detection.isAttack && detection.response) {
        const encoder = new TextEncoder();
        const stream = new ReadableStream({
          start(controller) {
            controller.enqueue(encoder.encode(detection.response));
            controller.close();
          },
        });
        return new Response(stream, {
          headers: {
            "Content-Type": "text/plain; charset=utf-8",
          },
        });
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

    // Layer 2: Output Filtering - Scan the stream for leaked content
    // We need to buffer the entire response to check for leaks before sending
    const reader = response.body?.getReader();
    if (!reader) throw new Error("No stream");

    // Buffer all chunks to scan for leaked content
    const decoder = new TextDecoder();
    let fullText = "";

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        if (value) {
          // Decode and append to full text for scanning
          fullText += decoder.decode(value, { stream: true });
        }
      }
      // Final decode with stream: false
      fullText += decoder.decode();
    } catch (error) {
      reader.releaseLock();
      throw error;
    }

    reader.releaseLock();

    // Check if the complete response contains leaked content
    const filteredText = filterOutput(fullText);

    // Create a new stream with the filtered response
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
