import { NextResponse } from "next/server";
import { ragConfig } from "@/lib/rag/config";
import { chromaHeaders } from "@/lib/rag/http";

export const runtime = "nodejs";

async function checkUrl(url: string, timeoutMs = 2500, headers?: Record<string, string>) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, { signal: controller.signal, headers });
    return response.ok;
  } catch {
    return false;
  } finally {
    clearTimeout(timeout);
  }
}

export async function GET() {
  const [chroma, ollama] = await Promise.all([
    checkUrl(`${ragConfig.chromaUrl}/api/v1/heartbeat`, 2500, chromaHeaders()),
    ragConfig.embeddingApiUrl ? Promise.resolve(true) : checkUrl(`${ragConfig.ollamaBaseUrl}/api/tags`),
  ]);

  return NextResponse.json({
    groq: Boolean(ragConfig.groqApiKey),
    chroma,
    embedding: ollama,
    collection: ragConfig.chromaCollection,
    embeddingModel: ragConfig.embeddingModel,
  });
}
