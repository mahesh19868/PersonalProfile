import OpenAI from "openai";
import { NextResponse } from "next/server";
import {
  buildDigitalTwinSystemPrompt,
  DIGITAL_TWIN_MODEL,
} from "@/lib/digital-twin-context";

export const runtime = "nodejs";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

type ChatRequestBody = {
  messages?: ChatMessage[];
};

const MAX_MESSAGES = 20;
const MAX_CONTENT_LENGTH = 4000;

export async function POST(request: Request) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "OpenAI API key is not configured." },
      { status: 500 }
    );
  }

  let body: ChatRequestBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const incoming = body.messages;
  if (!Array.isArray(incoming) || incoming.length === 0) {
    return NextResponse.json(
      { error: "messages array is required." },
      { status: 400 }
    );
  }

  const messages = incoming.slice(-MAX_MESSAGES).filter((m) => {
    if (!m || (m.role !== "user" && m.role !== "assistant")) return false;
    if (typeof m.content !== "string") return false;
    return m.content.trim().length > 0 && m.content.length <= MAX_CONTENT_LENGTH;
  });

  if (messages.length === 0 || messages[messages.length - 1]?.role !== "user") {
    return NextResponse.json(
      { error: "Last message must be from the user." },
      { status: 400 }
    );
  }

  const openai = new OpenAI({ apiKey });

  try {
    const completion = await openai.chat.completions.create({
      model: DIGITAL_TWIN_MODEL,
      messages: [
        { role: "system", content: buildDigitalTwinSystemPrompt() },
        ...messages.map((m) => ({ role: m.role, content: m.content.trim() })),
      ],
      temperature: 0.4,
      max_completion_tokens: 1024,
    });

    const reply = completion.choices[0]?.message?.content?.trim();
    if (!reply) {
      return NextResponse.json(
        { error: "No response from the model." },
        { status: 502 }
      );
    }

    return NextResponse.json({ message: reply });
  } catch (err) {
    console.error("[digital-twin]", err);

    if (err instanceof OpenAI.APIError) {
      if (err.status === 429) {
        return NextResponse.json(
          {
            error:
              "OpenAI rate limit or billing limit reached. Check credits at platform.openai.com.",
          },
          { status: 503 }
        );
      }
      if (err.status === 401) {
        return NextResponse.json(
          { error: "Invalid OpenAI API key. Check OPENAI_API_KEY in .env." },
          { status: 500 }
        );
      }
      return NextResponse.json(
        { error: err.message || "OpenAI request failed." },
        { status: 502 }
      );
    }

    const message =
      err instanceof Error ? err.message : "Failed to reach OpenAI.";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
