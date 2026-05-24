import { NextRequest } from "next/server";
import { groqSseToTextStream, streamGroq } from "@/lib/rag/groq";
import { buildRagPrompt, SYSTEM_PROMPT } from "@/lib/rag/prompt";
import { retrieveContext } from "@/lib/rag/retrieval";
import { rateLimit } from "@/lib/rag/rate-limit";
import type { ChatRequest } from "@/types/chat";

export const runtime = "nodejs";

const PROFESSIONAL_TERMS = [
  "abhishek",
  "project",
  "skill",
  "resume",
  "experience",
  "hire",
  "work",
  "technology",
  "portfolio",
  "certificate",
  "github",
  "ai",
  "ml",
  "data",
  "python",
  "react",
  "next",
  "engineer",
  "background",
];

function isProfessionalQuestion(question: string) {
  const normalized = question.toLowerCase();
  return PROFESSIONAL_TERMS.some((term) => normalized.includes(term));
}

function textResponse(text: string, status = 200) {
  return new Response(text, {
    status,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
    },
  });
}

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0] ?? "local";

  if (!rateLimit(ip)) {
    return textResponse("Too many requests. Please try again shortly.", 429);
  }

  try {
    const body = (await request.json()) as ChatRequest;
    const messages = body.messages ?? [];
    const latest = [...messages].reverse().find((message) => message.role === "user")?.content?.trim();

    if (!latest) {
      return textResponse("Please ask a question about Abhishek's professional background.", 400);
    }

    if (!isProfessionalQuestion(latest)) {
      return textResponse(
        "I can help with Abhishek's projects, skills, AI/ML background, experience, resume, certificates, and hiring fit. What would you like to know about his professional profile?"
      );
    }

    const { context } = await retrieveContext(latest);
    const prompt = buildRagPrompt(latest, context);
    const stream = await streamGroq([
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: prompt },
    ]);

    return new Response(groqSseToTextStream(stream), {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache, no-transform",
        "X-Accel-Buffering": "no",
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown chat error";

    if (message.includes("GROQ_API_KEY")) {
      return textResponse(
        "The AI assistant is ready, but GROQ_API_KEY is not configured yet. Add it to your environment to enable live Groq responses.",
        503
      );
    }

    return textResponse("I could not complete that response right now. Please try again in a moment.", 500);
  }
}
