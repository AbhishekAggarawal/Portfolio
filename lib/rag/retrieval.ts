import { baseKnowledge } from "@/lib/rag/profile-data";
import { ragConfig } from "@/lib/rag/config";
import { chromaHeaders, createEmbedding, fetchWithTimeout, CHROMA_TIMEOUT_MS } from "@/lib/rag/http";
import type { RagDocument } from "@/types/chat";

// ── Tokenizer ──
function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9+#. ]/g, " ")
    .split(/\s+/)
    .filter(Boolean);
}

// ── Synonym expansion ── maps common recruiter terms to canonical terms ──
const SYNONYMS: Record<string, string[]> = {
  // Project-related
  project: ["projects", "build", "built", "created", "developed", "app", "apps", "application",
    "applications", "platform", "product", "work", "portfolio", "side project", "side projects",
    "personal project", "personal projects", "showcase", "repo", "repos", "repository",
    "code", "coding", "demo", "live", "deployed", "launched"],
  // Skill-related
  skill: ["skills", "tech", "technologies", "stack", "know", "proficient", "proficiency",
    "proficient in", "good at", "expertise", "competency", "capable", "capabilities",
    "tool", "tools", "framework", "frameworks", "language", "languages", "library",
    "libraries", "database", "databases", "cloud", "devops"],
  // Experience-related
  experience: ["experiences", "work", "job", "role", "roles", "position", "career",
    "axis bank", "axis", "bank", "company", "employed", "employment", "internship",
    "intern", "professional", "industry"],
  // Education-related
  education: ["education", "study", "studies", "college", "university", "degree", "btech",
    "b.tech", "nit", "nitc", "nit calicut", "school", "academic", "academics",
    "cgpa", "grades", "12th", "board"],
  // Certificate-related
  certificate: ["certificates", "cert", "certs", "certification", "certifications",
    "course", "courses", "training", "credential", "credentials", "google cloud",
    "networking"],
  // HR / Interview Q&A
  "hr-qa": ["strength", "strengths", "weakness", "weaknesses", "hire", "hiring",
    "salary", "compensation", "relocate", "relocation", "interview", "question",
    "answer", "tell me", "why should", "why do you", "where do you see", "5 years",
    "motivate", "motivation", "teamwork", "team player", "pressure", "deadline",
    "initiative", "challenge", "updated", "trend"],
  // Contact
  contact: ["contact", "email", "phone", "linkedin", "github", "location", "address",
    "reach", "reach out", "get in touch", "connect"],
  // General profile
  profile: ["about", "background", "summary", "introduce", "introduction", "who",
    "tell me about", "bio", "profile", "overview", "resume", "cv"],
};

// ── Document-type to query-intent mapping ──
type DocType = RagDocument["metadata"]["type"] | "hr-qa" | "index";

const TYPE_SYNONYM_MAP: Record<string, DocType[]> = {};

// Build reverse map: "projects" → "project", "strengths" → "hr-qa", etc.
for (const [docType, synonyms] of Object.entries(SYNONYMS)) {
  for (const synonym of synonyms) {
    if (!TYPE_SYNONYM_MAP[synonym]) {
      TYPE_SYNONYM_MAP[synonym] = [];
    }
    if (!TYPE_SYNONYM_MAP[synonym].includes(docType as DocType)) {
      TYPE_SYNONYM_MAP[synonym].push(docType as DocType);
    }
  }
  // Also map canonical form
  if (!TYPE_SYNONYM_MAP[docType]) {
    TYPE_SYNONYM_MAP[docType] = [];
  }
  if (!TYPE_SYNONYM_MAP[docType].includes(docType as DocType)) {
    TYPE_SYNONYM_MAP[docType].push(docType as DocType);
  }
}

