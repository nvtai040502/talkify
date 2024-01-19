'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { auth } from '@/auth'
import { db } from '@/lib/db'
import { JSONValue, Message as VercelMessage } from 'ai'
import { Message as PrismaMessage, MessageRole, Message, Chat } from '@prisma/client'
import { mapPrismaMessageToVercelMessage } from '@/lib/utils'
// import { mapPrismaMessageToVercelMessage } from './(chat)/chat/[id]/page'
import { v4 as uuidV4 } from 'uuid'
import { ChatMessage } from '@/lib/types'
import { updateMessage } from '@/actions/messages'

export async function getPrismaMessages(chatId: string): Promise<PrismaMessage[]> {
  try {
    const prismaMessages = await db.message.findMany({
      where: {
        chatId
      }, 
      orderBy: {
        sequence_number: "asc"
      }
    });

    return prismaMessages;
  } catch (error) {
    console.error("Error fetching chat messages:", error);
    // Handle the error appropriately
    return [];
  }
}

export async function getVercelMessages(chatId: string): Promise<VercelMessage[]> {
  try {
    const prismaMessages = await getPrismaMessages(chatId)
    const messages = prismaMessages.map(mapPrismaMessageToVercelMessage);
    return messages;
  } catch (error) {
    console.error("Error fetching chat messages:", error);
    // Handle the error appropriately
    return [];
  }
}

export async function getChatMessages(chatId: string): Promise<ChatMessage | null> {
  const chatMessages = await db.chat.findUnique({
    where: {
      id: chatId
    }, include: {
      messages: {
        where: {
          chatId
        }, orderBy: {
          sequence_number: "asc"
        }
      }
    }
  })
  if (!chatMessages) return null
  return chatMessages
}


export async function getVercelMessagesUpdated({
  messageId,
  chatId,
  editedContent
}: {
  messageId: string
  chatId: string
  editedContent: string  
}): Promise<VercelMessage[]> {
  const prismaMessageUpdated = await updateMessage(messageId, editedContent)
  if (!prismaMessageUpdated) return []
  // Delete messages with index greater than the updated message's index
  await db.message.deleteMany({
    where: {
      chatId,
      sequence_number: {
        gt: prismaMessageUpdated.sequence_number
      }
    }
  });
  // Fetch and return the updated messages
  const vercelMessagesUpdated = await getVercelMessages(chatId)
  return vercelMessagesUpdated




}





