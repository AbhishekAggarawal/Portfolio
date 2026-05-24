const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
const token = process.env.RAG_INGEST_TOKEN;

if (!token) {
  console.error("Missing RAG_INGEST_TOKEN.");
  process.exit(1);
}

const response = await fetch(`${baseUrl}/api/ingest`, {
  method: "POST",
  headers: {
    "x-admin-token": token,
  },
});

const data = await response.json();

if (!response.ok) {
  console.error(data);
  process.exit(1);
}

console.log(`Ingested ${data.documents} chunks into ${data.collection}.`);
