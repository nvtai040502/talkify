"use server"

import { db } from "@/lib/db"
import { Message } from "@prisma/client"

export async function getMessagesByChatId(chatId: string) {
  const messages = await db.message.findMany({
    where: {
      chatId
    }, orderBy: {
      sequence_number: "asc"
    }
  })
  return messages
}
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
export async function updateMessage(id: string, content: string) {
  const updatedMessage = await db.message.update({
    where: {
      id
    }, data: {
      content
    }
  })
  return updatedMessage
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