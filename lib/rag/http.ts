import { ragConfig } from "@/lib/rag/config";

// ── HTTP fetch with AbortController timeout ──
// Render free tier ChromaDB spins down after inactivity → first query after
// cold start can take 15-30s. 35s timeout handles this gracefully.
const CHROMA_TIMEOUT_MS = 35_000;
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
  // ── Cloud embedding provider (OpenAI, Groq, or compatible API) ──
  if (ragConfig.embeddingApiUrl) {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (ragConfig.embeddingApiKey) {
      headers.Authorization = `Bearer ${ragConfig.embeddingApiKey}`;
    }

    // Auto-detect: if URL contains "openai" or provider is forced to "openai",
    // use `input` key; otherwise use `prompt` key for Ollama-compatible APIs
    const isOpenAi =
      ragConfig.embeddingProvider === "openai" ||
      (ragConfig.embeddingProvider === "auto" &&
        ragConfig.embeddingApiUrl.includes("openai"));

    const body: Record<string, unknown> = {
      model: ragConfig.embeddingModel,
      input: text,
    };

    // OpenAI requires encoding_format for deterministic float arrays
    if (isOpenAi) {
      body.encoding_format = "float";
    } else {
      // Ollama-compatible: use `prompt` key
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
      // OpenAI format: { data: [{ embedding: number[] }] }
      data?: Array<{ embedding: number[] }>;
      // Groq/Ollama-compatible formats
      embedding?: number[];
      embeddings?: number[][];
    };

    // OpenAI → data.data[0].embedding, Groq → data.data[0].embedding, Ollama → data.embedding
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

export { fetchWithTimeout, CHROMA_TIMEOUT_MS };
