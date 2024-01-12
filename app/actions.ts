'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { kv } from '@vercel/kv'

import { auth } from '@/auth'
import { type Chat } from '@/lib/types'
import { db } from '@/lib/db'
import { Message } from 'ai'

export async function getChats(userId?: string | null) {
  const chats = await db.chat.findMany({
    orderBy: {
      updatedAt: "desc"
    }
  })
  return chats
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
