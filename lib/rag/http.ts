import { ragConfig } from "@/lib/rag/config";

export function chromaHeaders() {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (ragConfig.chromaToken) {
    headers.Authorization = `Bearer ${ragConfig.chromaToken}`;
    headers["x-chroma-token"] = ragConfig.chromaToken;
  }

  return headers;
}

export async function createEmbedding(text: string) {
  if (ragConfig.embeddingApiUrl) {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (ragConfig.embeddingApiKey) {
      headers.Authorization = `Bearer ${ragConfig.embeddingApiKey}`;
    }

    const response = await fetch(ragConfig.embeddingApiUrl, {
      method: "POST",
      headers,
      body: JSON.stringify({
        model: ragConfig.embeddingModel,
        input: text,
        prompt: text,
      }),
    });

    if (!response.ok) {
      throw new Error("Cloud embedding service unavailable");
    }

    const data = (await response.json()) as {
      embedding?: number[];
      embeddings?: number[][];
      data?: Array<{ embedding: number[] }>;
    };

    return data.embedding ?? data.embeddings?.[0] ?? data.data?.[0]?.embedding ?? [];
  }

  const response = await fetch(`${ragConfig.ollamaBaseUrl}/api/embeddings`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: ragConfig.embeddingModel,
      prompt: text,
    }),
  });

  if (!response.ok) {
    throw new Error("Ollama embedding service unavailable");
  }

  const data = (await response.json()) as { embedding?: number[] };
  return data.embedding ?? [];
}
