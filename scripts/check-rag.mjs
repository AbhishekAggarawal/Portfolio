const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

const response = await fetch(`${baseUrl}/api/rag/status`);
const data = await response.json();

console.table(data);

if (!data.groq || !data.chroma || !data.embedding) {
  process.exitCode = 1;
}
