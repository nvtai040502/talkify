import { type Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'

import { auth } from '@/auth'
import { getChat } from '@/app/actions'
import { Chat } from '@/components/haveChecked/chat'
import { db } from '@/lib/db'
import { JSONValue, Message } from 'ai'
import { MessageRole } from '@prisma/client'

export interface ChatPageProps {
  params: {
    id: string
  }
}

export default async function ChatPage({ params }: ChatPageProps) {
  
  const chat = await getChat(params.id)
  const prismaMessages = await db.message.findMany({
    where: {
      chatId: chat?.id
    }
  })

  const messages: Message[] = prismaMessages.map((prismaMessage) => ({
    id: prismaMessage.id,
    tool_call_id: prismaMessage.tool_call_id || undefined,
    createdAt: prismaMessage.createdAt || undefined,
    content: prismaMessage.content,
    ui: prismaMessage.ui || undefined,
    role: prismaMessage.role as MessageRole, 
    name: prismaMessage.name || undefined,
    function_call: prismaMessage.function_call || undefined,
    data: prismaMessage.data as JSONValue[] | undefined,
    
  }));

  
  return <Chat id={chat?.id} initialMessages={messages} />
}
