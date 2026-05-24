// ── Cloud Ingestion Script (reads LIVE TypeScript sources) ──────────────────
// Usage: npx tsx scripts/ingest-cloud.ts
//
// This script imports directly from lib/rag/profile-data.ts and lib/portfolio.ts
// so it ALWAYS uses your latest data. No hardcoded copies.
//
// Auto-detects vector store (Qdrant or ChromaDB) and embedding provider
// (Gemini or OpenAI) from environment variables — same as the runtime.
//
// Prerequisites (env vars):
//
//   PATH C — Qdrant Cloud + Gemini ($0/mo, production-grade):
//     QDRANT_URL          https://xyz-example.eu-central.aws.cloud.qdrant.io
//     QDRANT_API_KEY      your-qdrant-api-key
//     QDRANT_COLLECTION   abhishek_portfolio (default)
//     EMBEDDING_API_KEY   your-gemini-api-key (from https://aistudio.google.com/apikey)
//     EMBEDDING_PROVIDER  gemini
//     EMBEDDING_MODEL     gemini-embedding-001 (default for Gemini, 3072-dim)
//
//   PATH B — ChromaDB + OpenAI (~$7/mo):
//     CHROMA_URL          https://your-chromadb.onrender.com
//     CHROMA_TOKEN        (only if your Chroma instance has auth)
//     CHROMA_COLLECTION   abhishek_portfolio (default)
//     EMBEDDING_API_URL   https://api.openai.com/v1/embeddings
//     EMBEDDING_API_KEY   sk-your_openai_key
//     EMBEDDING_MODEL     text-embedding-3-small
// =============================================================================

import { baseKnowledge } from "../lib/rag/profile-data.js";

// ── Vector store detection ──────────────────────────────────────────────────
const VECTOR_STORE = process.env.VECTOR_STORE ?? "chroma";
const QDRANT_URL = process.env.QDRANT_URL ?? "";
const QDRANT_API_KEY = process.env.QDRANT_API_KEY ?? "";
const QDRANT_COLLECTION = process.env.QDRANT_COLLECTION ?? "abhishek_portfolio";

const CHROMA_URL = process.env.CHROMA_URL || "http://localhost:8000";
const CHROMA_TOKEN = process.env.CHROMA_TOKEN || "";
const CHROMA_COLLECTION = process.env.CHROMA_COLLECTION || "abhishek_portfolio";

const useQdrant = Boolean(QDRANT_URL && QDRANT_API_KEY) || VECTOR_STORE === "qdrant";

// ── Embedding provider detection ────────────────────────────────────────────
const EMBEDDING_API_URL =
  process.env.EMBEDDING_API_URL || "https://api.openai.com/v1/embeddings";
const EMBEDDING_API_KEY = process.env.EMBEDDING_API_KEY || "";
const EMBEDDING_PROVIDER = process.env.EMBEDDING_PROVIDER ?? "auto";

const useGemini =
  EMBEDDING_PROVIDER === "gemini" ||
  (EMBEDDING_PROVIDER === "auto" &&
    EMBEDDING_API_KEY &&
    !EMBEDDING_API_URL.includes("openai"));

const EMBEDDING_MODEL = useGemini
  ? (process.env.EMBEDDING_MODEL || "gemini-embedding-001")
  : (process.env.EMBEDDING_MODEL || "text-embedding-3-small");

// ── Validate ────────────────────────────────────────────────────────────────
if (!EMBEDDING_API_KEY) {
  console.error("❌ EMBEDDING_API_KEY is required. Set it in your environment.");
  console.error("   For Gemini (free): https://aistudio.google.com/apikey");
  console.error("   For OpenAI:        https://platform.openai.com/api-keys");
  process.exit(1);
}

if (!useQdrant && CHROMA_URL === "http://localhost:8000") {
  console.warn(
    "⚠️  CHROMA_URL is localhost. For cloud, set CHROMA_URL to your Render/Railway URL.",
  );
}

if (useQdrant && !QDRANT_URL) {
  console.error("❌ QDRANT_URL is required when using Qdrant.");
  process.exit(1);
}

