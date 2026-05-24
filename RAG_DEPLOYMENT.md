# ☁️ RAG Chatbot — Cloud Deployment Guide

Follow this guide to deploy the portfolio chatbot so anyone on the internet can use it.

---

## Architecture Overview

```
User Browser → Vercel (Next.js) → Groq Cloud (LLM)
                     ↓
          Keyword Fallback Retrieval
          (53 baseKnowledge docs in app bundle)
```

There are **two deployment paths** — choose based on your budget and quality needs:

| | Path A: Free | Path B: Vector Search |
|---|---|---|
| **Cost** | $0/month | ~$7.02/month |
| **Retrieval** | Keyword + synonym + intent matching | OpenAI embeddings + ChromaDB vector search |
| **Quality** | Good (exact + semantic keyword) | Better (dense vector similarity) |
| **Services** | Vercel (Hobby) + Groq (free) | Vercel + Groq + Render (Starter $7/mo) + OpenAI |
| **Credit card needed?** | No | Yes (Render + OpenAI) |
| **Setup time** | 5 minutes | 20 minutes |

> **Path A works today** — no changes needed. When ChromaDB is unreachable, [`retrieveContext()`](lib/rag/retrieval.ts:256) automatically falls back to keyword search with synonym expansion, intent detection, exact-match boosting, and category coverage across all 53 `baseKnowledge` documents.

---

## Path A: Free Deployment (Recommended)

Only two services — both have free tiers with no credit card required.

### What You Get

The keyword fallback in [`retrieval.ts`](lib/rag/retrieval.ts) is not a "dumb" fallback — it uses:

| Step | Technique | What It Does |
|---|---|---|
| 1 | ChromaDB attempt | Tries vector search (skipped if no `CHROMA_URL`) |
| 2 | Exact-match boost | Checks if query literally matches any document content |
| 3 | Keyword scoring | Tokenizes query + documents, scores by word overlap |
| 4 | Synonym expansion | Maps common terms to document vocabulary (e.g., "projects" → also matches "work", "portfolio") |
| 5 | Intent detection | Maps query type to expected document categories |
| 6 | Category coverage | Ensures at least one doc per relevant type is included |

This handles virtually all portfolio-related questions (projects, skills, experience, education, contact, HR questions).

### Step 1: Get a Groq API Key (Free)

