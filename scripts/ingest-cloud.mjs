// ── Cloud Ingestion Script (standalone .mjs — no TypeScript needed) ────────
// Run: node scripts/ingest-cloud.mjs
//
// Auto-detects vector store (Qdrant or ChromaDB) and embedding provider
// (Gemini or OpenAI) from environment variables.
//
// Prerequisites (env vars):
//
//   PATH C — Qdrant Cloud + Gemini ($0/mo, production-grade):
//     QDRANT_URL          https://xyz-example.eu-central.aws.cloud.qdrant.io
//     QDRANT_API_KEY      your-qdrant-api-key
//     QDRANT_COLLECTION   abhishek_portfolio (default)
//     EMBEDDING_API_KEY   your-gemini-api-key (from https://aistudio.google.com/apikey)
//     EMBEDDING_PROVIDER  gemini
//     EMBEDDING_MODEL     gemini-embedding-001 (default for Gemini, 3072-dim)
//
//   PATH B — ChromaDB + OpenAI (~$7/mo):
//     CHROMA_URL          https://your-chromadb.onrender.com
//     CHROMA_TOKEN        (only if your Chroma instance has auth)
//     CHROMA_COLLECTION   abhishek_portfolio (default)
//     EMBEDDING_API_URL   https://api.openai.com/v1/embeddings
//     EMBEDDING_API_KEY   sk-your_openai_key
//     EMBEDDING_MODEL     text-embedding-3-small
//
// This script contains a bundled copy of profile data so it runs standalone
// without importing TypeScript modules or lib/rag/profile-data.ts.
// =============================================================================

// ── Vector store detection ──────────────────────────────────────────────────
const VECTOR_STORE = process.env.VECTOR_STORE ?? "chroma";
const QDRANT_URL = process.env.QDRANT_URL ?? "";
const QDRANT_API_KEY = process.env.QDRANT_API_KEY ?? "";
const QDRANT_COLLECTION = process.env.QDRANT_COLLECTION ?? "abhishek_portfolio";

const CHROMA_URL = process.env.CHROMA_URL || "http://localhost:8000";
const CHROMA_TOKEN = process.env.CHROMA_TOKEN || "";
const CHROMA_COLLECTION = process.env.CHROMA_COLLECTION || "abhishek_portfolio";

const useQdrant = Boolean(QDRANT_URL && QDRANT_API_KEY) || VECTOR_STORE === "qdrant";

// ── Embedding provider detection ────────────────────────────────────────────
const EMBEDDING_API_URL =
  process.env.EMBEDDING_API_URL || "https://api.openai.com/v1/embeddings";
const EMBEDDING_API_KEY = process.env.EMBEDDING_API_KEY || "";
const EMBEDDING_PROVIDER = process.env.EMBEDDING_PROVIDER ?? "auto";

const useGemini =
  EMBEDDING_PROVIDER === "gemini" ||
  (EMBEDDING_PROVIDER === "auto" &&
    EMBEDDING_API_KEY &&
    !EMBEDDING_API_URL.includes("openai"));

const EMBEDDING_MODEL = useGemini
  ? (process.env.EMBEDDING_MODEL || "gemini-embedding-001")
  : (process.env.EMBEDDING_MODEL || "text-embedding-3-small");

// ── Validate ────────────────────────────────────────────────────────────────
if (!EMBEDDING_API_KEY) {
  console.error("❌ EMBEDDING_API_KEY is required. Set it in your environment.");
  console.error("   For Gemini (free): https://aistudio.google.com/apikey");
  console.error("   For OpenAI:        https://platform.openai.com/api-keys");
  process.exit(1);
}

if (!useQdrant && CHROMA_URL === "http://localhost:8000") {
  console.warn("⚠️  CHROMA_URL is localhost. For cloud, set CHROMA_URL to your Render/Railway URL.");
}

if (useQdrant && !QDRANT_URL) {
  console.error("❌ QDRANT_URL is required when using Qdrant.");
  process.exit(1);
}

// ── Profile data (bundled copy — mirrors lib/rag/profile-data.ts) ────────
const skills = [
  "Python", "SQL", "C++", "JavaScript", "TypeScript",
  "Machine Learning", "Deep Learning", "Generative AI", "LLMs", "NLP",
  "RAG", "TensorFlow", "Scikit-learn", "Data Engineering", "ETL Pipelines",
  "Apache Spark", "PySpark", "Pandas", "NumPy", "Apache Kafka",
  "Airflow", "Databricks", "Snowflake", "AWS", "Docker",
  "Jenkins", "Power BI", "FastAPI", "React", "Next.js",
  "Node.js", "LangChain", "Tailwind CSS", "PostgreSQL", "MongoDB",
  "ChromaDB", "Git", "BM25", "Mistral AI", "Sarvam AI", "Groq Cloud",
];

