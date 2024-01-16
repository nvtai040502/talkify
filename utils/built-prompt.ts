import { Message } from "@prisma/client";

export function buildFinalMessages(messages: Message[]): string {
  const finalMessages = messages.map(message => message.content).join(' ');
  return finalMessages;
}
