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
  "Git",
  "BM25",
  "Mistral AI",
  "Sarvam AI",
  "Groq Cloud",
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

  // ── Projects (auto-mapped) ──
  ...projects.map((project) => ({
    id: `project-${project.slug}`,
    content: `${project.title}: ${project.longDescription} Stack: ${project.stack.join(", ")}. Highlights: ${project.highlights.join(" ")}`,
    metadata: { source: `portfolio-project-${project.slug}`, type: "project" as const, title: project.title },
  })),

  // ── Certificates ──
  ...certificates.map((certificate, index) => ({
    id: `certificate-${index + 1}`,
    content: certificate,
    metadata: { source: `portfolio-certificate-${index + 1}`, type: "certificate" as const, title: `Certificate ${index + 1}` },
  })),
];