const certificates = [
  "Completed an intensive Computer Networking course covering protocols, routing, switching, and modern distributed communication systems.",
  "Google Cloud Data Engineering certificate covering scalable data pipelines, cloud storage, and managed analytics services.",
  "Python for Data Science certificate covering data analysis, visualization, and scripting for analytics workflows.",
];

const projects = [
  {
    slug: "contextframe", title: "ContextFrame", category: "AI Video Intelligence Platform",
    longDescription: "Built ContextFrame, a full-stack AI video intelligence platform that makes video content searchable, summarizable, and interactive. Developed a FastAPI backend for transcript extraction, speech-to-text processing, and multilingual summarization, powered by a custom BM25-based RAG engine for contextual video Q&A without vector databases. Integrated LangChain, Mistral AI, and Sarvam AI for retrieval orchestration and language processing, while building a responsive React + TypeScript frontend with real-time tracking and multilingual support. Containerized and deployed the platform using Docker, Vercel, and Render.",
    stack: ["LangChain", "BM25", "Mistral AI", "Sarvam AI", "Docker", "Vercel", "Render", "FastAPI", "React", "TypeScript"],
    highlights: ["Custom BM25-based RAG engine for contextual video Q&A without GPU-heavy vector databases", "FastAPI backend orchestrating transcript extraction, speech-to-text, and summarization pipelines", "Multilingual support with Sarvam AI for Indic-language speech processing and Mistral AI for generation", "Real-time processing tracking and responsive chat UI built with React, TypeScript, and Tailwind CSS", "Containerized deployment across Vercel (frontend) and Render (backend) with Docker"],
  },
  {
    slug: "portfolio-rag", title: "PortfolioIQ", category: "AI-Powered Portfolio & RAG Chatbot",
    longDescription: "Built PortfolioIQ, this very website — an AI-powered portfolio with an integrated RAG chatbot that answers recruiter and client questions about Abhishek's professional background. The chatbot uses ChromaDB for vector storage, Groq for LLM inference (Llama 3.1 8B), and a custom retrieval pipeline with keyword + semantic hybrid search. Built the full-stack Next.js application with streaming chat responses, rate limiting, and a curated knowledge base covering projects, skills, experience, education, and HR interview Q&A.",
    stack: ["Next.js", "TypeScript", "React", "Tailwind CSS", "Groq Cloud", "ChromaDB", "LangChain", "OpenAI Embeddings", "Framer Motion"],
    highlights: ["Hybrid retrieval combining semantic vector search (ChromaDB) with keyword scoring and synonym expansion", "Streaming LLM responses from Groq Cloud with SSE-to-text decoding", "Curated knowledge base with 50+ documents including HR interview Q&A, projects, skills, and experience", "Rate-limited API with professional intent detection to filter non-relevant queries", "Auto-ingestion pipeline that chunks, embeds, and upserts documents into ChromaDB"],
  },
  {
    slug: "syncboard", title: "SyncBoard", category: "Productivity & Collaboration Platform",
    longDescription: "Developed SyncBoard, a real-time productivity and collaboration platform combining task management, team chat, and shared workspaces. Built with Next.js and Socket.io for real-time updates, featuring drag-and-drop Kanban boards, threaded discussions, and file sharing. Implemented role-based access control and real-time notifications.",
    stack: ["Next.js", "TypeScript", "Socket.io", "PostgreSQL", "Prisma", "Tailwind CSS", "React"],
    highlights: ["Real-time collaboration with Socket.io WebSocket integration", "Drag-and-drop Kanban board with optimistic UI updates", "Role-based access control and team workspace management", "Threaded discussions with real-time typing indicators", "PostgreSQL with Prisma ORM for type-safe database operations"],
  },
  {
    slug: "maskmyfeed", title: "MaskMyFeed", category: "Anonymous Feedback Platform",
    longDescription: "Created MaskMyFeed, an anonymous feedback platform enabling users to create public profiles and receive honest, anonymous messages. Built with Next.js and MongoDB, featuring AI-powered sentiment analysis on feedback, shareable profile links, and real-time message notifications.",
    stack: ["Next.js", "TypeScript", "MongoDB", "Mongoose", "Tailwind CSS", "React", "OpenAI API"],
    highlights: ["AI-powered sentiment analysis on anonymous feedback messages", "Shareable public profiles with unique URLs for feedback collection", "Real-time message notifications with MongoDB change streams", "Rate limiting and spam detection for anonymous submissions", "Responsive UI with dark mode support"],
  },
];

