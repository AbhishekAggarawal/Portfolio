export const ragConfig = {
  groqApiKey: process.env.GROQ_API_KEY ?? "",
  groqModel: process.env.GROQ_MODEL ?? "llama-3.1-8b-instant",

  // ── Vector Store ──
  // "chroma" (default) or "qdrant" — auto-detected from env
  vectorStore: (process.env.VECTOR_STORE ?? "chroma") as "chroma" | "qdrant",

  // ChromaDB settings (legacy)
  chromaUrl: process.env.CHROMA_URL ?? "http://localhost:8000",
  chromaToken: process.env.CHROMA_TOKEN ?? "",
  chromaCollection: process.env.CHROMA_COLLECTION ?? "abhishek_portfolio",

  // Qdrant Cloud settings (free tier — 1GB, no time limit)
  qdrantUrl: process.env.QDRANT_URL ?? "",
  qdrantApiKey: process.env.QDRANT_API_KEY ?? "",
  qdrantCollection: process.env.QDRANT_COLLECTION ?? "abhishek_portfolio",

  // ── Embedding provider ──
  // Set EMBEDDING_API_URL to use a cloud provider (OpenAI, Gemini, etc.)
  // Falls back to local Ollama when EMBEDDING_API_URL is empty (dev mode)
  embeddingApiUrl: process.env.EMBEDDING_API_URL ?? "",
  embeddingApiKey: process.env.EMBEDDING_API_KEY ?? "",
  embeddingModel: process.env.EMBEDDING_MODEL ?? "text-embedding-3-small",
  // Provider type: "openai" | "gemini" | "ollama" — auto-detected, but can be forced
  embeddingProvider: (process.env.EMBEDDING_PROVIDER ?? "auto") as "openai" | "gemini" | "ollama" | "auto",
  // Gemini embedding dimension (3072 for gemini-embedding-001, 768 for text-embedding-004)
  embeddingDimension: Number(process.env.EMBEDDING_DIMENSION ?? 3072),

  // ── Local dev only ──
  ollamaBaseUrl: process.env.OLLAMA_BASE_URL ?? "http://localhost:11434",
  maxRetrievedDocs: Number(process.env.RAG_TOP_K ?? 5),
};

export const isRagConfigured = Boolean(ragConfig.groqApiKey);

// Convenience: auto-detect which vector store is active
export function getActiveVectorStore(): "chroma" | "qdrant" {
  if (ragConfig.vectorStore === "qdrant" && ragConfig.qdrantUrl) return "qdrant";
  if (ragConfig.qdrantUrl) return "qdrant";
  return "chroma";
}

export function isQdrantConfigured(): boolean {
  return Boolean(ragConfig.qdrantUrl && ragConfig.qdrantApiKey);
}
