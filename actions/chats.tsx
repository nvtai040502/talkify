"use server"
import { db } from "@/lib/db"
import { Chat } from "@prisma/client"

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

export async function getChatsByWorkspaceId(workspaceId: string) {
  const chats = await db.chat.findMany({
    where: {
      workspaceId
    },
    orderBy: {
      updatedAt: "desc"
    }
  })
  return chats
}

export async function createChat(workspaceId: string,name?: string): Promise<Chat> {
  const createdChat = await db.chat.create({
    data: {
      name: name || "Hello",
      workspaceId  
    }
  })
  return createdChat
}

export async function updateChat(id: string, name?: string) {
  const updatedChat = await db.chat.update({
    where: {
      id
    }, data: {
      name,
      updatedAt: new Date()
    }
  })
  return updatedChat
}

export async function deleteChat(id: string) {
  await db.chat.delete({
    where: {
      id
    }
  })
}


export async function clearChats() {
  await db.chat.deleteMany()
}