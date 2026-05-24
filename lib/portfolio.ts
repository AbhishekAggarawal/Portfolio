export const projects = [
  {
slug: "contextframe",
num: "01",
category: "AI Video Intelligence Platform",
title: "ContextFrame",
description:
"An AI-powered video intelligence platform that extracts transcripts, generates summaries, and enables contextual Q&A through a lightweight BM25-based RAG engine.",
longDescription:
"Built ContextFrame, a full-stack AI video intelligence platform that makes video content searchable, summarizable, and interactive. Developed a FastAPI backend for transcript extraction, speech-to-text processing, and multilingual summarization, powered by a custom BM25-based RAG engine for contextual video Q&A without vector databases. Integrated LangChain, Mistral AI, and Sarvam AI for retrieval orchestration and language processing, while building a responsive React + TypeScript frontend with real-time tracking and multilingual support. Containerized and deployed the platform using Docker, Vercel, and Render.",
image: "/assets/work/contextframe.png",
live: "https://context-frame.vercel.app/",
github: "https://github.com/AbhishekAggarawal/ContextFrame",
stack: [

"LangChain",
"BM25",
"Mistral AI",
"Sarvam AI",
"Docker",
"Vercel",
"Render",
"FastAPI",
"React",
"TypeScript"
],
highlights: [
"Custom BM25-based RAG engine for contextual video Q&A without GPU-heavy vector databases",
"FastAPI backend orchestrating transcript extraction, speech-to-text, and summarization pipelines",
"Multilingual support with Sarvam AI for Indic-language speech processing and Mistral AI for generation",
"Real-time processing tracking and responsive chat UI built with React, TypeScript, and Tailwind CSS",
"Containerized deployment across Vercel (frontend) and Render (backend) with Docker",
],
},
  {
slug: "portfolio-rag",
num: "02",
category: "AI-Powered Portfolio & RAG Chatbot",
title: "PortfolioIQ",
description:
"A production-grade RAG-powered portfolio website with an intelligent conversational AI assistant that answers recruiter questions using vector search, LLM streaming, and curated professional knowledge.",
longDescription:
"Built an AI-powered portfolio website featuring a RAG chatbot that enables recruiters to explore my background through natural conversation. Implemented a multi-layered retrieval pipeline using ChromaDB with nomic-embed-text embeddings via Ollama, combined with keyword-based fallback search for reliability. Integrated Groq Cloud’s Llama 3.1 model with prompt-engineering guardrails, rate limiting, SSE token streaming, and real-time chat rendering. Developed the frontend with React, Framer Motion, and a custom chat hook, while deploying the production-ready stack on Vercel with Railway/Render-based MLOps infrastructure.",
image: "/assets/work/portfolio.png",
live: "https://portfolio-abhishek-aggarwal.vercel.app/",
github: "https://github.com/AbhishekAggarawal/Portfolio-main",
stack: [

"Groq Cloud",
"ChromaDB",
"Ollama",
"LangChain",
"Tailwind CSS",
"Framer Motion",
"Vercel",
"Render",
"Next.js",
"React",
"TypeScript"
],
highlights: [
"RAG pipeline with ChromaDB vector search (nomic-embed-text) + keyword fallback retrieval",
"Groq Cloud LLM streaming with custom SSE-to-text decoder and anti-hallucination guardrails",
"Per-IP rate limiting and professional question pre-filtering in the chat API endpoint",
"LangChain RecursiveCharacterTextSplitter with dynamic imports for safe ingestion without build failures",
"Real-time token-by-token streaming UI with Framer Motion, abort control, and markdown rendering",
],
},
  {
slug: "syncboard",
num: "03",
category: "Productivity & Collaboration Platform",
title: "SyncBoard",
description:
"An intelligent note-taking and organization platform designed for seamless content creation, management, and personalization.",
longDescription:
"SyncBoard is a modern collaborative workspace built to simplify note organization and productivity workflows through an intuitive and highly customizable interface. The platform combines rich interactive editing, secure authentication, and scalable serverless infrastructure to deliver a smooth and efficient user experience. It enables users to create, manage, and personalize notes effortlessly while maintaining high performance and accessibility across devices.",
image: "/assets/work/thumb3.png",
live: "https://sync-board-app.vercel.app/",
github: "https://github.com/AbhishekAggarawal/SyncBoard",
stack: [
"Next.js",
"Convex",
"EdgeStore",
"Clerk",
"BlockNote",
"Tailwind CSS",
"ShadCN"
],
highlights: [
"Rich interactive note-taking experience powered by BlockNote",
"Secure authentication and user management using Clerk",
"Serverless backend architecture with Convex and EdgeStore",
"Responsive and modern UI built with Tailwind CSS and ShadCN",
],
},
  {
slug: "maskmyfeed",
num: "04",
category: "Anonymous Feedback Platform",
title: "MaskMyFeed",
description:
"An AI-powered anonymous feedback platform designed to enable secure, honest, and privacy-focused communication.",
longDescription:
"MaskMyFeed is a modern anonymous feedback platform that allows users to share and receive candid feedback while preserving privacy and confidentiality. The platform combines secure authentication, AI-generated feedback suggestions, and intuitive feedback management into a seamless user experience. Built with scalable backend architecture and responsive frontend technologies, it delivers a smooth and secure environment for meaningful communication without compromising user identity.",
image: "/assets/work/thumb2.png",
live: "https://mask-my-feed.vercel.app/",
github: "https://github.com/AbhishekAggarawal/MaskMyFeed",
stack: [
"Next.js",
"Node.js",
"Express.js",
"MongoDB",
"Mongoose",
"NextAuth",
"OpenAI",
"Tailwind CSS",
"ShadCN",
"Zod"
],
highlights: [
"Anonymous and privacy-focused feedback submission system",
"AI-generated feedback suggestions powered by OpenAI",
"Secure authentication and password hashing using NextAuth and bcryptjs",
"Responsive modern UI built with Tailwind CSS and ShadCN components",
],
},
];

export type Project = (typeof projects)[number];