// ── Intent detection ──
function detectIntent(query: string): DocType[] {
  const tokens = tokenize(query);
  const detected = new Set<DocType>();

  for (const token of tokens) {
    const types = TYPE_SYNONYM_MAP[token];
    if (types) {
      for (const t of types) detected.add(t);
    }
  }

  // If nothing detected, default to profile (general)
  if (detected.size === 0) {
    detected.add("profile");
  }

  return Array.from(detected);
}

// ── Normalize "hr-qa" intent to "profile" type for document lookup ──
// hr-qa documents use type: "profile" in metadata
function normalizeDocTypes(intents: DocType[]): RagDocument["metadata"]["type"][] {
  return intents
    .map((t) => (t === "hr-qa" || t === "index" ? "profile" : t as RagDocument["metadata"]["type"]))
    .filter((v, i, a) => a.indexOf(v) === i);
}

// ── Keyword scoring with multi-field + synonym awareness ──
function keywordScore(query: string, doc: RagDocument): number {
  const queryTokens = new Set(tokenize(query));

  // Expand query tokens with synonyms for broader matching
  const expandedTokens = new Set<string>();
  for (const token of Array.from(queryTokens)) {
    expandedTokens.add(token);
    const syns = SYNONYMS[token];
    if (syns) {
      for (const s of syns) expandedTokens.add(s);
    }
  }

  const searchableText = [
    doc.metadata.title ?? "",
    doc.metadata.type ?? "",
    doc.metadata.source ?? "",
    doc.content,
  ].join(" ");

  const docTokens = tokenize(searchableText);
  const titleTokens = new Set(tokenize(doc.metadata.title ?? ""));
  const typeTokens = new Set(tokenize(doc.metadata.type ?? ""));
  const sourceTokens = new Set(tokenize(doc.metadata.source ?? ""));

  return docTokens.reduce((score, token) => {
    if (!expandedTokens.has(token)) return score;
    let weight = 1;
    if (titleTokens.has(token)) weight = 4;
    else if (typeTokens.has(token)) weight = 3;
    else if (sourceTokens.has(token)) weight = 2;
    return score + weight;
  }, 0);
}

// ── Category-based mandatory inclusion ──
// Ensures the right document types are always present for detected intents
function ensureCategoryCoverage(
  currentDocs: RagDocument[],
  intents: DocType[],
  scoredAll: { doc: RagDocument; score: number }[],
): RagDocument[] {
  const result = [...currentDocs];
  const targetTypes = normalizeDocTypes(intents);
  const presentTypes = new Set(result.map((d) => d.metadata.type));

  for (const targetType of targetTypes) {
    if (presentTypes.has(targetType)) continue;

    // Find the highest-scoring doc of this type that's not already included
    const bestOfType = scoredAll.find(
      ({ doc, score }) =>
        score > 0 &&
        doc.metadata.type === targetType &&
        !result.some((r) => r.id === doc.id),
    );

    if (bestOfType) {
      result.push(bestOfType.doc);
      presentTypes.add(targetType);
    }
  }

  return result;
}

