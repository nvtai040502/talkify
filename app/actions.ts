'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { kv } from '@vercel/kv'

import { auth } from '@/auth'
import { type Chat } from '@/lib/types'
import { db } from '@/lib/db'
import { JSONValue, Message as MessageVercel } from 'ai'
import { Message as MessagePrisma, MessageRole } from '@prisma/client'
import { mapPrismaMessageToVercelMessage } from '@/lib/utils'
// import { mapPrismaMessageToVercelMessage } from './(chat)/chat/[id]/page'



export async function getChatMessages(chatId: string): Promise<MessageVercel[]> {
  try {
    const prismaMessages = await db.message.findMany({
      where: {
        chatId
      }, 
      orderBy: {
        createdAt: "desc"
      }
    });

    const messages = prismaMessages.map(mapPrismaMessageToVercelMessage);
    return messages;
  } catch (error) {
    console.error("Error fetching chat messages:", error);
    // Handle the error appropriately
    return [];
  }
}

export async function getChats(userId?: string | null) {
  const chats = await db.chat.findMany({
    orderBy: {
      updatedAt: "desc"
    }
  })
  return chats
}

export async function getUpdatedUserMessages({
  indexMessage,
  chatId,
  editedContent
}: {
  indexMessage: number
  chatId: string
  editedContent: string  
}): Promise<MessageVercel[]> {
  const messagesPrisma = await db.message.findMany({
    where: {
      chatId
    }, orderBy: {
      createdAt: "asc"
    }
  })

  // Ensure the index is within the array bounds
  if (indexMessage >= 0 && indexMessage < messagesPrisma.length) {
    // Get the ID of the message at the specified index
    const messageIdToUpdate = messagesPrisma[indexMessage].id;
    const messagesToDeleteIds = messagesPrisma.slice(indexMessage + 1).map(message => message.id);
    const messageUserUpdated = await updateMessage(messageIdToUpdate, editedContent)
    if (!messageUserUpdated) return []
    // Delete messages
    await db.message.deleteMany({
      where: {
        id: { in: messagesToDeleteIds },
      },
    });
    const messagePromises = messagesPrisma.map(mapPrismaMessageToVercelMessage);
    const messages = await Promise.all(messagePromises);
    return messages.slice(0, indexMessage + 1);
  }
  return [];
}

export async function updateMessage(id: string, content: string) {
  const messagePrisma = await db.message.update({
    where: {
      id
    }, data: {
      content
    }
  })
  if (!messagePrisma) {
    return null
  }
  const messageVercel = await mapPrismaMessageToVercelMessage(messagePrisma)
  return messageVercel
}

export async function getChat(id: string) {
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
