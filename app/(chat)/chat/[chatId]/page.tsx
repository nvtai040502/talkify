import { type Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'

import { auth } from '@/auth'
import { db } from '@/lib/db'
import ChatUI from '@/components/chats/chat-ui'
import ApiTest from '@/components/test/api'

interface ChatIdPageProps {
  params: {
    chatId: string
  }
}
export default function ChatIdPage({
  params
}: ChatIdPageProps) {
  return (
  <ChatUI chatId={params.chatId}/>
  )
}