// ── ChromaDB retrieval ──
// Uses fetchWithTimeout to handle Render free tier cold starts (15-30s spin-up)
async function retrieveFromChroma(query: string): Promise<RagDocument[]> {
  const embedding = await createEmbedding(query);

  if (!embedding.length) {
    return [];
  }

  try {
    const response = await fetchWithTimeout(
      `${ragConfig.chromaUrl}/api/v1/collections/${ragConfig.chromaCollection}/query`,
      {
        method: "POST",
        headers: chromaHeaders(),
        body: JSON.stringify({
          query_embeddings: [embedding],
          n_results: ragConfig.maxRetrievedDocs,
          include: ["documents", "metadatas"],
        }),
        timeoutMs: CHROMA_TIMEOUT_MS,
      },
    );

    if (!response.ok) {
      // Log the error in production for debugging, but fall back gracefully
      console.warn(
        `[retrieveFromChroma] ChromaDB returned ${response.status} — falling back to keyword search`,
      );
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
  } catch (err) {
    // Timeout (AbortError) or network error → fall back to keyword search
    console.warn(
      `[retrieveFromChroma] ChromaDB unreachable: ${err instanceof Error ? err.message : "unknown"} — falling back to keyword search`,
    );
    return [];
  }
}

// ── Edge case detection: queries the keyword system should always handle ──
const ALWAYS_MATCH_QUERIES: Record<string, string[]> = {
  "tell me about yourself": ["hr-qa-1", "profile-summary"],
  "walk me through your resume": ["hr-qa-1", "profile-experience", "profile-education-1"],
  "what are your projects": ["project-contextframe", "project-portfolio-rag", "project-syncboard", "project-maskmyfeed"],
  "list your projects": ["project-contextframe", "project-portfolio-rag", "project-syncboard", "project-maskmyfeed"],
  "show me your projects": ["project-contextframe", "project-portfolio-rag", "project-syncboard", "project-maskmyfeed"],
  "what projects have you built": ["project-contextframe", "project-portfolio-rag", "project-syncboard", "project-maskmyfeed"],
  "what are your skills": ["profile-skills"],
  "what skills do you have": ["profile-skills"],
  "what is your experience": ["profile-experience"],
  "where do you work": ["profile-experience"],
  "what is your education": ["profile-education-1", "profile-education-2"],
  "what certifications": ["certificate-1", "certificate-2", "certificate-3"],
  "what are your strengths": ["hr-qa-2"],
  "what are your weaknesses": ["hr-qa-3"],
  "why should we hire you": ["hr-qa-6"],
  "contact information": ["profile-contact"],
  "how to contact": ["profile-contact"],
};

function exactMatchBoost(query: string): RagDocument[] {
  const normalized = query.toLowerCase().trim();
  const matchedIds = ALWAYS_MATCH_QUERIES[normalized];
  if (!matchedIds) return [];
  return baseKnowledge.filter((doc) => matchedIds.includes(doc.id));
}

// ── Main retrieval ──
export async function retrieveContext(query: string) {
  // Step 0: Check for exact-match queries that must always return specific docs
  const exactMatches = exactMatchBoost(query);

  // Step 1: Try ChromaDB vector search
  let chromaDocs: RagDocument[] = [];
  try {
    chromaDocs = await retrieveFromChroma(query);
  } catch {
    chromaDocs = [];
  }

  // Step 2: Detect query intent
  const intents = detectIntent(query);
  const targetTypes = normalizeDocTypes(intents);

  // Step 3: If ChromaDB returned results, use them (they're semantically best)
  let docs: RagDocument[];
  if (chromaDocs.length > 0) {
    docs = chromaDocs;
  } else {
    // Step 4: Keyword-based fallback with scored ranking
    const scored = baseKnowledge
      .map((doc) => ({ doc, score: keywordScore(query, doc) }))
      .sort((a, b) => b.score - a.score);

    const topK = scored.slice(0, ragConfig.maxRetrievedDocs).map(({ doc }) => doc);

    // Step 5: Ensure category coverage — force-include best doc of each detected intent type
    docs = ensureCategoryCoverage(topK, intents, scored);

    // Step 6: If still no docs or only irrelevant ones, fall back to exact matches
    if (docs.length === 0 && exactMatches.length > 0) {
      docs = exactMatches;
    }
  }

  // Step 7: Merge exact-match docs if they're missing (belt + suspenders)
  if (exactMatches.length > 0) {
    const existingIds = new Set(docs.map((d) => d.id));
    for (const em of exactMatches) {
      if (!existingIds.has(em.id)) {
        docs.push(em);
        existingIds.add(em.id);
      }
    }
  }

  // Step 8: Absolute last resort — if somehow we still have nothing, return the profile summary
  if (docs.length === 0) {
    docs = baseKnowledge.filter((d) => d.id === "profile-summary" || d.id === "profile-about");
  }

  return {
    docs,
    context: docs
      .map((doc) => `Source: ${doc.metadata.title ?? doc.metadata.source}\n${doc.content}`)
      .join("\n\n"),
  };
}
