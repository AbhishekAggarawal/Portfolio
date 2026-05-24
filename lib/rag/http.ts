import { ragConfig, getActiveVectorStore } from "@/lib/rag/config";

// ── HTTP fetch with AbortController timeout ──
// Render free tier ChromaDB spins down after inactivity → first query after
// cold start can take 15-30s. 35s timeout handles this gracefully.
// Qdrant Cloud is always-on so 15s is sufficient.
const CHROMA_TIMEOUT_MS = 35_000;
const QDRANT_TIMEOUT_MS = 15_000;
const EMBEDDING_TIMEOUT_MS = 20_000;

async function fetchWithTimeout(
  url: string,
  options: RequestInit & { timeoutMs?: number },
): Promise<Response> {
  const { timeoutMs = 15_000, ...fetchOptions } = options;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      signal: controller.signal,
    });
    return response;
  } finally {
    clearTimeout(timer);
  }
}

// ── ChromaDB headers ──
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

// ── Qdrant headers ──
export function qdrantHeaders() {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (ragConfig.qdrantApiKey) {
    headers["api-key"] = ragConfig.qdrantApiKey;
  }

  return headers;
}

// ── Qdrant search ──
export interface QdrantSearchResult {
  id: string | number;
  docId: string;  // original string document ID from payload
  content: string;
  metadata: Record<string, unknown>;
  score: number;
}

export async function searchQdrant(
  embedding: number[],
  topK: number = 5,
): Promise<QdrantSearchResult[]> {
  const response = await fetchWithTimeout(
    `${ragConfig.qdrantUrl}/collections/${ragConfig.qdrantCollection}/points/search`,
    {
      method: "POST",
      headers: qdrantHeaders(),
      body: JSON.stringify({
        vector: embedding,
        limit: topK,
        with_payload: true,
      }),
      timeoutMs: QDRANT_TIMEOUT_MS,
    },
  );

  if (!response.ok) {
    const errText = await response.text().catch(() => "");
    throw new Error(
      `Qdrant search failed (${response.status}): ${errText.slice(0, 200)}`,
    );
  }

  const data = (await response.json()) as {
    result?: Array<{
      id: string | number;
      payload?: Record<string, unknown>;
      score: number;
    }>;
  };

  return (data.result ?? []).map((hit) => ({
    id: hit.id,
    docId: (hit.payload?.docId as string) ?? String(hit.id),
    content: (hit.payload?.content as string) ?? "",
    metadata: (hit.payload?.metadata as Record<string, unknown>) ?? {},
    score: hit.score,
  }));
}

// ── Qdrant upsert ──
export async function upsertQdrant(
  points: Array<{
    id: string | number;
    vector: number[];
    payload: Record<string, unknown>;
  }>,
) {
  const response = await fetchWithTimeout(
    `${ragConfig.qdrantUrl}/collections/${ragConfig.qdrantCollection}/points`,
    {
      method: "PUT",
      headers: qdrantHeaders(),
      body: JSON.stringify({
        points: points.map((p) => ({
          id: p.id,
          vector: p.vector,
          payload: p.payload,
        })),
      }),
      timeoutMs: QDRANT_TIMEOUT_MS,
    },
  );

  if (!response.ok) {
    const errText = await response.text().catch(() => "");
    throw new Error(
      `Qdrant upsert failed (${response.status}): ${errText.slice(0, 200)}`,
    );
  }

  return response.json();
}

// ── Qdrant create collection ──
export async function createQdrantCollection() {
  const response = await fetchWithTimeout(
    `${ragConfig.qdrantUrl}/collections/${ragConfig.qdrantCollection}`,
    {
      method: "PUT",
      headers: qdrantHeaders(),
      body: JSON.stringify({
        vectors: {
          size: ragConfig.embeddingDimension,
          distance: "Cosine",
        },
      }),
      timeoutMs: QDRANT_TIMEOUT_MS,
    },
  );

  // 200 = created, 409 = already exists → both OK
  if (!response.ok && response.status !== 409) {
    const errText = await response.text().catch(() => "");
    throw new Error(
      `Qdrant collection creation failed (${response.status}): ${errText.slice(0, 200)}`,
    );
  }

  return response.ok || response.status === 409;
}

// ── Embedding Creation ──
export async function createEmbedding(text: string) {
  // ── Gemini embedding provider (free tier: 1,500 req/day) ──
  if (ragConfig.embeddingProvider === "gemini" || ragConfig.embeddingApiKey) {
    const isGemini =
      ragConfig.embeddingProvider === "gemini" ||
      (ragConfig.embeddingProvider === "auto" &&
        ragConfig.embeddingApiKey &&
        !ragConfig.embeddingApiUrl.includes("openai"));

    if (isGemini && ragConfig.embeddingApiKey) {
      const geminiModel = ragConfig.embeddingModel || "gemini-embedding-001";
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${geminiModel}:embedContent?key=${ragConfig.embeddingApiKey}`;

      const response = await fetchWithTimeout(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: `models/${geminiModel}`,
          content: { parts: [{ text }] },
        }),
        timeoutMs: EMBEDDING_TIMEOUT_MS,
      });

      if (!response.ok) {
        const errText = await response.text().catch(() => "");
        throw new Error(
          `Gemini embedding failed (${response.status}): ${errText.slice(0, 200) || "unknown error"}`,
        );
      }

      const data = (await response.json()) as {
        embedding?: { values: number[] };
      };
      return data.embedding?.values ?? [];
    }
  }

  // ── Cloud embedding provider (OpenAI or compatible API) ──
  if (ragConfig.embeddingApiUrl) {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (ragConfig.embeddingApiKey) {
      headers.Authorization = `Bearer ${ragConfig.embeddingApiKey}`;
    }

    const isOpenAi =
      ragConfig.embeddingProvider === "openai" ||
      (ragConfig.embeddingProvider === "auto" &&
        ragConfig.embeddingApiUrl.includes("openai"));

    const body: Record<string, unknown> = {
      model: ragConfig.embeddingModel,
      input: text,
    };

    if (isOpenAi) {
      body.encoding_format = "float";
    } else {
      delete body.input;
      body.prompt = text;
    }

    const response = await fetchWithTimeout(ragConfig.embeddingApiUrl, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
      timeoutMs: EMBEDDING_TIMEOUT_MS,
    });

    if (!response.ok) {
      const errText = await response.text().catch(() => "");
      throw new Error(
        `Cloud embedding failed (${response.status}): ${errText.slice(0, 200) || "unknown error"}`,
      );
    }

    const data = (await response.json()) as {
      data?: Array<{ embedding: number[] }>;
      embedding?: number[];
      embeddings?: number[][];
    };

    return data.data?.[0]?.embedding ?? data.embedding ?? data.embeddings?.[0] ?? [];
  }

  // ── Local Ollama fallback (dev only) ──
  const response = await fetchWithTimeout(`${ragConfig.ollamaBaseUrl}/api/embeddings`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: ragConfig.embeddingModel,
      prompt: text,
    }),
    timeoutMs: EMBEDDING_TIMEOUT_MS,
  });

  if (!response.ok) {
    throw new Error("Local Ollama embedding service unavailable");
  }

  const data = (await response.json()) as { embedding?: number[] };
  return data.embedding ?? [];
}

export { fetchWithTimeout, CHROMA_TIMEOUT_MS, QDRANT_TIMEOUT_MS };
