import { NextRequest, NextResponse } from "next/server";
import { ingestPortfolioKnowledge } from "@/lib/rag/ingest";
import { rateLimit } from "@/lib/rag/rate-limit";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const token = request.headers.get("x-admin-token");
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0] ?? "local";

  if (!rateLimit(`ingest:${ip}`, 3, 60_000)) {
    return NextResponse.json({ error: "Too many ingestion attempts." }, { status: 429 });
  }

  if (!process.env.RAG_INGEST_TOKEN || token !== process.env.RAG_INGEST_TOKEN) {
    return NextResponse.json({ error: "Unauthorized ingestion request." }, { status: 401 });
  }

  try {
    const result = await ingestPortfolioKnowledge();
    return NextResponse.json({
      ok: true,
      ...result,
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Ingestion failed.",
      },
      { status: 500 }
    );
  }
}
