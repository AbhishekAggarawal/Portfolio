import { baseKnowledge } from "@/lib/rag/profile-data";
import { ragConfig, getActiveVectorStore, isQdrantConfigured } from "@/lib/rag/config";
import { chromaHeaders, createEmbedding, createQdrantCollection, upsertQdrant } from "@/lib/rag/http";
import type { RagDocument } from "@/types/chat";

async function dynamicImport<T>(specifier: string): Promise<T> {
  const importer = new Function("specifier", "return import(specifier)");
  return importer(specifier) as Promise<T>;
}

async function splitDocuments(docs: RagDocument[]) {
  try {
    const { RecursiveCharacterTextSplitter } = await dynamicImport<{
      RecursiveCharacterTextSplitter: new (args: { chunkSize: number; chunkOverlap: number }) => {
        splitText(text: string): Promise<string[]>;
      };
    }>("langchain/text_splitter");

    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 900,
      chunkOverlap: 120,
    });

    const chunks: RagDocument[] = [];

    for (const doc of docs) {
      const parts = await splitter.splitText(doc.content);
      parts.forEach((content, index) => {
        chunks.push({
          id: `${doc.id}-${index}`,
          content,
          metadata: doc.metadata,
        });
      });
    }

    return chunks;
  } catch {
    return docs;
  }
}

export async function ingestPortfolioKnowledge(extraDocs: RagDocument[] = []) {
  const docs = await splitDocuments([...baseKnowledge, ...extraDocs]);
  const embeddings = await Promise.all(docs.map((doc) => createEmbedding(doc.content)));

  const activeStore = getActiveVectorStore();

  if (activeStore === "qdrant" && isQdrantConfigured()) {
    // ── Qdrant Cloud ingestion ──
    await createQdrantCollection();

    const points = docs.map((doc, index) => ({
      id: index,  // sequential integer (Qdrant REST requires unsigned int or UUID)
      vector: embeddings[index],
      payload: {
        docId: doc.id,  // store original string ID in payload
        content: doc.content,
        metadata: doc.metadata,
      },
    }));

    // Upsert in batches of 100 (Qdrant free tier handles this well)
    const BATCH_SIZE = 100;
    for (let i = 0; i < points.length; i += BATCH_SIZE) {
      await upsertQdrant(points.slice(i, i + BATCH_SIZE));
    }

    return {
      collection: ragConfig.qdrantCollection,
      store: "qdrant",
      documents: docs.length,
    };
  }

  // ── ChromaDB ingestion (default / fallback) ──
  const collectionResponse = await fetch(`${ragConfig.chromaUrl}/api/v1/collections`, {
    method: "POST",
    headers: chromaHeaders(),
    body: JSON.stringify({
      name: ragConfig.chromaCollection,
      get_or_create: true,
    }),
  });

  if (!collectionResponse.ok) {
    throw new Error("Could not create or access ChromaDB collection.");
  }

  const addResponse = await fetch(`${ragConfig.chromaUrl}/api/v1/collections/${ragConfig.chromaCollection}/add`, {
    method: "POST",
    headers: chromaHeaders(),
    body: JSON.stringify({
      ids: docs.map((doc) => doc.id),
      documents: docs.map((doc) => doc.content),
      metadatas: docs.map((doc) => doc.metadata),
      embeddings,
    }),
  });

  if (!addResponse.ok) {
    throw new Error("Could not add documents to ChromaDB.");
  }

  return {
    collection: ragConfig.chromaCollection,
    store: "chroma",
    documents: docs.length,
  };
}
