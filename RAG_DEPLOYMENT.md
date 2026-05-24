# ☁️ RAG Chatbot — Cloud Deployment Guide

Follow this guide to deploy the RAG pipeline so anyone on the internet can use the portfolio chatbot.

---

## Architecture Overview

```
User Browser → Vercel (Next.js) → Groq Cloud (LLM)
                    ↓                    ↑
              ChromaDB Cloud     OpenAI Embeddings
              (Render/Railway)   (text-embedding-3-small)
```

| Component | Provider | Cost | 
|---|---|---|
| Frontend + API routes | **Vercel** (Hobby/Pro) | Free tier works |
| LLM inference | **Groq Cloud** (`llama-3.1-8b-instant`) | Free tier (generous limits) |
| Embeddings | **OpenAI** (`text-embedding-3-small`) | ~$0.02 per 1M tokens (ingest once, query cheap) |
| Vector DB | **Render** / **Railway** (ChromaDB) | Free tier (1 instance) |

---

## Step-by-Step Deployment

### Step 1: Deploy ChromaDB on Render (2 minutes)

[`render.yaml`](render.yaml) in this repo defines the service. 

1. Go to [render.com](https://render.com) → "New" → "Blueprint"
2. Connect your GitHub repo
3. Render auto-detects [`render.yaml`](render.yaml) — it will create:
   - A **Web Service** running `chromadb/chroma:latest`
   - A **1 GB persistent disk** for your vectors
4. After deployment, copy the **URL** (e.g., `https://abhishek-chromadb.onrender.com`)

> **Alternative: Railway** — Deploy `chromadb/chroma` Docker image, expose port 8000, add a persistent volume, and use the public URL.

### Step 2: Get API Keys

| Key | Where | 
|---|---|
| `GROQ_API_KEY` | [console.groq.com/keys](https://console.groq.com/keys) — create free account |
| `EMBEDDING_API_KEY` | [platform.openai.com/api-keys](https://platform.openai.com/api-keys) — create paid account ($5 minimum) |
| `RAG_INGEST_TOKEN` | Generate a random string: `node -e "console.log(require('crypto').randomBytes(24).toString('hex'))"` |

### Step 3: Ingest Data into Cloud ChromaDB

The ingestion script [`scripts/ingest-cloud.ts`](scripts/ingest-cloud.ts) **imports directly from [`lib/rag/profile-data.ts`](lib/rag/profile-data.ts) and [`lib/portfolio.ts`](lib/portfolio.ts)** — so it always uses your latest data. No hardcoded copies.

**Windows (cmd):**
```cmd
set CHROMA_URL=https://abhishek-chromadb.onrender.com
set EMBEDDING_API_URL=https://api.openai.com/v1/embeddings
set EMBEDDING_API_KEY=sk-your_openai_key_here
set EMBEDDING_MODEL=text-embedding-3-small
npx tsx scripts/ingest-cloud.ts
```

**Mac/Linux:**
```bash
export CHROMA_URL=https://abhishek-chromadb.onrender.com
export EMBEDDING_API_URL=https://api.openai.com/v1/embeddings
export EMBEDDING_API_KEY=sk-your_openai_key_here
export EMBEDDING_MODEL=text-embedding-3-small
npx tsx scripts/ingest-cloud.ts
```

Expected output:
```
🔗 ChromaDB:      https://abhishek-chromadb.onrender.com
📦 Collection:    abhishek_portfolio
🧠 Embeddings:    text-embedding-3-small (via https://api.openai.com/v1/embeddings)
📄 Source:        lib/rag/profile-data.ts (LIVE)
📄 Documents:     53

1/3  Creating/accessing collection...
   ✓ Collection ready

2/3  Generating embeddings (batches of 20)...
   ⏳ 20/53 documents embedded
   ⏳ 40/53 documents embedded
   ⏳ 53/53 documents embedded
   ✓ 53 embeddings generated

3/3  Upserting into ChromaDB...

✅ Successfully ingested 53 documents into "abhishek_portfolio"
   ChromaDB URL: https://abhishek-chromadb.onrender.com
   💡 Tip: Re-run this script whenever you update profile-data.ts or portfolio.ts
```

> **The script reads live TypeScript sources.** Update [`lib/portfolio.ts`](lib/portfolio.ts) or [`lib/rag/profile-data.ts`](lib/rag/profile-data.ts) anytime — just re-run `npx tsx scripts/ingest-cloud.ts` to sync ChromaDB.

### Step 4: Deploy Frontend on Vercel

1. Push your repo to GitHub
2. Go to [vercel.com](https://vercel.com) → Import project
3. Framework: **Next.js** (auto-detected)
4. Add Environment Variables:

| Variable | Value |
|---|---|
| `GROQ_API_KEY` | `gsk_your_key` |
| `GROQ_MODEL` | `llama-3.1-8b-instant` |
| `EMBEDDING_API_URL` | `https://api.openai.com/v1/embeddings` |
| `EMBEDDING_API_KEY` | `sk-your_key` |
| `EMBEDDING_MODEL` | `text-embedding-3-small` |
| `CHROMA_URL` | `https://abhishek-chromadb.onrender.com` |
| `CHROMA_COLLECTION` | `abhishek_portfolio` |
| `RAG_INGEST_TOKEN` | `your_random_secret` |
| `RAG_TOP_K` | `5` |
| `EMAIL_USER` | `your_email@gmail.com` |
| `EMAIL_PASSWORD` | `16_char_app_password` |
| `RECEIVER_EMAIL` | `your_email@gmail.com` |

5. Deploy. Vercel assigns a URL like `your-project.vercel.app`.

### Step 5: Verify

1. Open your Vercel URL
2. Click the chat assistant
3. Ask: *"What are Abhishek's projects?"*
4. You should see a streaming response with project details

---

## What Changed for Cloud

| File | Change |
|---|---|
| [`lib/rag/config.ts`](lib/rag/config.ts) | Added `EMBEDDING_PROVIDER`, default model changed to `text-embedding-3-small` |
| [`lib/rag/http.ts`](lib/rag/http.ts) | OpenAI auto-detection: sends `input` + `encoding_format: float` for OpenAI, `prompt` for Ollama-compatible |
| [`.env.example`](.env.example) | Documented all cloud variables with clear comments |
| [`render.yaml`](render.yaml) | **New** — one-click ChromaDB deployment on Render |
| [`scripts/ingest-cloud.ts`](scripts/ingest-cloud.ts) | **New** — ingestion script that imports live TypeScript sources directly, no hardcoded copies. Always in sync with [`profile-data.ts`](lib/rag/profile-data.ts) and [`portfolio.ts`](lib/portfolio.ts) |

### Keeping ChromaDB in Sync

The ingestion script reads **live** data. When you update:

- [`lib/portfolio.ts`](lib/portfolio.ts) — add/modify projects
- [`lib/rag/profile-data.ts`](lib/rag/profile-data.ts) — update skills, experience, HR Q&A

Just re-run:

```bash
npx tsx scripts/ingest-cloud.ts
```

This re-generates embeddings from the latest sources and upserts them into your cloud ChromaDB. The old [`scripts/ingest-cloud.mjs`](scripts/ingest-cloud.mjs) was a hardcoded snapshot (now superseded). **Always use `ingest-cloud.ts`** to guarantee the vector DB matches your source files.

### Files That Required Zero Changes

- [`lib/rag/retrieval.ts`](lib/rag/retrieval.ts) — already fetches from `ragConfig.chromaUrl`
- [`lib/rag/ingest.ts`](lib/rag/ingest.ts) — already calls `createEmbedding()` and ChromaDB API
- [`lib/rag/profile-data.ts`](lib/rag/profile-data.ts) — data source, unchanged
- [`lib/rag/prompt.ts`](lib/rag/prompt.ts) — prompt template, unchanged
- [`lib/rag/groq.ts`](lib/rag/groq.ts) — already uses Groq Cloud API
- [`app/api/chat/route.ts`](app/api/chat/route.ts) — already orchestrates retrieval + LLM

---

## Cost Estimate (Monthly)

| Service | Estimate |
|---|---|
| Vercel | $0 (Hobby) |
| Groq Cloud | $0 (free tier) |
| OpenAI Embeddings | ~$0.01 (ingested once + query embeddings) |
| Render (ChromaDB) | $0 (free tier, spins down when idle) |
| **Total** | **~$0.01/month** |

---

## Troubleshooting

### "Cloud embedding failed (401)"
→ Your `EMBEDDING_API_KEY` is wrong or has insufficient credits. Check [platform.openai.com/usage](https://platform.openai.com/usage).

### "ChromaDB returns empty results"
→ Run `npx tsx scripts/ingest-cloud.ts` again. The Render free tier spins down after inactivity — first query may be slow.

### "Groq request failed"
→ Verify `GROQ_API_KEY` starts with `gsk_`.

### Chatbot says "not enough information"
→ The retrieval pipeline has a keyword fallback built into [`retrieval.ts`](lib/rag/retrieval.ts:264) — it doesn't strictly depend on ChromaDB. If you see this message, check that `baseKnowledge` is accessible in the Vercel runtime.

---

## Local Development (Unchanged)

For local dev, you can still use Ollama + local ChromaDB:

```bash
# Terminal 1: ChromaDB
docker run -p 8000:8000 chromadb/chroma

# Terminal 2: Ollama
ollama pull nomic-embed-text

# Terminal 3: Next.js
npm run dev
```

The code auto-falls back to Ollama when `EMBEDDING_API_URL` is empty. No config changes needed to switch between local and cloud.