const baseKnowledge = [
  // ── Contact ──
  {
    id: "profile-contact",
    content: "Abhishek Aggarwal is based in Ranchi, Jharkhand, India 834001. Phone: +91 8789830967. Email: abhishekmonu2000@gmail.com. LinkedIn: linkedin.com/in/abhishek-aggarwal. GitHub: github.com/AbhishekAggarawal. Portfolio: abhishek-aggarwal.vercel.app.",
    metadata: { source: "portfolio-contact", type: "profile", title: "Contact Information" },
  },
  // ── Summary ──
  {
    id: "profile-summary",
    content: "Abhishek Aggarwal is an AI and Data Engineer experienced in building ETL pipelines, RAG systems, and AI-powered full-stack applications using Python, SQL, FastAPI, React, Spark, and modern LLM frameworks. He combines strong data engineering foundations with practical AI/ML expertise to deliver production-ready systems.",
    metadata: { source: "portfolio-summary", type: "profile", title: "Professional Summary" },
  },
  // ── About ──
  {
    id: "profile-about",
    content: "Abhishek Aggarwal is an AI and data-focused software engineer. He builds intelligent web apps, data products, automation systems, clean frontends, Python backends, data pipelines, model workflows, and cloud-ready systems. He currently works as a Data Engineer at Axis Bank, building and optimizing large-scale ETL/ELT pipelines.",
    metadata: { source: "portfolio-about", type: "profile", title: "About Abhishek" },
  },
  // ── Positioning ──
  {
    id: "profile-positioning",
    content: "Abhishek positions himself for AI Engineer, Machine Learning Engineer, Data Scientist, MLOps Engineer, Data Engineer, and full-stack AI roles. He is strongest at combining AI/ML systems with practical software engineering and data engineering, delivering recruiter-friendly product execution.",
    metadata: { source: "portfolio-hero", type: "profile", title: "Professional positioning" },
  },
  // ── Experience ──
  {
    id: "profile-experience",
    content: "Data Engineer at Axis Bank (July 2025 – Present). Abhishek builds and optimizes ETL/ELT pipelines for large-scale banking datasets using Python, SQL, Spark, and PySpark. He improved Spark and SQL job performance by 15–25% through query optimization, partitioning, and efficient storage strategies. He automated data validation workflows, reducing manual validation efforts by 30–40%. He developed analytical datasets and reporting layers, reducing reporting preparation time by 25–40%.",
    metadata: { source: "portfolio-experience", type: "experience", title: "Work Experience" },
  },
  // ── Education ──
  {
    id: "profile-education-1",
    content: "National Institute of Technology Calicut (NITC), 2021 – 2025. Bachelor of Technology (B.Tech) with a CGPA of 8.48 out of 10.",
    metadata: { source: "portfolio-education", type: "education", title: "Education — NIT Calicut" },
  },
  {
    id: "profile-education-2",
    content: "Lord Buddha Public School, Kota, 2019 – 2020. Completed 12th Board with 82.2%.",
    metadata: { source: "portfolio-education", type: "education", title: "Education — 12th Board" },
  },
  // ── Achievements ──
  {
    id: "profile-achievements",
    content: "Abhishek has solved 450+ DSA problems across LeetCode, GeeksforGeeks, and CodingStudio. He contributed to Google Developer Student Club (GDSC) and organized large-scale college fests including Tathva and Ragam. He is active in public speaking and streetplay teams. He has built and deployed multiple AI-powered full-stack applications integrating LLMs, RAG pipelines, and cloud infrastructure.",
    metadata: { source: "portfolio-achievements", type: "achievement", title: "Achievements & Activities" },
  },
  // ── Skills ──
  {
    id: "profile-skills",
    content: `Abhishek works with these technologies and skills: ${skills.join(", ")}. His core strengths are in Python, SQL, data engineering, ETL pipelines, Spark, PySpark, FastAPI, React, Next.js, and LLM/RAG frameworks like LangChain. He is also proficient in cloud platforms (AWS), containerization (Docker), CI/CD (Jenkins), and databases (PostgreSQL, MongoDB, ChromaDB).`,
    metadata: { source: "portfolio-skills", type: "skill", title: "Skills" },
  },
  // ── Index docs ──
  {
    id: "index-projects-overview",
    content: "Abhishek has built 4 major projects: ContextFrame (AI Video Intelligence Platform), PortfolioIQ (AI-Powered Portfolio & RAG Chatbot), SyncBoard (Productivity & Collaboration Platform), and MaskMyFeed (Anonymous Feedback Platform). His projects span AI/ML, full-stack web development, RAG systems, and real-time applications. Projects are detailed individually below.",
    metadata: { source: "portfolio-index", type: "profile", title: "Projects Overview (index)" },
  },
  {
    id: "index-skills-overview",
    content: `Abhishek's skills span 40+ technologies including: ${skills.join(", ")}. His strongest areas are Python, SQL, data engineering, ETL pipelines, Spark, PySpark, FastAPI, React, Next.js, LLM/RAG frameworks (LangChain), cloud platforms (AWS), Docker, and databases (PostgreSQL, MongoDB, ChromaDB).`,
    metadata: { source: "portfolio-index", type: "profile", title: "Skills Overview (index)" },
  },
  {
    id: "index-experience-overview",
    content: "Abhishek works as a Data Engineer at Axis Bank (July 2025 – Present). He builds and optimizes ETL/ELT pipelines for large-scale banking datasets. His key achievements include 15-25% Spark/SQL performance improvement and 30-40% manual validation automation.",
    metadata: { source: "portfolio-index", type: "profile", title: "Experience Overview (index)" },
  },
  {
    id: "index-education-overview",
    content: "Abhishek holds a B.Tech from NIT Calicut (2021-2025) with a CGPA of 8.48. He completed 12th from Lord Buddha Public School, Kota with 82.2%.",
    metadata: { source: "portfolio-index", type: "profile", title: "Education Overview (index)" },
  },
  {
    id: "index-certificates-overview",
    content: "Abhishek holds 3 certificates: Computer Networking (intensive course), Google Cloud Data Engineering, and Python for Data Science.",
    metadata: { source: "portfolio-index", type: "profile", title: "Certificates Overview (index)" },
  },
  {
    id: "index-achievements-overview",
    content: "Abhishek has solved 450+ DSA problems, contributed to GDSC, organized college fests (Tathva, Ragam), and built multiple AI-powered full-stack apps.",
    metadata: { source: "portfolio-index", type: "profile", title: "Achievements Overview (index)" },
  },
  {
    id: "index-contact-overview",
    content: "Contact Abhishek at abhishekmonu2000@gmail.com, +91 8789830967, linkedin.com/in/abhishek-aggarwal, github.com/AbhishekAggarawal. Based in Ranchi, Jharkhand, India.",
    metadata: { source: "portfolio-index", type: "profile", title: "Contact Overview (index)" },
  },
  {
    id: "index-hr-overview",
    content: "Abhishek's HR interview preparation covers: strengths, weaknesses, why hire him, 5-year vision, handling pressure, teamwork approach, motivation, taking initiative, relocation willingness, salary expectations, and questions to ask interviewers. HR interview Q&A answers his strengths weaknesses why hire him salary expectations relocation teamwork motivation initiative challenges pressure deadlines staying updated with technology.",
    metadata: { source: "portfolio-index", type: "profile", title: "HR Q&A Overview (index)" },
  },
  // ── Projects ──
  ...projects.map((p) => ({
    id: `project-${p.slug}`,
    content: `${p.title}: ${p.longDescription} Stack: ${p.stack.join(", ")}. Highlights: ${p.highlights.join(" ")}`,
    metadata: { source: `portfolio-project-${p.slug}`, type: "project", title: `Project: ${p.title} (${p.category})` },
  })),
  // ── Certificates ──
  ...certificates.map((cert, i) => ({
    id: `certificate-${i + 1}`,
    content: cert,
    metadata: { source: `portfolio-certificate-${i + 1}`, type: "certificate", title: `Certificate ${i + 1}` },
  })),
  // ── HR Q&A ──
  {
    id: "hr-qa-1",
    content: 'Q: "Tell me about yourself." / "Walk me through your resume."\nA: "I\'m Abhishek Aggarwal, an AI and Data Engineer currently working at Axis Bank where I build and optimize large-scale ETL/ELT pipelines using Python, SQL, Spark, and PySpark. I hold a B.Tech from NIT Calicut with a CGPA of 8.48. My core expertise sits at the intersection of data engineering and AI — I design production-grade pipelines, build RAG-powered applications using LangChain and LLMs, and develop full-stack AI solutions with FastAPI, React, and Next.js. I\'ve solved 450+ DSA problems, contributed to GDSC, and organized large-scale college fests. I\'m passionate about turning raw data into intelligent, scalable systems that drive real business impact."',
    metadata: { source: "hr-qa", type: "profile", title: "Tell me about yourself" },
  },
  {
    id: "hr-qa-2",
    content: 'Q: "What are your greatest strengths?"\nA: "My top strengths are:\n1. Full-stack AI ownership — I can independently take an AI project from data ingestion and pipeline design all the way to a deployed web application with a clean UI. My portfolio includes multiple end-to-end AI apps built with FastAPI, LangChain, Next.js, and cloud infrastructure.\n2. Data engineering rigor — At Axis Bank, I optimized Spark and SQL jobs by 15–25% through query tuning, partitioning, and storage optimization. I also automated validation workflows that cut manual effort by 30–40%.\n3. Problem-solving mindset — With 450+ DSA problems solved and a habit of building real-world projects, I approach challenges methodically. I focus on root causes rather than quick fixes.\n4. Adaptability — I move comfortably between Python backends, Spark pipelines, LLM orchestration, and React frontends. I learn new tools quickly — most recently picking up Databricks and Snowflake on the job.\n5. Communication and collaboration — My experience organizing college fests (Tathva, Ragam) and participating in public speaking and streetplay teams has made me effective at cross-functional communication."',
    metadata: { source: "hr-qa", type: "profile", title: "Strengths" },
  },
  {
    id: "hr-qa-3",
    content: 'Q: "What are your weaknesses or areas for improvement?"\nA: "I\'m honest about areas I\'m working on:\n1. Over-engineering early — I sometimes jump into building scalable solutions before fully validating the simplest approach. I\'m learning to prototype quickly, validate assumptions, and then scale. I now deliberately start with minimal viable pipelines before adding complexity.\n2. Delegation — Being passionate about quality, I used to try owning too many pieces myself. In team settings, I\'ve learned to trust teammates, communicate clearly, and focus my energy where it creates the most leverage.\n3. Depth in cloud DevOps — While I\'m comfortable with Docker, AWS basics, and CI/CD (Jenkins), I want to go deeper into Kubernetes, Terraform, and infrastructure-as-code. I\'m actively learning these through hands-on projects.\nNone of these are permanent gaps — I treat them as growth areas and track my progress deliberately."',
    metadata: { source: "hr-qa", type: "profile", title: "Weaknesses" },
  },
  {
    id: "hr-qa-4",
    content: 'Q: "Why do you want to work here? / Why this role?"\nA: "I\'m drawn to roles where I can bridge data engineering and AI to build impactful products. I\'m looking for an environment that values ownership, technical depth, and real-world problem solving — where my skills in Python, Spark, LLM frameworks, and full-stack development can drive measurable outcomes. I want to work alongside strong engineers from whom I can learn while contributing my data pipeline expertise and AI product-building experience. I\'m particularly excited about teams building scalable AI-native products or data-intensive platforms where my combination of engineering rigor and AI fluency would be most valuable."',
    metadata: { source: "hr-qa", type: "profile", title: "Why this role" },
  },
  {
    id: "hr-qa-5",
    content: 'Q: "Where do you see yourself in 5 years?"\nA: "In five years, I see myself as a Senior AI/Data Engineer or ML Engineer who architects end-to-end intelligent systems at scale. I want to grow from building individual pipelines and models to designing platform-level data and ML infrastructure. I plan to deepen my expertise in distributed systems, MLOps, and LLM orchestration while mentoring junior engineers. I also want to be in a position where I\'m making architectural decisions that shape how an organization leverages its data and AI capabilities. Ultimately, I want to be known as someone who delivers production-grade AI systems that create measurable business value."',
    metadata: { source: "hr-qa", type: "profile", title: "5-year vision" },
  },
  {
    id: "hr-qa-6",
    content: 'Q: "Why should we hire you?"\nA: "You should hire me because I bring a rare combination: strong data engineering fundamentals paired with practical AI/ML execution skills. At Axis Bank, I\'ve already delivered production improvements — 15–25% Spark/SQL performance gains and 30–40% automation of manual workflows. Beyond that, I\'ve built and deployed multiple full-stack AI applications integrating LLMs, RAG, and cloud infrastructure — proving I can take an idea from concept to deployed product. I write clean, maintainable code across the stack (Python, TypeScript, SQL), I\'m comfortable with ambiguity, and I have a track record of learning fast and delivering results. I\'m not just looking for a job — I\'m looking to build impactful systems and grow with the team."',
    metadata: { source: "hr-qa", type: "profile", title: "Why hire Abhishek" },
  },
  {
    id: "hr-qa-7",
    content: 'Q: "Tell me about a challenging situation and how you handled it."\nA: "During my data engineering work at Axis Bank, I encountered legacy Spark jobs that were running significantly slower than required for downstream reporting SLAs. The challenge was that these jobs processed massive banking datasets with complex join logic, and the existing partitioning strategy was suboptimal. I systematically profiled query execution plans, identified expensive shuffle operations, redesigned the partitioning scheme on frequently joined keys, and optimized broadcast joins where appropriate. I also restructured the storage format and added incremental processing to avoid full-table scans. The result was a 15–25% performance improvement and more predictable runtimes. This taught me the value of data-driven diagnosis over guesswork, and the importance of understanding the full data lifecycle — not just the code."',
    metadata: { source: "hr-qa", type: "profile", title: "Challenge overcome" },
  },
  {
    id: "hr-qa-8",
    content: 'Q: "How do you handle tight deadlines or high-pressure situations?"\nA: "I handle pressure by prioritizing ruthlessly and communicating proactively. When facing tight deadlines, I break the work into the smallest deliverable pieces, identify the critical path, and focus on what moves the needle most. At Axis Bank, when reporting deadlines demanded faster pipeline execution, I prioritized optimizing the bottleneck jobs first, communicated realistic timelines to stakeholders, and delivered incremental improvements rather than waiting for a perfect solution. I also set clear boundaries — I\'ll put in extra effort when needed, but I believe sustainable productivity comes from good planning, not burnout. I\'ve found that early communication about risks or blockers prevents most last-minute crises."',
    metadata: { source: "hr-qa", type: "profile", title: "Handling pressure" },
  },
  {
    id: "hr-qa-9",
    content: 'Q: "What motivates you at work?"\nA: "Three things drive me:\n1. Building things that work — There\'s a deep satisfaction in seeing a pipeline run efficiently, a model serve accurate predictions, or a user interact with an AI feature I built. Tangible impact motivates me more than abstract credit.\n2. Continuous learning — The AI and data space evolves fast. I\'m genuinely excited about new developments in LLMs, vector databases, and data infrastructure. I spend time outside work building projects with new tools because I enjoy the learning process itself.\n3. Team wins — I loved the collaborative energy of organizing college fests and contributing to GDSC. In a professional context, nothing beats the feeling of shipping something meaningful together. I\'m motivated when my work enables others to succeed."',
    metadata: { source: "hr-qa", type: "profile", title: "Motivation" },
  },
  {
    id: "hr-qa-10",
    content: 'Q: "How do you approach teamwork and collaboration?"\nA: "I believe great engineering is a team sport. I approach collaboration with clear communication, reliability, and respect for others\' expertise. In my GDSC and college fest organizing experience, I learned that the best outcomes come from aligning on goals early, dividing responsibilities clearly, and maintaining open feedback loops. I\'m comfortable giving and receiving constructive feedback — I see code reviews and design discussions as learning opportunities, not critiques. I\'m also mindful of asynchronous communication; I document my work well so teammates can unblock themselves. When disagreements arise, I focus on what\'s best for the project, not on being right. I thrive in teams where people challenge each other intellectually but support each other unconditionally."',
    metadata: { source: "hr-qa", type: "profile", title: "Teamwork approach" },
  },
  {
    id: "hr-qa-11",
    content: 'Q: "What is your expected salary? / What are your compensation expectations?"\nA: "I\'m focused on finding the right role with growth potential and impactful work. I\'m open to discussing compensation that reflects my skills, experience, and the value I bring — and I trust that a fair offer will align with industry standards for my profile as an AI/Data Engineer with production experience at a major bank, full-stack AI project delivery, and a strong academic background from NIT Calicut."',
    metadata: { source: "hr-qa", type: "profile", title: "Salary expectations" },
  },
  {
    id: "hr-qa-12",
    content: 'Q: "Are you willing to relocate? / What is your location preference?"\nA: "Yes, I\'m open to relocating for the right opportunity. I\'m currently based in Ranchi, Jharkhand, but I\'m flexible about location — whether it\'s Bangalore, Hyderabad, Mumbai, Gurgaon, Pune, or any other tech hub in India. I prioritize the role, the team, and the growth opportunity over the specific city. I can also work in hybrid or remote setups depending on the team\'s needs."',
    metadata: { source: "hr-qa", type: "profile", title: "Relocation stance" },
  },
  {
    id: "hr-qa-13",
    content: 'Q: "Do you have any questions for us?"\nA: "Yes, I typically ask:\n1. \'What does success look like in the first 3–6 months for someone in this role?\' — This shows I\'m focused on delivering value quickly.\n2. \'How does the team handle technical decisions and architecture discussions?\' — This helps me understand ownership and autonomy levels.\n3. \'What are the biggest technical challenges the team is solving right now?\' — This shows genuine interest in the work.\n4. \'How does the organization support learning and growth — conferences, courses, internal knowledge sharing?\' — This reflects my growth mindset.\n5. \'What is the team composition and how does this role interact with other functions (product, data science, platform)?\' — This shows I think about cross-functional impact."',
    metadata: { source: "hr-qa", type: "profile", title: "Questions for interviewer" },
  },
  {
    id: "hr-qa-14",
    content: 'Q: "Describe a time you took initiative or went beyond your assigned responsibilities."\nA: "At Axis Bank, I noticed that manual data validation was consuming significant engineering time each week. Although my core responsibility was ETL pipeline development, I took the initiative to design and implement automated validation workflows using Python scripts integrated into the existing pipeline orchestration. This wasn\'t in my sprint — I built a prototype first, demonstrated the time savings to my lead, and then productionized it. The result was a 30–40% reduction in manual validation effort. Beyond work, I\'ve built and deployed multiple full-stack AI applications entirely on my own initiative — including this RAG-powered portfolio assistant — because I believe the best way to master technology is to build real products with it."',
    metadata: { source: "hr-qa", type: "profile", title: "Taking initiative" },
  },
  {
    id: "hr-qa-15",
    content: 'Q: "How do you stay updated with technology trends?"\nA: "I stay current through multiple channels: I follow AI/ML research on arXiv and Hugging Face, read engineering blogs from companies like Netflix, Meta, and Databricks, and actively build side projects with emerging tools. I\'m hands-on with new frameworks — I learned LangChain and RAG architectures by building real applications, not just tutorials. I also participate in the developer community through GitHub, follow thought leaders on LinkedIn and Twitter/X, and solve problems on LeetCode to keep my fundamentals sharp. I believe the best way to stay updated is to build something with new technology and see where it breaks."',
    metadata: { source: "hr-qa", type: "profile", title: "Staying updated" },
  },
];

