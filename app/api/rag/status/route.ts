import { NextResponse } from "next/server";
import { ragConfig, getActiveVectorStore, isQdrantConfigured } from "@/lib/rag/config";
import { chromaHeaders, qdrantHeaders } from "@/lib/rag/http";

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
  const activeStore = getActiveVectorStore();
  const isQdrant = activeStore === "qdrant" && isQdrantConfigured();

  const [chromaOk, qdrantOk, ollamaOk] = await Promise.all([
    // ChromaDB heartbeat (only relevant when using ChromaDB)
    checkUrl(`${ragConfig.chromaUrl}/api/v1/heartbeat`, 2500, chromaHeaders()),
    // Qdrant health check (only relevant when using Qdrant)
    isQdrant
      ? checkUrl(`${ragConfig.qdrantUrl}/healthz`, 2500, qdrantHeaders())
      : Promise.resolve(false),
    // Local Ollama (dev only)
    ragConfig.embeddingApiUrl
      ? Promise.resolve(true) // cloud embeddings — always available
      : checkUrl(`${ragConfig.ollamaBaseUrl}/api/tags`),
  ]);

  return NextResponse.json({
    groq: Boolean(ragConfig.groqApiKey),
    vectorStore: {
      active: activeStore,
      qdrant: isQdrant ? { url: ragConfig.qdrantUrl, reachable: qdrantOk, collection: ragConfig.qdrantCollection } : undefined,
      chroma: { url: ragConfig.chromaUrl, reachable: chromaOk, collection: ragConfig.chromaCollection },
    },
    embedding: {
      ready: ragConfig.embeddingApiUrl ? true : ollamaOk,
      provider: ragConfig.embeddingProvider,
      model: ragConfig.embeddingModel,
      dimension: ragConfig.embeddingDimension,
    },
    groqModel: ragConfig.groqModel,
  });
}
