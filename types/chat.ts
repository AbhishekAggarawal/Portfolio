export type ChatRole = "user" | "assistant" | "system";

export type ChatMessage = {
  id: string;
  role: ChatRole;
  content: string;
};

export type ChatRequest = {
  messages: Pick<ChatMessage, "role" | "content">[];
};

export type RagDocument = {
  id: string;
  content: string;
  metadata: {
    source: string;
    type: "profile" | "project" | "skill" | "certificate" | "resume" | "github" | "document";
    title?: string;
  };
};
