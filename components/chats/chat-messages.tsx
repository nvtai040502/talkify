"use client"
import { type Message as MessageVercel } from 'ai'

import { Separator } from '@/components/ui/separator'
import { Message } from '@/components/messages/message'
import { useContext, useEffect, useState } from 'react'
import { useChatHandler } from '@/lib/hooks/use-chat-handler'
import { UseChatHelpers } from 'ai/react/dist'
import { getPrismaMessages } from '@/app/actions'
import { TalkifyContext } from '@/lib/hooks/context'

export interface ChatMessagesProps extends Pick<
UseChatHelpers,
| 'setMessages'
| 'isLoading'
| 'reload'
| 'messages'

> {
  chatId: string
}


export function ChatMessages({ 
  messages, 
  chatId,
  isLoading,
  reload,
  setMessages
}: ChatMessagesProps) {
  const [editingMessage, setEditingMessage] = useState<MessageVercel>()
  if (!messages.length) {
    return null
  }
  return (
    <div className="relative max-w-2xl px-4 mx-auto">
      {messages.map((message, index) => (
          <Message 
            key={index}
            message={message} 
            isEditing={editingMessage?.id === message.id}
            isLast={index === messages.length - 1}
            onStartEdit={setEditingMessage}
            onCancelEdit={() => setEditingMessage(undefined)}
            setMessages={setMessages}
            reload={reload}
            isLoading={isLoading}
            chatId={chatId}
          />
      ))}
    </div>
  )
}
