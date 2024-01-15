"use client"
import { type Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'

import { auth } from '@/auth'
import { getChatById, getVercelMessages } from '@/app/actions'
import { Chat } from '@/components/chats/chat'
import { db } from '@/lib/db'
import ChatUI from '@/components/chats/chat-ui'


export default function ChatPage() {
  return (
  <ChatUI />
  )
}
