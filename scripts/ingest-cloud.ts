// ── Cloud Ingestion Script (reads LIVE TypeScript sources) ──────────────────
// Usage: npx tsx scripts/ingest-cloud.ts
//
// This script imports directly from lib/rag/profile-data.ts and lib/portfolio.ts
// so it ALWAYS uses your latest data. No hardcoded copies.
//
// Prerequisites (env vars):
//   CHROMA_URL        https://your-chromadb.onrender.com
//   CHROMA_TOKEN      (only if your Chroma instance has auth)
//   EMBEDDING_API_URL https://api.openai.com/v1/embeddings
//   EMBEDDING_API_KEY sk-your_openai_key
//   EMBEDDING_MODEL   text-embedding-3-small
// =============================================================================

import { baseKnowledge } from "../lib/rag/profile-data.js";

const CHROMA_URL = process.env.CHROMA_URL || "http://localhost:8000";
const CHROMA_TOKEN = process.env.CHROMA_TOKEN || "";
const COLLECTION = process.env.CHROMA_COLLECTION || "abhishek_portfolio";
const EMBEDDING_API_URL =
  process.env.EMBEDDING_API_URL || "https://api.openai.com/v1/embeddings";
const EMBEDDING_API_KEY = process.env.EMBEDDING_API_KEY || "";
const EMBEDDING_MODEL = process.env.EMBEDDING_MODEL || "text-embedding-3-small";

// ── Validate ────────────────────────────────────────────────────────────────
if (!EMBEDDING_API_KEY) {
  console.error("❌ EMBEDDING_API_KEY is required. Set it in your environment.");
  process.exit(1);
}

if (CHROMA_URL === "http://localhost:8000") {
  console.warn(
    "⚠️  CHROMA_URL is localhost. For cloud, set CHROMA_URL to your Render/Railway URL.",
  );
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

async function createEmbedding(text: string): Promise<number[]> {
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
  console.log(`\n🔗 ChromaDB:      ${CHROMA_URL}`);
  console.log(`📦 Collection:    ${COLLECTION}`);
  console.log(`🧠 Embeddings:    ${EMBEDDING_MODEL} (via ${EMBEDDING_API_URL})`);
  console.log(`📄 Source:        lib/rag/profile-data.ts (LIVE)`);
  console.log(`📄 Documents:     ${baseKnowledge.length}\n`);

  // 1. Create/get collection
  console.log("1/3  Creating/accessing collection...");
  const colResp = await fetch(`${CHROMA_URL}/api/v1/collections`, {
    method: "POST",
    headers: chromaHeaders(),
    body: JSON.stringify({ name: COLLECTION, get_or_create: true }),
  });

  if (!colResp.ok) {
    const err = await colResp.text().catch(() => "");
    throw new Error(`Failed to create collection: ${err}`);
  }
  console.log("   ✓ Collection ready\n");

  // 2. Generate embeddings in batches
  console.log("2/3  Generating embeddings (batches of 20)...");
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

  // 3. Upsert into ChromaDB
  console.log("3/3  Upserting into ChromaDB...");
  const addResp = await fetch(
    `${CHROMA_URL}/api/v1/collections/${COLLECTION}/add`,
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
    throw new Error(`Failed to add documents: ${err}`);
  }

  console.log(
    `\n✅ Successfully ingested ${ids.length} documents into "${COLLECTION}"`,
  );
  console.log(`   ChromaDB URL: ${CHROMA_URL}`);
  console.log(
    `   💡 Tip: Re-run this script (npx tsx scripts/ingest-cloud.ts) whenever you update profile-data.ts or portfolio.ts\n`,
  );
}

main().catch((err) => {
  console.error(`\n❌ Ingestion failed: ${err.message}`);
  process.exit(1);
});