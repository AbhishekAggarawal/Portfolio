import { projects } from "@/lib/portfolio";
import type { RagDocument } from "@/types/chat";

const skills = [
  "Python",
  "SQL",
  "Machine Learning",
  "Deep Learning",
  "Generative AI",
  "LLMs",
  "NLP",
  "Computer Vision",
  "Data Engineering",
  "ETL Pipelines",
  "Apache Spark",
  "PySpark",
  "Apache Kafka",
  "Airflow",
  "Databricks",
  "Snowflake",
  "AWS",
  "TensorFlow",
  "Scikit-learn",
  "Power BI",
  "React",
  "Next.js",
  "Tailwind CSS",
];

const certificates = [
  "Completed an intensive Computer Networking course covering protocols, routing, switching, and modern distributed communication systems.",
  "Google Cloud Data Engineering certificate covering scalable data pipelines, cloud storage, and managed analytics services.",
  "Python for Data Science certificate covering data analysis, visualization, and scripting for analytics workflows.",
];

export const baseKnowledge: RagDocument[] = [
  {
    id: "profile-about",
    content:
      "Abhishek Aggarwal is an AI and data-focused software engineer. He builds intelligent web apps, data products, automation systems, clean frontends, Python backends, data pipelines, model workflows, and cloud-ready systems.",
    metadata: { source: "portfolio-about", type: "profile", title: "About Abhishek" },
  },
  {
    id: "profile-positioning",
    content:
      "Abhishek positions himself for AI Engineer, Machine Learning Engineer, Data Scientist, MLOps Engineer, full-stack AI, and data engineering roles. He is strongest at combining AI/ML systems with practical software engineering and recruiter-friendly product execution.",
    metadata: { source: "portfolio-hero", type: "profile", title: "Professional positioning" },
  },
  {
    id: "profile-skills",
    content: `Abhishek works with these technologies and skills: ${skills.join(", ")}.`,
    metadata: { source: "portfolio-skills", type: "skill", title: "Skills" },
  },
  ...projects.map((project) => ({
    id: `project-${project.slug}`,
    content: `${project.title}: ${project.longDescription} Stack: ${project.stack.join(", ")}. Highlights: ${project.highlights.join(" ")}`,
    metadata: { source: `portfolio-project-${project.slug}`, type: "project" as const, title: project.title },
  })),
  ...certificates.map((certificate, index) => ({
    id: `certificate-${index + 1}`,
    content: certificate,
    metadata: { source: `portfolio-certificate-${index + 1}`, type: "certificate" as const, title: `Certificate ${index + 1}` },
  })),
];
