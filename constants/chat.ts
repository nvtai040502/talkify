import { ChatSettings } from "@/types/chat";

export const DEFAULT_CHAT_SETTINGS: ChatSettings = {
  model: "mistralai/Mixtral-8x7B-v0.1",
  prompt: "",
  maxTokens: 128,
  temperature: 0.8,
  topK: 40,
  topP: 0.8,
  repetitionPenalty: 1.1,
  includeWorkspaceInstructions: true
}