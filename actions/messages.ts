"use server"

import { db } from "@/lib/db"

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