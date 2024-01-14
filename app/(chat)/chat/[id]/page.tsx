import { type Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'

import { auth } from '@/auth'
import { getChat, getChatMessages } from '@/app/actions'
import { Chat } from '@/components/chats/chat'
import { db } from '@/lib/db'
import { JSONValue, Message as MessageVercel } from 'ai'
import { Message as MessagePrisma } from '@prisma/client'
import { MessageRole } from '@prisma/client'

export interface ChatPageProps {
  params: {
    id: string
  }
}

export default async function ChatPage({ params }: ChatPageProps) {
  
  const chat = await getChat(params.id)
  if (!chat) return notFound()
  const messages = await getChatMessages(chat.id)
  const test = await db.message.findMany({
    where: {
      chatId: params.id
    }, orderBy: {
      createdAt: "desc"
    }
  })
  console.log(test)
  return (
  <>
  <Chat id={chat?.id} initialMessages={messages} />
  
  </>
  )
}
