import { Chat, Message } from "@prisma/client";

export interface ChatMessage extends Chat {
  messages: Message[]
}