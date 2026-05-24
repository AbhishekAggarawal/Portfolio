import { projects } from "@/lib/portfolio";
import type { RagDocument } from "@/types/chat";

const skills = [
  "Python",
  "SQL",
  "C++",
  "JavaScript",
  "TypeScript",
  "Machine Learning",
  "Deep Learning",
  "Generative AI",
  "LLMs",
  "NLP",
  "RAG",
  "TensorFlow",
  "Scikit-learn",
  "Data Engineering",
  "ETL Pipelines",
  "Apache Spark",
  "PySpark",
  "Pandas",
  "NumPy",
  "Apache Kafka",
  "Airflow",
  "Databricks",
  "Snowflake",
  "AWS",
  "Docker",
  "Jenkins",
  "Power BI",
  "FastAPI",
  "React",
  "Next.js",
  "Node.js",
  "LangChain",
  "Tailwind CSS",
  "PostgreSQL",
  "MongoDB",
  "ChromaDB",
  "Qdrant",
  "Git",
  "BM25",
  "Mistral AI",
  "Sarvam AI",
  "Groq Cloud",
  "Gemini Embeddings",
];

const certificates = [
  "Completed an intensive Computer Networking course covering protocols, routing, switching, and modern distributed communication systems.",
  "Google Cloud Data Engineering certificate covering scalable data pipelines, cloud storage, and managed analytics services.",
  "Python for Data Science certificate covering data analysis, visualization, and scripting for analytics workflows.",
];

