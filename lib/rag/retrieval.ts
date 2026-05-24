import { baseKnowledge } from "@/lib/rag/profile-data";
import { ragConfig } from "@/lib/rag/config";
import { chromaHeaders, createEmbedding } from "@/lib/rag/http";
import type { RagDocument } from "@/types/chat";

function tokenize(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9+#. ]/g, " ")
    .split(/\s+/)
    .filter(Boolean);
}

function keywordScore(query: string, doc: RagDocument) {
  const queryTokens = new Set(tokenize(query));
  const docTokens = tokenize(`${doc.metadata.title ?? ""} ${doc.content}`);
  return docTokens.reduce((score, token) => score + (queryTokens.has(token) ? 1 : 0), 0);
}

async function retrieveFromChroma(query: string): Promise<RagDocument[]> {
  const embedding = await createEmbedding(query);

  if (!embedding.length) {
    return [];
  }

  const response = await fetch(
    `${ragConfig.chromaUrl}/api/v1/collections/${ragConfig.chromaCollection}/query`,
    {
      method: "POST",
      headers: chromaHeaders(),
      body: JSON.stringify({
        query_embeddings: [embedding],
        n_results: ragConfig.maxRetrievedDocs,
        include: ["documents", "metadatas"],
      }),
    }
  );

  if (!response.ok) {
    return [];
  }

  const data = (await response.json()) as {
    ids?: string[][];
    documents?: string[][];
    metadatas?: Array<Array<RagDocument["metadata"]>>;
  };

  return (data.documents?.[0] ?? []).map((content, index) => ({
    id: data.ids?.[0]?.[index] ?? `chroma-${index}`,
    content,
    metadata: data.metadatas?.[0]?.[index] ?? {
      source: "chroma",
      type: "document",
    },
  }));
}

export async function retrieveContext(query: string) {
  let docs: RagDocument[] = [];

  try {
    docs = await retrieveFromChroma(query);
  } catch {
    docs = [];
  }

  if (!docs.length) {
    docs = baseKnowledge
      .map((doc) => ({ doc, score: keywordScore(query, doc) }))
      .sort((a, b) => b.score - a.score)
      .slice(0, ragConfig.maxRetrievedDocs)
      .map(({ doc }) => doc);
  }

  return {
    docs,
    context: docs.map((doc) => `Source: ${doc.metadata.title ?? doc.metadata.source}\n${doc.content}`).join("\n\n"),
  };
}
