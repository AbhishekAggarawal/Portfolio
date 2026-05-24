# Portfolio RAG Assistant

This portfolio includes a production-oriented RAG chatbot UI and backend.

## Stack

- Frontend: Next.js, React, Tailwind CSS, Framer Motion
- Chat LLM: Groq Cloud, `llama-3.1-8b-instant`
- Embeddings: `nomic-embed-text` through Ollama
- Vector store: ChromaDB
- RAG helpers: LangChain text splitter is used when installed, with a safe fallback

## Environment

Copy `.env.example` to `.env.local`:

```bash
GROQ_API_KEY=your_groq_api_key
GROQ_MODEL=llama-3.1-8b-instant
CHROMA_URL=http://localhost:8000
CHROMA_COLLECTION=abhishek_portfolio
OLLAMA_BASE_URL=http://localhost:11434
EMBEDDING_MODEL=nomic-embed-text
RAG_INGEST_TOKEN=change_this_secret
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## Local ChromaDB

Install Docker Desktop first if `docker --version` is not available.

```bash
docker run -p 8000:8000 -v chroma-data:/chroma/chroma chromadb/chroma
```

## Local Embeddings

Install Ollama and pull the embedding model:

```bash
ollama pull nomic-embed-text
```

If `ollama --version` is not available, install Ollama first from https://ollama.com.

## Check RAG Services

After starting Next.js, ChromaDB, and Ollama:

```bash
npm run rag:check
```

Expected:

```txt
groq   true
chroma true
ollama true
```

## Install RAG Packages

The app uses guarded imports so the UI still compiles before services are configured. For full RAG ingestion, install:

```bash
npm install langchain chromadb
```

## Ingest Knowledge

Start the Next server, then run:

```bash
RAG_INGEST_TOKEN=change_this_secret node scripts/ingest-rag.mjs
```

The ingestion route loads the curated profile/project/skills/certificate knowledge from `lib/rag/profile-data.ts`, chunks it, embeds it with `nomic-embed-text`, and stores it in Chroma.

## Deployment

### Vercel Frontend

1. Push the repo to GitHub.
2. Import into Vercel.
3. Add `GROQ_API_KEY`, `GROQ_MODEL`, `CHROMA_URL`, `CHROMA_COLLECTION`, and `RAG_INGEST_TOKEN`.
4. Deploy.

### Railway/Render Backend Services

Run ChromaDB as a persistent service:

- Expose port `8000`
- Add persistent disk storage
- Set `CHROMA_URL` in Vercel to the public/private Chroma URL

Run Ollama or an embedding microservice that serves `nomic-embed-text`, then set `OLLAMA_BASE_URL`.

## Behavior

The assistant:

- Answers only professional questions about Abhishek
- Uses retrieved portfolio context first
- Politely redirects unrelated questions
- Streams responses from Groq
- Falls back to curated local knowledge if Chroma is not available