// ── Helpers ─────────────────────────────────────────────────────────────────

function chromaHeaders() {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (CHROMA_TOKEN) {
    headers["Authorization"] = `Bearer ${CHROMA_TOKEN}`;
    headers["x-chroma-token"] = CHROMA_TOKEN;
  }
  return headers;
}

function qdrantHeaders() {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (QDRANT_API_KEY) {
    headers["api-key"] = QDRANT_API_KEY;
  }
  return headers;
}

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

async function createEmbedding(text: string): Promise<number[]> {
  if (useGemini) {
    // ── Gemini embedding API (free tier: 1,500 req/day) ──
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${EMBEDDING_MODEL}:embedContent?key=${EMBEDDING_API_KEY}`;

    const response = await fetchWithTimeout(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: `models/${EMBEDDING_MODEL}`,
        content: { parts: [{ text }] },
      }),
      timeoutMs: 20_000,
    });

    if (!response.ok) {
      const err = await response.text().catch(() => "");
      throw new Error(
        `Gemini embedding failed (${response.status}): ${err.slice(0, 200)}`,
      );
    }

    const data = (await response.json()) as {
      embedding?: { values: number[] };
    };
    return data.embedding?.values ?? [];
  }

  // ── OpenAI / compatible embedding API ──
  const response = await fetch(EMBEDDING_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${EMBEDDING_API_KEY}`,
    },
    body: JSON.stringify({
      model: EMBEDDING_MODEL,
      input: text,
      encoding_format: "float",
    }),
  });

  if (!response.ok) {
    const err = await response.text().catch(() => "");
    throw new Error(
      `Embedding failed (${response.status}): ${err.slice(0, 200)}`,
    );
  }

  const data = (await response.json()) as {
    data?: Array<{ embedding: number[] }>;
  };
  return data.data?.[0]?.embedding ?? [];
}