// ── Helpers ─────────────────────────────────────────────────────────────────

function chromaHeaders() {
  const headers = { "Content-Type": "application/json" };
  if (CHROMA_TOKEN) {
    headers["Authorization"] = `Bearer ${CHROMA_TOKEN}`;
    headers["x-chroma-token"] = CHROMA_TOKEN;
  }
  return headers;
}

function qdrantHeaders() {
  const headers = { "Content-Type": "application/json" };
  if (QDRANT_API_KEY) {
    headers["api-key"] = QDRANT_API_KEY;
  }
  return headers;
}

async function fetchWithTimeout(url, options = {}) {
  const { timeoutMs = 15000, ...fetchOptions } = options;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      signal: controller.signal,
    });
    return response;
  } finally {
    clearTimeout(timer);
  }
}

async function createEmbedding(text) {
  if (useGemini) {
    // ── Gemini embedding API (free tier: 1,500 req/day) ──
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${EMBEDDING_MODEL}:embedContent?key=${EMBEDDING_API_KEY}`;

    const response = await fetchWithTimeout(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: `models/${EMBEDDING_MODEL}`,
        content: { parts: [{ text }] },
      }),
      timeoutMs: 20000,
    });

    if (!response.ok) {
      const err = await response.text().catch(() => "");
      throw new Error(`Gemini embedding failed (${response.status}): ${err.slice(0, 200)}`);
    }

    const data = await response.json();
    return data.embedding?.values ?? [];
  }

  // ── OpenAI / compatible embedding API ──
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
    throw new Error(`Embedding failed (${response.status}): ${err.slice(0, 200)}`);
  }

  const data = await response.json();
  return data.data?.[0]?.embedding ?? [];
}

// ── Main ────────────────────────────────────────────────────────────────────
async function main() {
  const storeLabel = useQdrant ? "Qdrant Cloud" : "ChromaDB";
  const storeUrl = useQdrant ? QDRANT_URL : CHROMA_URL;
  const collection = useQdrant ? QDRANT_COLLECTION : CHROMA_COLLECTION;
  const embedLabel = useGemini ? `Gemini (${EMBEDDING_MODEL})` : `OpenAI (${EMBEDDING_MODEL})`;

  console.log(`\n🔗 Vector Store:  ${storeLabel} — ${storeUrl}`);
  console.log(`📦 Collection:    ${collection}`);
  console.log(`🧠 Embeddings:    ${embedLabel}`);
  console.log(`📄 Documents to ingest: ${baseKnowledge.length}\n`);

  // 1. Create/get collection
  console.log("1/3  Creating/accessing collection...");

  if (useQdrant) {
    const colResp = await fetchWithTimeout(
      `${QDRANT_URL}/collections/${QDRANT_COLLECTION}`,
      {
        method: "PUT",
        headers: qdrantHeaders(),
        body: JSON.stringify({
          vectors: {
            size: useGemini ? 3072 : 1536,
            distance: "Cosine",
          },
        }),
        timeoutMs: 15000,
      },
    );

    if (!colResp.ok && colResp.status !== 409) {
      const err = await colResp.text().catch(() => "");
      throw new Error(`Failed to create Qdrant collection: ${err}`);
    }
    console.log("   ✓ Collection ready (Qdrant Cloud)");
  } else {
    const colResp = await fetch(`${CHROMA_URL}/api/v1/collections`, {
      method: "POST",
      headers: chromaHeaders(),
      body: JSON.stringify({ name: CHROMA_COLLECTION, get_or_create: true }),
    });

    if (!colResp.ok) {
      const err = await colResp.text().catch(() => "");
      throw new Error(`Failed to create ChromaDB collection: ${err}`);
    }
    console.log("   ✓ Collection ready (ChromaDB)");
  }

  // 2. Generate embeddings in batches
  const batchLabel = useGemini ? "Gemini (1,500 req/day free; batching 20)" : "OpenAI";
  console.log(`2/3  Generating embeddings via ${batchLabel}...`);

  const BATCH_SIZE = 20;
  const ids = [];
  const contents = [];
  const metadatas = [];
  const allEmbeddings = [];

  for (let i = 0; i < baseKnowledge.length; i += BATCH_SIZE) {
    const batch = baseKnowledge.slice(i, i + BATCH_SIZE);
    const batchEmbeddings = await Promise.all(
      batch.map((doc) => createEmbedding(doc.content)),
    );

    for (let j = 0; j < batch.length; j++) {
      ids.push(batch[j].id);
      contents.push(batch[j].content);
      metadatas.push(batch[j].metadata);
      allEmbeddings.push(batchEmbeddings[j]);
    }

    const progress = Math.min(i + BATCH_SIZE, baseKnowledge.length);
    console.log(`   ⏳ ${progress}/${baseKnowledge.length} documents embedded`);
  }
  console.log(`   ✓ ${allEmbeddings.length} embeddings generated`);

  // 3. Upsert into vector store
  console.log(`3/3  Upserting into ${storeLabel}...`);

  if (useQdrant) {
    // Qdrant: upsert in batches of 10 (Qdrant REST requires unsigned int or UUID IDs)
    const QDRANT_BATCH = 10;
    for (let i = 0; i < ids.length; i += QDRANT_BATCH) {
      const batchIds = ids.slice(i, i + QDRANT_BATCH);
      const batchVectors = allEmbeddings.slice(i, i + QDRANT_BATCH);
      const batchContents = contents.slice(i, i + QDRANT_BATCH);
      const batchMetadatas = metadatas.slice(i, i + QDRANT_BATCH);

      const points = batchIds.map((_docId, idx) => ({
        id: i + idx,  // sequential integer (Qdrant requires unsigned int or UUID)
        vector: batchVectors[idx],
        payload: {
          docId: batchIds[idx],  // store original string ID in payload
          content: batchContents[idx],
          metadata: batchMetadatas[idx],
        },
      }));

      const upsertResp = await fetchWithTimeout(
        `${QDRANT_URL}/collections/${QDRANT_COLLECTION}/points`,
        {
          method: "PUT",
          headers: qdrantHeaders(),
          body: JSON.stringify({ points }),
          timeoutMs: 60000,
        },
      );

      if (!upsertResp.ok) {
        const err = await upsertResp.text().catch(() => "");
        throw new Error(`Qdrant upsert failed: ${err}`);
      }

      console.log(
        `   ⏳ ${Math.min(i + QDRANT_BATCH, ids.length)}/${ids.length} points upserted`,
      );
    }
  } else {
    // ChromaDB: single add call
    const addResp = await fetch(
      `${CHROMA_URL}/api/v1/collections/${CHROMA_COLLECTION}/add`,
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
      throw new Error(`Failed to add documents to ChromaDB: ${err}`);
    }
  }

  console.log(`\n✅ Successfully ingested ${ids.length} documents into "${collection}"`);
  console.log(`   Vector Store: ${storeLabel} — ${storeUrl}`);
  console.log(`   Embeddings:   ${embedLabel}\n`);
}

main().catch((err) => {
  console.error(`\n❌ Ingestion failed: ${err.message}`);
  process.exit(1);
});