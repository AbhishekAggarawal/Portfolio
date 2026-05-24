import { ragConfig } from "@/lib/rag/config";

type GroqMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

export async function streamGroq(messages: GroqMessage[]) {
  if (!ragConfig.groqApiKey) {
    throw new Error("Missing GROQ_API_KEY");
  }

  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${ragConfig.groqApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: ragConfig.groqModel,
      messages,
      temperature: 0.35,
      max_tokens: 700,
      stream: true,
    }),
  });

  if (!response.ok || !response.body) {
    const message = await response.text();
    throw new Error(message || "Groq request failed");
  }

  return response.body;
}

export function groqSseToTextStream(body: ReadableStream<Uint8Array>) {
  const decoder = new TextDecoder();
  const encoder = new TextEncoder();

  return new ReadableStream<Uint8Array>({
    async start(controller) {
      const reader = body.getReader();
      let buffer = "";

      try {
        while (true) {
          const { value, done } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const events = buffer.split("\n\n");
          buffer = events.pop() ?? "";

          for (const event of events) {
            const line = event
              .split("\n")
              .find((item) => item.startsWith("data: "));

            if (!line) continue;

            const payload = line.replace("data: ", "").trim();
            if (payload === "[DONE]") continue;

            try {
              const parsed = JSON.parse(payload) as {
                choices?: Array<{ delta?: { content?: string } }>;
              };
              const token = parsed.choices?.[0]?.delta?.content;
              if (token) {
                controller.enqueue(encoder.encode(token));
              }
            } catch {
              continue;
            }
          }
        }
      } finally {
        controller.close();
      }
    },
  });
}