// ── Main ────────────────────────────────────────────────────────────────────
async function main() {
  const storeLabel = useQdrant ? "Qdrant Cloud" : "ChromaDB";
  const storeUrl = useQdrant ? QDRANT_URL : CHROMA_URL;
  const collection = useQdrant ? QDRANT_COLLECTION : CHROMA_COLLECTION;
  const embedLabel = useGemini ? `Gemini (${EMBEDDING_MODEL})` : `OpenAI (${EMBEDDING_MODEL})`;

  console.log(`\n🔗 Vector Store:  ${storeLabel} — ${storeUrl}`);
  console.log(`📦 Collection:    ${collection}`);
  console.log(`🧠 Embeddings:    ${embedLabel}`);
  console.log(`📄 Source:        lib/rag/profile-data.ts (LIVE)`);
  console.log(`📄 Documents:     ${baseKnowledge.length}\n`);

  // 1. Create/get collection
  console.log("1/3  Creating/accessing collection...");

  if (useQdrant) {
    const colResp = await fetchWithTimeout(
      `${QDRANT_URL}/collections/${QDRANT_COLLECTION}`,
      {
        method: "PUT",
        headers: qdrantHeaders(),
        body: JSON.stringify({
          vectors: {
            size: useGemini ? 3072 : 1536,
            distance: "Cosine",
          },
        }),
        timeoutMs: 15_000,
      },
    );

    if (!colResp.ok && colResp.status !== 409) {
      const err = await colResp.text().catch(() => "");
      throw new Error(`Failed to create Qdrant collection: ${err}`);
    }
    console.log("   ✓ Collection ready (Qdrant Cloud)\n");
  } else {
    const colResp = await fetch(`${CHROMA_URL}/api/v1/collections`, {
      method: "POST",
      headers: chromaHeaders(),
      body: JSON.stringify({ name: CHROMA_COLLECTION, get_or_create: true }),
    });

    if (!colResp.ok) {
      const err = await colResp.text().catch(() => "");
      throw new Error(`Failed to create ChromaDB collection: ${err}`);
    }
    console.log("   ✓ Collection ready (ChromaDB)\n");
  }

  // 2. Generate embeddings in batches
  const batchLabel = useGemini ? "Gemini (1,500 req/day free; batching 20)" : "OpenAI";
  console.log(`2/3  Generating embeddings via ${batchLabel}...`);

  const BATCH_SIZE = 20;
  const ids: string[] = [];
  const contents: string[] = [];
  const metadatas: Array<Record<string, string>> = [];
  const allEmbeddings: number[][] = [];

  for (let i = 0; i < baseKnowledge.length; i += BATCH_SIZE) {
    const batch = baseKnowledge.slice(i, i + BATCH_SIZE);
    const batchEmbeddings = await Promise.all(
      batch.map((doc) => createEmbedding(doc.content)),
    );

    for (let j = 0; j < batch.length; j++) {
      ids.push(batch[j].id);
      contents.push(batch[j].content);
      metadatas.push(batch[j].metadata as Record<string, string>);
      allEmbeddings.push(batchEmbeddings[j]);
    }

    const progress = Math.min(i + BATCH_SIZE, baseKnowledge.length);
    console.log(
      `   ⏳ ${String(progress).padStart(2)}/${baseKnowledge.length} documents embedded`,
    );
  }
  console.log(`   ✓ ${allEmbeddings.length} embeddings generated\n`);

  // 3. Upsert into vector store
  console.log(`3/3  Upserting into ${storeLabel}...`);

  if (useQdrant) {
    // Qdrant: upsert in batches of 10 (3072-dim vectors are large)
    // Qdrant REST API requires point IDs to be unsigned integers or UUIDs
    const QDRANT_BATCH = 10;
    for (let i = 0; i < ids.length; i += QDRANT_BATCH) {
      const batchIds = ids.slice(i, i + QDRANT_BATCH);
      const batchVectors = allEmbeddings.slice(i, i + QDRANT_BATCH);
      const batchContents = contents.slice(i, i + QDRANT_BATCH);
      const batchMetadatas = metadatas.slice(i, i + QDRANT_BATCH);

      const points = batchIds.map((_docId, idx) => ({
        id: i + idx,  // sequential integer (Qdrant requires unsigned int or UUID)
        vector: batchVectors[idx],
        payload: {
          docId: batchIds[idx],  // store original string ID in payload
          content: batchContents[idx],
          metadata: batchMetadatas[idx],
        },
      }));

      const upsertResp = await fetchWithTimeout(
        `${QDRANT_URL}/collections/${QDRANT_COLLECTION}/points`,
        {
          method: "PUT",
          headers: qdrantHeaders(),
          body: JSON.stringify({ points }),
          timeoutMs: 60_000,
        },
      );

      if (!upsertResp.ok) {
        const err = await upsertResp.text().catch(() => "");
        throw new Error(`Qdrant upsert failed: ${err}`);
      }

      console.log(
        `   ⏳ ${Math.min(i + QDRANT_BATCH, ids.length)}/${ids.length} points upserted`,
      );
    }
  } else {
    // ChromaDB: single add call
    const addResp = await fetch(
      `${CHROMA_URL}/api/v1/collections/${CHROMA_COLLECTION}/add`,
      {
        method: "POST",
        headers: chromaHeaders(),
        body: JSON.stringify({
          ids,
          documents: contents,
          metadatas,
          embeddings: allEmbeddings,
        }),
      },
    );

    if (!addResp.ok) {
      const err = await addResp.text().catch(() => "");
      throw new Error(`Failed to add documents to ChromaDB: ${err}`);
    }
  }

  console.log(
    `\n✅ Successfully ingested ${ids.length} documents into "${collection}"`,
  );
  console.log(`   Vector Store: ${storeLabel} — ${storeUrl}`);
  console.log(`   Embeddings:   ${embedLabel}`);
  console.log(
    `   💡 Tip: Re-run this script (npx tsx scripts/ingest-cloud.ts) whenever you update profile-data.ts or portfolio.ts\n`,
  );
}

main().catch((err) => {
  console.error(`\n❌ Ingestion failed: ${err.message}`);
  process.exit(1);
});