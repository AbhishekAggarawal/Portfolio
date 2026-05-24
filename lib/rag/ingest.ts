import { baseKnowledge } from "@/lib/rag/profile-data";
import { ragConfig } from "@/lib/rag/config";
import { chromaHeaders, createEmbedding } from "@/lib/rag/http";
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
    documents: docs.length,
  };
}