export const baseKnowledge: RagDocument[] = [
  // ── Contact ──
  {
    id: "profile-contact",
    content:
      "Abhishek Aggarwal is based in Ranchi, Jharkhand, India 834001. Phone: +91 8789830967. Email: abhishekmonu2000@gmail.com. LinkedIn: linkedin.com/in/abhishek-aggarwal. GitHub: github.com/AbhishekAggarawal. Portfolio: abhishek-aggarwal.vercel.app.",
    metadata: { source: "portfolio-contact", type: "profile", title: "Contact Information" },
  },

  // ── Summary ──
  {
    id: "profile-summary",
    content:
      "Abhishek Aggarwal is an AI and Data Engineer experienced in building ETL pipelines, RAG systems, and AI-powered full-stack applications using Python, SQL, FastAPI, React, Spark, and modern LLM frameworks. He combines strong data engineering foundations with practical AI/ML expertise to deliver production-ready systems.",
    metadata: { source: "portfolio-summary", type: "profile", title: "Professional Summary" },
  },

  // ── About ──
  {
    id: "profile-about",
    content:
      "Abhishek Aggarwal is an AI and data-focused software engineer. He builds intelligent web apps, data products, automation systems, clean frontends, Python backends, data pipelines, model workflows, and cloud-ready systems. He currently works as a Data Engineer at Axis Bank, building and optimizing large-scale ETL/ELT pipelines.",
    metadata: { source: "portfolio-about", type: "profile", title: "About Abhishek" },
  },

  // ── Positioning ──
  {
    id: "profile-positioning",
    content:
      "Abhishek positions himself for AI Engineer, Machine Learning Engineer, Data Scientist, MLOps Engineer, Data Engineer, and full-stack AI roles. He is strongest at combining AI/ML systems with practical software engineering and data engineering, delivering recruiter-friendly product execution.",
    metadata: { source: "portfolio-hero", type: "profile", title: "Professional positioning" },
  },

  // ── Experience ──
  {
    id: "profile-experience",
    content:
      "Data Engineer at Axis Bank (July 2025 – Present). Abhishek builds and optimizes ETL/ELT pipelines for large-scale banking datasets using Python, SQL, Spark, and PySpark. He improved Spark and SQL job performance by 15–25% through query optimization, partitioning, and efficient storage strategies. He automated data validation workflows, reducing manual validation efforts by 30–40%. He developed analytical datasets and reporting layers, reducing reporting preparation time by 25–40%.",
    metadata: { source: "portfolio-experience", type: "experience", title: "Work Experience" },
  },

  // ── Education ──
  {
    id: "profile-education-1",
    content:
      "National Institute of Technology Calicut (NITC), 2021 – 2025. Bachelor of Technology (B.Tech) with a CGPA of 8.48 out of 10.",
    metadata: { source: "portfolio-education", type: "education", title: "Education — NIT Calicut" },
  },
  {
    id: "profile-education-2",
    content:
      "Lord Buddha Public School, Kota, 2019 – 2020. Completed 12th Board with 82.2%.",
    metadata: { source: "portfolio-education", type: "education", title: "Education — 12th Board" },
  },

  // ── Achievements ──
  {
    id: "profile-achievements",
    content:
      "Abhishek has solved 450+ DSA problems across LeetCode, GeeksforGeeks, and CodingStudio. He contributed to Google Developer Student Club (GDSC) and organized large-scale college fests including Tathva and Ragam. He is active in public speaking and streetplay teams. He has built and deployed multiple AI-powered full-stack applications integrating LLMs, RAG pipelines, and cloud infrastructure.",
    metadata: { source: "portfolio-achievements", type: "achievement", title: "Achievements & Activities" },
  },

  // ── Skills ──
  {
    id: "profile-skills",
    content: `Abhishek works with these technologies and skills: ${skills.join(", ")}. His core strengths are in Python, SQL, data engineering, ETL pipelines, Spark, PySpark, FastAPI, React, Next.js, and LLM/RAG frameworks like LangChain. He is also proficient in cloud platforms (AWS), containerization (Docker), CI/CD (Jenkins), and databases (PostgreSQL, MongoDB, ChromaDB).`,
    metadata: { source: "portfolio-skills", type: "skill", title: "Skills" },
  },

  // ── Index / Anchor Documents ── (always match common category queries)
  {
    id: "index-projects-overview",
    content:
      "Abhishek has built 4 major projects: ContextFrame (AI Video Intelligence Platform), PortfolioIQ (AI-Powered Portfolio & RAG Chatbot), SyncBoard (Productivity & Collaboration Platform), and MaskMyFeed (Anonymous Feedback Platform). His projects span AI/ML, full-stack web development, RAG systems, and real-time applications. Projects are detailed individually below.",
    metadata: { source: "portfolio-index", type: "profile", title: "Projects Overview (index)" },
  },
  {
    id: "index-skills-overview",
    content: `Abhishek's skills span 40+ technologies including: ${skills.join(", ")}. His strongest areas are Python, SQL, data engineering, ETL pipelines, Spark, PySpark, FastAPI, React, Next.js, LLM/RAG frameworks (LangChain), cloud platforms (AWS), Docker, and databases (PostgreSQL, MongoDB, ChromaDB).`,
    metadata: { source: "portfolio-index", type: "profile", title: "Skills Overview (index)" },
  },
  {
    id: "index-experience-overview",
    content:
      "Abhishek works as a Data Engineer at Axis Bank (July 2025 – Present). He builds and optimizes ETL/ELT pipelines for large-scale banking datasets. His key achievements include 15-25% Spark/SQL performance improvement and 30-40% manual validation automation.",
    metadata: { source: "portfolio-index", type: "profile", title: "Experience Overview (index)" },
  },
  {
    id: "index-education-overview",
    content:
      "Abhishek holds a B.Tech from NIT Calicut (2021-2025) with a CGPA of 8.48. He completed 12th from Lord Buddha Public School, Kota with 82.2%.",
    metadata: { source: "portfolio-index", type: "profile", title: "Education Overview (index)" },
  },
  {
    id: "index-certificates-overview",
    content:
      "Abhishek holds 3 certificates: Computer Networking (intensive course), Google Cloud Data Engineering, and Python for Data Science.",
    metadata: { source: "portfolio-index", type: "profile", title: "Certificates Overview (index)" },
  },
  {
    id: "index-achievements-overview",
    content:
      "Abhishek has solved 450+ DSA problems, contributed to GDSC, organized college fests (Tathva, Ragam), and built multiple AI-powered full-stack apps.",
    metadata: { source: "portfolio-index", type: "profile", title: "Achievements Overview (index)" },
  },
  {
    id: "index-contact-overview",
    content:
      "Contact Abhishek at abhishekmonu2000@gmail.com, +91 8789830967, linkedin.com/in/abhishek-aggarwal, github.com/AbhishekAggarawal. Based in Ranchi, Jharkhand, India.",
    metadata: { source: "portfolio-index", type: "profile", title: "Contact Overview (index)" },
  },
  {
    id: "index-hr-overview",
    content:
      "Abhishek's HR interview preparation covers: strengths, weaknesses, why hire him, 5-year vision, handling pressure, teamwork approach, motivation, taking initiative, relocation willingness, salary expectations, and questions to ask interviewers. HR interview Q&A answers his strengths weaknesses why hire him salary expectations relocation teamwork motivation initiative challenges pressure deadlines staying updated with technology.",
    metadata: { source: "portfolio-index", type: "profile", title: "HR Q&A Overview (index)" },
  },

  // ── Projects (auto-mapped, enriched titles) ──
  ...projects.map((project) => ({
    id: `project-${project.slug}`,
    content: `${project.title}: ${project.longDescription} Stack: ${project.stack.join(", ")}. Highlights: ${project.highlights.join(" ")}`,
    metadata: { source: `portfolio-project-${project.slug}`, type: "project" as const, title: `Project: ${project.title} (${project.category})` },
  })),

  // ── Certificates ──
  ...certificates.map((certificate, index) => ({
    id: `certificate-${index + 1}`,
    content: certificate,
    metadata: { source: `portfolio-certificate-${index + 1}`, type: "certificate" as const, title: `Certificate ${index + 1}` },
  })),

  // ── Technology Deep-Dive: Gemini Embedding Model ──
  {
    id: "tech-gemini-embedding-overview",
    content:
      "Gemini Embedding Model: Google's Gemini embedding models convert text into high-dimensional vector representations (embeddings) that capture semantic meaning. These embeddings are used for semantic search, document retrieval, clustering, and similarity matching in AI applications. The project uses gemini-embedding-001 (3072-dimensional vectors) via Google's free tier API (1,500 requests/day) for production-grade semantic search with zero cost. The Gemini Embedding API endpoint is https://generativelanguage.googleapis.com/v1beta/models/{model}:embedContent and accepts text input via a content.parts array, returning an embedding.values array of float64 numbers. Gemini embeddings are preferred over OpenAI embeddings in this project because they are completely free (no credit card required), provide higher dimensionality (3072 vs 1536 for text-embedding-3-small) enabling richer semantic representations, and integrate seamlessly with the Google AI Studio API key system.",
    metadata: { source: "portfolio-tech-stack", type: "skill", title: "Gemini Embedding Model — Overview" },
  },
  {
    id: "tech-gemini-embedding-config",
    content:
      "Gemini Embedding Configuration in this project: The embedding provider is configured via environment variables — EMBEDDING_PROVIDER=gemini, EMBEDDING_MODEL=gemini-embedding-001, EMBEDDING_API_KEY (from Google AI Studio), and EMBEDDING_DIMENSION=3072. The system auto-detects Gemini when EMBEDDING_PROVIDER is 'gemini' or when EMBEDDING_API_KEY is provided without an OpenAI-compatible EMBEDDING_API_URL. The createEmbedding() function in lib/rag/http.ts handles the Gemini API call by POSTing to the generative language API with the model name and text content, parsing the response embedding.values array. During ingestion, embeddings are generated in batches of 20 documents to stay within rate limits, and during retrieval, each user query is embedded on-the-fly for vector similarity search against the stored document embeddings.",
    metadata: { source: "portfolio-tech-stack", type: "skill", title: "Gemini Embedding — Configuration & Integration" },
  },
  {
    id: "tech-gemini-embedding-details",
    content:
      "Gemini Embedding Technical Details: Gemini offers two embedding models — gemini-embedding-001 (3072 dimensions, the default and most capable) and text-embedding-004 (768 dimensions, faster and cheaper for high-throughput use cases). The free tier allows 1,500 embedding requests per day, which is sufficient for portfolio-scale semantic search with ~60 knowledge base documents and occasional query embedding. Each embedding request can process up to 2,048 tokens of input text. The returned vectors use cosine similarity for distance measurement, which is the same distance metric configured in the Qdrant vector store. The project sets EMBEDDING_DIMENSION=3072 to match gemini-embedding-001, and this dimension is used when creating the Qdrant collection schema (vectors.size: 3072, distance: Cosine). The embedding pipeline includes a fallback chain: Gemini → OpenAI-compatible API → local Ollama, ensuring the system works across development and production environments.",
    metadata: { source: "portfolio-tech-stack", type: "skill", title: "Gemini Embedding — Technical Specifications" },
  },

  // ── Technology Deep-Dive: Qdrant Vector Database ──
  {
    id: "tech-qdrant-overview",
    content:
      "Qdrant Vector Database: Qdrant is an open-source, high-performance vector similarity search engine written in Rust. It stores and retrieves high-dimensional vectors (embeddings) with millisecond latency, making it ideal for semantic search, recommendation systems, and RAG (Retrieval-Augmented Generation) pipelines. Qdrant Cloud offers a free tier with 1GB storage and no time limit — sufficient for portfolio-scale knowledge bases with thousands of 3072-dimensional vectors. Unlike ChromaDB which experiences cold starts on free hosting platforms (Render free tier spins down after inactivity), Qdrant Cloud is always-on with no cold start latency, providing consistent sub-100ms search response times. Qdrant uses HNSW (Hierarchical Navigable Small World) graph-based indexing for approximate nearest neighbor search, configurable with cosine, euclidean, or dot-product distance metrics.",
    metadata: { source: "portfolio-tech-stack", type: "skill", title: "Qdrant Vector Database — Overview" },
  },
  {
    id: "tech-qdrant-config",
    content:
      "Qdrant Configuration in this project: Qdrant is configured via environment variables — QDRANT_URL (the Qdrant Cloud cluster endpoint, e.g., https://xyz-example.eu-central.aws.cloud.qdrant.io), QDRANT_API_KEY (for authentication via the api-key header), and QDRANT_COLLECTION (default: abhishek_portfolio). The vector store selection is controlled by VECTOR_STORE=qdrant. The project's lib/rag/config.ts exports isQdrantConfigured() which checks for both QDRANT_URL and QDRANT_API_KEY, and getActiveVectorStore() which auto-detects Qdrant when configured, falling back to ChromaDB otherwise. The Qdrant REST API is used directly (no SDK dependency) for collection creation, point upserts, and vector search — keeping the bundle lightweight. Collection creation uses PUT /collections/{name} with vectors.size matching the embedding dimension (3072 for Gemini) and distance: Cosine.",
    metadata: { source: "portfolio-tech-stack", type: "skill", title: "Qdrant — Configuration & Integration" },
  },
  {
    id: "tech-qdrant-ingestion",
    content:
      "Qdrant Ingestion Pipeline Details: During knowledge base ingestion, documents are chunked using LangChain's RecursiveCharacterTextSplitter (chunkSize: 900, chunkOverlap: 120), then each chunk is embedded via the Gemini embedding API. The resulting vectors and payloads are upserted into Qdrant in batches of 100 points per API call. Each Qdrant point has: an unsigned integer ID (Qdrant REST requires uint or UUID), a 3072-dimensional float vector, and a payload containing the original docId (string), content (text), and metadata (source, type, title). The batch size of 100 is optimized for the free tier's request limits. During retrieval (lib/rag/http.ts searchQdrant), a user query is embedded and POSTed to /collections/{name}/points/search with the vector, limit (top_k), and with_payload: true — returning scored results with content and metadata. The retrieval layer in lib/rag/retrieval.ts then merges vector results with keyword-based exact matches for hybrid search.",
    metadata: { source: "portfolio-tech-stack", type: "skill", title: "Qdrant — Ingestion & Retrieval Pipeline" },
  },
  {
    id: "tech-qdrant-advantages",
    content:
      "Why Qdrant over ChromaDB in this project: (1) Always-on availability — Qdrant Cloud free tier has no cold starts, eliminating the 15-30 second spin-up latency experienced with ChromaDB on Render's free tier. (2) Performance — Rust-based engine with HNSW indexing delivers faster search than ChromaDB's hnswlib. (3) Production readiness — Qdrant offers built-in sharding, replication, and monitoring dashboards even on the free tier. (4) Payload filtering — Qdrant supports rich payload-based filtering alongside vector search, enabling metadata-scoped queries. (5) API simplicity — REST API with clean JSON contracts, no SDK dependency needed. The project uses a dual-store architecture where VECTOR_STORE environment variable switches between Qdrant and ChromaDB, with the retrieval.ts file implementing separate retrieveFromQdrant() and retrieveFromChroma() functions that are selected at runtime based on configuration. Both paths fall back to keyword-based search if the vector store is unreachable.",
    metadata: { source: "portfolio-tech-stack", type: "skill", title: "Qdrant — Advantages & Architecture Decisions" },
  },

  // ── HR Interview Q&A ──
  {
    id: "hr-qa-1",
    content:
      'Q: "Tell me about yourself." / "Walk me through your resume."\nA: "I\'m Abhishek Aggarwal, an AI and Data Engineer currently working at Axis Bank where I build and optimize large-scale ETL/ELT pipelines using Python, SQL, Spark, and PySpark. I hold a B.Tech from NIT Calicut with a CGPA of 8.48. My core expertise sits at the intersection of data engineering and AI — I design production-grade pipelines, build RAG-powered applications using LangChain and LLMs, and develop full-stack AI solutions with FastAPI, React, and Next.js. I\'ve solved 450+ DSA problems, contributed to GDSC, and organized large-scale college fests. I\'m passionate about turning raw data into intelligent, scalable systems that drive real business impact."',
    metadata: { source: "hr-qa", type: "profile", title: "Tell me about yourself" },
  },
  {
    id: "hr-qa-2",
    content:
      'Q: "What are your greatest strengths?"\nA: "My top strengths are:\n1. Full-stack AI ownership — I can independently take an AI project from data ingestion and pipeline design all the way to a deployed web application with a clean UI. My portfolio includes multiple end-to-end AI apps built with FastAPI, LangChain, Next.js, and cloud infrastructure.\n2. Data engineering rigor — At Axis Bank, I optimized Spark and SQL jobs by 15–25% through query tuning, partitioning, and storage optimization. I also automated validation workflows that cut manual effort by 30–40%.\n3. Problem-solving mindset — With 450+ DSA problems solved and a habit of building real-world projects, I approach challenges methodically. I focus on root causes rather than quick fixes.\n4. Adaptability — I move comfortably between Python backends, Spark pipelines, LLM orchestration, and React frontends. I learn new tools quickly — most recently picking up Databricks and Snowflake on the job.\n5. Communication and collaboration — My experience organizing college fests (Tathva, Ragam) and participating in public speaking and streetplay teams has made me effective at cross-functional communication."',
    metadata: { source: "hr-qa", type: "profile", title: "Strengths" },
  },
  {
    id: "hr-qa-3",
    content:
      'Q: "What are your weaknesses or areas for improvement?"\nA: "I\'m honest about areas I\'m working on:\n1. Over-engineering early — I sometimes jump into building scalable solutions before fully validating the simplest approach. I\'m learning to prototype quickly, validate assumptions, and then scale. I now deliberately start with minimal viable pipelines before adding complexity.\n2. Delegation — Being passionate about quality, I used to try owning too many pieces myself. In team settings, I\'ve learned to trust teammates, communicate clearly, and focus my energy where it creates the most leverage.\n3. Depth in cloud DevOps — While I\'m comfortable with Docker, AWS basics, and CI/CD (Jenkins), I want to go deeper into Kubernetes, Terraform, and infrastructure-as-code. I\'m actively learning these through hands-on projects.\nNone of these are permanent gaps — I treat them as growth areas and track my progress deliberately."',
    metadata: { source: "hr-qa", type: "profile", title: "Weaknesses" },
  },
  {
    id: "hr-qa-4",
    content:
      'Q: "Why do you want to work here? / Why this role?"\nA: "I\'m drawn to roles where I can bridge data engineering and AI to build impactful products. I\'m looking for an environment that values ownership, technical depth, and real-world problem solving — where my skills in Python, Spark, LLM frameworks, and full-stack development can drive measurable outcomes. I want to work alongside strong engineers from whom I can learn while contributing my data pipeline expertise and AI product-building experience. I\'m particularly excited about teams building scalable AI-native products or data-intensive platforms where my combination of engineering rigor and AI fluency would be most valuable."',
    metadata: { source: "hr-qa", type: "profile", title: "Why this role" },
  },
  {
    id: "hr-qa-5",
    content:
      'Q: "Where do you see yourself in 5 years?"\nA: "In five years, I see myself as a Senior AI/Data Engineer or ML Engineer who architects end-to-end intelligent systems at scale. I want to grow from building individual pipelines and models to designing platform-level data and ML infrastructure. I plan to deepen my expertise in distributed systems, MLOps, and LLM orchestration while mentoring junior engineers. I also want to be in a position where I\'m making architectural decisions that shape how an organization leverages its data and AI capabilities. Ultimately, I want to be known as someone who delivers production-grade AI systems that create measurable business value."',
    metadata: { source: "hr-qa", type: "profile", title: "5-year vision" },
  },
  {
    id: "hr-qa-6",
    content:
      'Q: "Why should we hire you?"\nA: "You should hire me because I bring a rare combination: strong data engineering fundamentals paired with practical AI/ML execution skills. At Axis Bank, I\'ve already delivered production improvements — 15–25% Spark/SQL performance gains and 30–40% automation of manual workflows. Beyond that, I\'ve built and deployed multiple full-stack AI applications integrating LLMs, RAG, and cloud infrastructure — proving I can take an idea from concept to deployed product. I write clean, maintainable code across the stack (Python, TypeScript, SQL), I\'m comfortable with ambiguity, and I have a track record of learning fast and delivering results. I\'m not just looking for a job — I\'m looking to build impactful systems and grow with the team."',
    metadata: { source: "hr-qa", type: "profile", title: "Why hire Abhishek" },
  },
  {
    id: "hr-qa-7",
    content:
      'Q: "Tell me about a challenging situation and how you handled it."\nA: "During my data engineering work at Axis Bank, I encountered legacy Spark jobs that were running significantly slower than required for downstream reporting SLAs. The challenge was that these jobs processed massive banking datasets with complex join logic, and the existing partitioning strategy was suboptimal. I systematically profiled query execution plans, identified expensive shuffle operations, redesigned the partitioning scheme on frequently joined keys, and optimized broadcast joins where appropriate. I also restructured the storage format and added incremental processing to avoid full-table scans. The result was a 15–25% performance improvement and more predictable runtimes. This taught me the value of data-driven diagnosis over guesswork, and the importance of understanding the full data lifecycle — not just the code."',
    metadata: { source: "hr-qa", type: "profile", title: "Challenge overcome" },
  },
  {
    id: "hr-qa-8",
    content:
      'Q: "How do you handle tight deadlines or high-pressure situations?"\nA: "I handle pressure by prioritizing ruthlessly and communicating proactively. When facing tight deadlines, I break the work into the smallest deliverable pieces, identify the critical path, and focus on what moves the needle most. At Axis Bank, when reporting deadlines demanded faster pipeline execution, I prioritized optimizing the bottleneck jobs first, communicated realistic timelines to stakeholders, and delivered incremental improvements rather than waiting for a perfect solution. I also set clear boundaries — I\'ll put in extra effort when needed, but I believe sustainable productivity comes from good planning, not burnout. I\'ve found that early communication about risks or blockers prevents most last-minute crises."',
    metadata: { source: "hr-qa", type: "profile", title: "Handling pressure" },
  },
  {
    id: "hr-qa-9",
    content:
      'Q: "What motivates you at work?"\nA: "Three things drive me:\n1. Building things that work — There\'s a deep satisfaction in seeing a pipeline run efficiently, a model serve accurate predictions, or a user interact with an AI feature I built. Tangible impact motivates me more than abstract credit.\n2. Continuous learning — The AI and data space evolves fast. I\'m genuinely excited about new developments in LLMs, vector databases, and data infrastructure. I spend time outside work building projects with new tools because I enjoy the learning process itself.\n3. Team wins — I loved the collaborative energy of organizing college fests and contributing to GDSC. In a professional context, nothing beats the feeling of shipping something meaningful together. I\'m motivated when my work enables others to succeed."',
    metadata: { source: "hr-qa", type: "profile", title: "Motivation" },
  },
  {
    id: "hr-qa-10",
    content:
      'Q: "How do you approach teamwork and collaboration?"\nA: "I believe great engineering is a team sport. I approach collaboration with clear communication, reliability, and respect for others\' expertise. In my GDSC and college fest organizing experience, I learned that the best outcomes come from aligning on goals early, dividing responsibilities clearly, and maintaining open feedback loops. I\'m comfortable giving and receiving constructive feedback — I see code reviews and design discussions as learning opportunities, not critiques. I\'m also mindful of asynchronous communication; I document my work well so teammates can unblock themselves. When disagreements arise, I focus on what\'s best for the project, not on being right. I thrive in teams where people challenge each other intellectually but support each other unconditionally."',
    metadata: { source: "hr-qa", type: "profile", title: "Teamwork approach" },
  },
  {
    id: "hr-qa-11",
    content:
      'Q: "What is your expected salary? / What are your compensation expectations?"\nA: "I\'m focused on finding the right role with growth potential and impactful work. I\'m open to discussing compensation that reflects my skills, experience, and the value I bring — and I trust that a fair offer will align with industry standards for my profile as an AI/Data Engineer with production experience at a major bank, full-stack AI project delivery, and a strong academic background from NIT Calicut."',
    metadata: { source: "hr-qa", type: "profile", title: "Salary expectations" },
  },
  {
    id: "hr-qa-12",
    content:
      'Q: "Are you willing to relocate? / What is your location preference?"\nA: "Yes, I\'m open to relocating for the right opportunity. I\'m currently based in Ranchi, Jharkhand, but I\'m flexible about location — whether it\'s Bangalore, Hyderabad, Mumbai, Gurgaon, Pune, or any other tech hub in India. I prioritize the role, the team, and the growth opportunity over the specific city. I can also work in hybrid or remote setups depending on the team\'s needs."',
    metadata: { source: "hr-qa", type: "profile", title: "Relocation stance" },
  },
  {
    id: "hr-qa-13",
    content:
      'Q: "Do you have any questions for us?"\nA: "Yes, I typically ask:\n1. \'What does success look like in the first 3–6 months for someone in this role?\' — This shows I\'m focused on delivering value quickly.\n2. \'How does the team handle technical decisions and architecture discussions?\' — This helps me understand ownership and autonomy levels.\n3. \'What are the biggest technical challenges the team is solving right now?\' — This shows genuine interest in the work.\n4. \'How does the organization support learning and growth — conferences, courses, internal knowledge sharing?\' — This reflects my growth mindset.\n5. \'What is the team composition and how does this role interact with other functions (product, data science, platform)?\' — This shows I think about cross-functional impact."',
    metadata: { source: "hr-qa", type: "profile", title: "Questions for interviewer" },
  },
  {
    id: "hr-qa-14",
    content:
      'Q: "Describe a time you took initiative or went beyond your assigned responsibilities."\nA: "At Axis Bank, I noticed that manual data validation was consuming significant engineering time each week. Although my core responsibility was ETL pipeline development, I took the initiative to design and implement automated validation workflows using Python scripts integrated into the existing pipeline orchestration. This wasn\'t in my sprint — I built a prototype first, demonstrated the time savings to my lead, and then productionized it. The result was a 30–40% reduction in manual validation effort. Beyond work, I\'ve built and deployed multiple full-stack AI applications entirely on my own initiative — including this RAG-powered portfolio assistant — because I believe the best way to master technology is to build real products with it."',
    metadata: { source: "hr-qa", type: "profile", title: "Taking initiative" },
  },
  {
    id: "hr-qa-15",
    content:
      'Q: "How do you stay updated with technology trends?"\nA: "I stay current through multiple channels: I follow AI/ML research on arXiv and Hugging Face, read engineering blogs from companies like Netflix, Meta, and Databricks, and actively build side projects with emerging tools. I\'m hands-on with new frameworks — I learned LangChain and RAG architectures by building real applications, not just tutorials. I also participate in the developer community through GitHub, follow thought leaders on LinkedIn and Twitter/X, and solve problems on LeetCode to keep my fundamentals sharp. I believe the best way to stay updated is to build something with new technology and see where it breaks."',
    metadata: { source: "hr-qa", type: "profile", title: "Staying updated" },
  },
];