1. Go to [console.groq.com/keys](https://console.groq.com/keys)
2. Create a free account — no credit card needed
3. Copy your API key (starts with `gsk_`)

### Step 2: Set Up Gmail App Password (for Contact Form)

1. Enable [2-Step Verification](https://myaccount.google.com/signinoptions/twostepverification) on your Google Account
2. Go to [App Passwords](https://myaccount.google.com/apppasswords)
3. Select "Mail" → "Other" → name it "Portfolio"
4. Copy the 16-character password (no spaces)

### Step 3: Deploy on Vercel

1. Push your repo to GitHub
2. Go to [vercel.com](https://vercel.com) → "Import Project"
3. Framework: **Next.js** (auto-detected)
4. Add **only these 5 environment variables**:

| Variable | Value |
|---|---|
| `GROQ_API_KEY` | `gsk_your_key_from_step_1` |
| `GROQ_MODEL` | `llama-3.1-8b-instant` |
| `EMAIL_USER` | `your_email@gmail.com` |
| `EMAIL_PASSWORD` | `your_16_char_app_password` |
| `RECEIVER_EMAIL` | `your_email@gmail.com` |

5. Deploy. Vercel assigns a URL like `your-project.vercel.app`.

### Step 4: Verify

1. Open your Vercel URL
2. Click the chat assistant (bottom-right bubble)
3. Ask: *"What are Abhishek's projects?"*
4. You should see a streaming response with project details
5. Test the contact form — send yourself a test message

**Done!** Your portfolio with AI chatbot is live at $0/month.

---

## Path B: Vector Search (Better Quality, ~$7/mo)

Add ChromaDB + OpenAI embeddings for dense vector similarity search. This gives better results for vague or complex queries.

> **⚠️ Render free tier does NOT support persistent disks.** You need the **Starter plan ($7/mo)** for ChromaDB. See [Render pricing](https://render.com/pricing).

### Service Breakdown

| Component | Provider | Cost | 
|---|---|---|
| Frontend + API routes | **Vercel** (Hobby) | Free |
| LLM inference | **Groq Cloud** (`llama-3.1-8b-instant`) | Free |
| Embeddings | **OpenAI** (`text-embedding-3-small`) | ~$0.02/1M tokens |
| Vector DB | **Render** (Starter, $7/mo) | ChromaDB with 1GB disk |

### Step B1: Deploy ChromaDB on Render

> **Requires Starter plan ($7/mo).** Free tier will fail with "disks are not supported."

1. Go to [render.com](https://render.com) → "New" → "Blueprint"
2. Connect your GitHub repo
3. Render auto-detects [`render.yaml`](render.yaml) — it creates:
   - A **Web Service** running `chromadb/chroma:latest`
   - A **1 GB persistent disk** for your vectors
4. **Before deploying**, change `plan: free` to `plan: starter` in [`render.yaml`](render.yaml)
5. After deployment, copy the URL (e.g., `https://abhishek-chromadb.onrender.com`)

### Step B2: Get an OpenAI API Key

1. Go to [platform.openai.com/api-keys](https://platform.openai.com/api-keys)
2. Create an account (requires $5 minimum pre-payment)
3. Generate an API key (starts with `sk-`)

### Step B3: Ingest Data into ChromaDB

```cmd
set CHROMA_URL=https://abhishek-chromadb.onrender.com
set EMBEDDING_API_URL=https://api.openai.com/v1/embeddings
set EMBEDDING_API_KEY=sk-your_openai_key_here
set EMBEDDING_MODEL=text-embedding-3-small
npx tsx scripts/ingest-cloud.ts
```

### Step B4: Add These Extra Vercel Env Vars

On top of [Path A's 5 vars](#step-3-deploy-on-vercel-1), also add:

| Variable | Value |
|---|---|
| `CHROMA_URL` | `https://abhishek-chromadb.onrender.com` |
| `CHROMA_COLLECTION` | `abhishek_portfolio` |
| `EMBEDDING_API_URL` | `https://api.openai.com/v1/embeddings` |
| `EMBEDDING_API_KEY` | `sk-your_openai_key` |
| `EMBEDDING_MODEL` | `text-embedding-3-small` |
| `RAG_INGEST_TOKEN` | Random secret for `/api/ingest` |
| `RAG_TOP_K` | `5` |

### Step B5: Verify

Ask the chatbot a vague question like *"What does Abhishek do?"* — you should get richer, more contextually relevant answers than Path A.

---

## Troubleshooting

### "Groq request failed"
→ Verify `GROQ_API_KEY` starts with `gsk_`. Free tier has generous rate limits.

### "Not enough information to answer" (Path A)
→ The keyword fallback is working correctly — it means none of the 53 `baseKnowledge` docs matched your query well enough. Try rephrasing.

### "ChromaDB returns empty results" (Path B)
→ Run `npx tsx scripts/ingest-cloud.ts` again. Render free tier spins down after inactivity.

### "Cloud embedding failed (401)" (Path B)
→ Your `EMBEDDING_API_KEY` is wrong or has insufficient credits.

### Contact form not sending
→ Check that `EMAIL_PASSWORD` is a 16-char **App Password** (not your Gmail password). Gmail SMTP requires App Passwords when 2FA is enabled.

---

## Local Development

For local dev, use Ollama + local ChromaDB (no API keys needed):

```bash
# Terminal 1: ChromaDB
docker run -p 8000:8000 chromadb/chroma

# Terminal 2: Ollama embeddings
ollama pull nomic-embed-text

# Terminal 3: Next.js
npm run dev
```

The code auto-falls back to Ollama when `EMBEDDING_API_URL` is empty.

---

## Files at a Glance

| File | Role |
|---|---|
| [`lib/rag/retrieval.ts`](lib/rag/retrieval.ts) | Retrieval pipeline — ChromaDB vector search + keyword fallback |
| [`lib/rag/profile-data.ts`](lib/rag/profile-data.ts) | 53 base knowledge documents (the fallback data source) |
| [`lib/rag/groq.ts`](lib/rag/groq.ts) | Groq Cloud SSE streaming |
| [`lib/rag/http.ts`](lib/rag/http.ts) | HTTP client with AbortController timeouts |
| [`lib/rag/config.ts`](lib/rag/config.ts) | All env var defaults in one place |
| [`lib/rag/prompt.ts`](lib/rag/prompt.ts) | System prompt + RAG prompt builder |
| [`scripts/ingest-cloud.ts`](scripts/ingest-cloud.ts) | Ingestion script (reads live TS sources) |
| [`vercel.json`](vercel.json) | Vercel function configs + CORS |
| [`render.yaml`](render.yaml) | ChromaDB service definition for Render |
| [`.env.example`](.env.example) | All env vars with setup instructions |
