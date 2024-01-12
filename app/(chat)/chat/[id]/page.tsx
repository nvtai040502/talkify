import { type Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'

import { auth } from '@/auth'
import { getChat } from '@/app/actions'
import { Chat } from '@/components/chat'
import { db } from '@/lib/db'
import { JSONValue, Message } from 'ai'
import { MessageRole } from '@prisma/client'

export interface ChatPageProps {
  params: {
    id: string
  }
}

// export async function generateMetadata({
//   params
// }: ChatPageProps): Promise<Metadata> {
//   const session = await auth()

//   if (!session?.user) {
//     return {}
//   }

//   const chat = await getChat(params.id, session.user.id)
//   return {
//     title: chat?.title.toString().slice(0, 50) ?? 'Chat'
//   }
// }

export default async function ChatPage({ params }: ChatPageProps) {
  // const session = await auth()

  // if (!session?.user) {
  //   redirect(`/sign-in?next=/chat/${params.id}`)
  // }

  // const chat = await getChat(params.id, session.user.id)

  // if (!chat) {
  //   notFound()
  // }

  // if (chat?.userId !== session?.user?.id) {
  //   notFound()
  // }
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
    role: prismaMessage.role as MessageRole, // Ensure correct enum mapping
    name: prismaMessage.name || undefined,
    function_call: prismaMessage.function_call || undefined,
    data: prismaMessage.data as JSONValue[] | undefined,
    
  }));

  
  return <Chat id={chat?.id} initialMessages={messages} />
}
