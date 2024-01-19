import { Message } from "@prisma/client";
import { LLMID } from "./llms";

export interface ChatSettings {
  model: LLMID
  prompt: string
  temperature: number
  // maxTokens: number
  // topK: number
  // topP: number
  // repetitionPenalty: number
  includeWorkspaceInstructions: boolean
}

export interface ChatPayload {
  chatSettings: ChatSettings
  chatMessages: Message[]
  workspaceInstructions: string
}
