import { type Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'

import { auth } from '@/auth'
import { getChatById, getVercelMessages } from '@/app/actions'
import { Chat } from '@/components/chats/chat'
import { db } from '@/lib/db'

export interface ChatPageProps {
  params: {
    id: string
  }
}

export default async function ChatPage({ params }: ChatPageProps) {
  
  const chat = await getChatById(params.id)
  if (!chat) return notFound()
  const vercelMessages = await getVercelMessages(chat.id)

  return (
  <>
  <Chat id={chat?.id} initialMessages={vercelMessages} />
  
  </>
  )
}
