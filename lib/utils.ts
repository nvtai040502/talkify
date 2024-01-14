import { MessageRole, Message as PrismaMessage } from "@prisma/client";
import { JSONValue, Message as VercelMessage } from "ai";
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
export function mapPrismaMessageToVercelMessage(prismaMessage: PrismaMessage): VercelMessage {
  return {
    id: prismaMessage.id,
    tool_call_id: prismaMessage.tool_call_id || undefined,
    createdAt: prismaMessage.createdAt || undefined,
    content: prismaMessage.content,
    ui: prismaMessage.ui || undefined,
    role: prismaMessage.role as MessageRole,
    name: prismaMessage.name || undefined,
    function_call: prismaMessage.function_call || undefined,
    data: prismaMessage.data as JSONValue[] || undefined,
  };
}
