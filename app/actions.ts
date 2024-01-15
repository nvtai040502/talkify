'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { kv } from '@vercel/kv'

import { auth } from '@/auth'
import { db } from '@/lib/db'
import { JSONValue, Message as VercelMessage } from 'ai'
import { Message as PrismaMessage, MessageRole, Message, Chat } from '@prisma/client'
import { mapPrismaMessageToVercelMessage } from '@/lib/utils'
// import { mapPrismaMessageToVercelMessage } from './(chat)/chat/[id]/page'
import { v4 as uuidV4 } from 'uuid'
import { ChatMessage } from '@/lib/types'
import { updateMessage } from '@/actions/messages'




export async function createMessage({
  content,
  chatId,
  role,
  sequence_number
}: Pick<Message, 'chatId' | 'content' | 'sequence_number' | 'role'>) {
  const createdMessage = await db.message.create({
    data: {
      content,
      chatId,
      role,
      sequence_number
    }
  })
  return createdMessage
}
export async function updateChat(id: string) {
  const updatedChat = await db.chat.update({
    where: {
      id
    }, data: {
      updatedAt: new Date()
    }
  })
  return updatedChat
}
export async function createChat(name: string, customId?: string, path?: string): Promise<Chat> {
  const id = uuidV4()
  const createdChat = await db.chat.create({
    data: {
      id: customId || id, 
      name,
      path: path || `/chat/${id}`
      
    }
  })
  return createdChat
}
export async function deleteMessagesIncludingAndAfter(chatId: string, sequenceNumber: number) {
  await db.message.deleteMany({
    where: {
      chatId,
      sequence_number: {
        gte: sequenceNumber,
      },
    },
  });
}
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

export async function getChats(userId?: string | null) {
  const chats = await db.chat.findMany({
    orderBy: {
      updatedAt: "desc"
    }
  })
  return chats
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



export async function getChatById(id: string) {
  const chat = await db.chat.findUnique({
    where: {
      id: id
    }
  })

  if (!chat) {
    return null
  }

  return chat
}

export async function removeChat({ id, path }: { id: string; path: string }) {

  await db.chat.delete({
    where: {
      id
    }
  })

  revalidatePath('/')
  return revalidatePath(path)
}

export async function clearChats() {

  await db.chat.deleteMany()

  revalidatePath('/')
  return redirect('/')
}

export async function getSharedChat(id: string) {
  const chat = await db.chat.findUnique({
    where: {
      id
    }
  })

  if (!chat || !chat.sharePath) {
    return null
  }

  return chat
}

export async function shareChat(id: string) {
  const chat = await db.chat.update({
    where: {
      id: id
    }, data: {
      sharePath: `/share/${id}`
    }
  })
  if (!chat) {
    return {
      error: 'Something went wrong'
    }
  }
  return chat
}
