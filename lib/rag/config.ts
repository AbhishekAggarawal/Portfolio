export const ragConfig = {
  groqApiKey: process.env.GROQ_API_KEY ?? "",
  groqModel: process.env.GROQ_MODEL ?? "llama-3.1-8b-instant",
  chromaUrl: process.env.CHROMA_URL ?? "http://localhost:8000",
  chromaToken: process.env.CHROMA_TOKEN ?? "",
  chromaCollection: process.env.CHROMA_COLLECTION ?? "abhishek_portfolio",
  ollamaBaseUrl: process.env.OLLAMA_BASE_URL ?? "http://localhost:11434",
  embeddingApiUrl: process.env.EMBEDDING_API_URL ?? "",
  embeddingApiKey: process.env.EMBEDDING_API_KEY ?? "",
  embeddingModel: process.env.EMBEDDING_MODEL ?? "nomic-embed-text",
  maxRetrievedDocs: Number(process.env.RAG_TOP_K ?? 5),
};

export const isRagConfigured = Boolean(ragConfig.groqApiKey);
