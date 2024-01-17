import { Message } from "@prisma/client";
import { LLMID } from "./llms";

export interface ChatSettings {
  model: LLMID
  prompt: string
}

export interface ChatPayload {
  chatSettings: ChatSettings
  chatMessages: Message[]
}
