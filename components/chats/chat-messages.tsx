"use client"
import { type Message } from 'ai'

import { Separator } from '@/components/ui/separator'
import { Message } from '@/components/messages/message'
import { useState } from 'react'
import { useChatHandler } from '@/lib/hooks/use-chat-handler'
import { UseChatHelpers } from 'ai/react/dist'

export interface ChatMessagesProps extends Pick<
UseChatHelpers,
// | 'setMessages'
| 'isLoading'
| 'reload'
| 'messages'

> {
}

export function ChatMessages({ 
  messages, 
  isLoading,
  reload,
  // setMessages
}: ChatMessagesProps) {
  // const [editingMessage, setEditingMessage] = useState<Message>()
  if (!messages.length) {
    return null
  }
  
  return (
    <div className="relative max-w-2xl px-4 mx-auto">
      {messages.map((message, index) => (
          <Message 
            key={index}
            message={message} 
            // isEditing={editingMessage?.id === message.id}
            isLast={index === messages.length - 1}
            // onStartEdit={setEditingMessage}
            // onCancelEdit={() => setEditingMessage(undefined)}
            // setMessages={setMessages}
            reload={reload}
            // messages={messages}
            isLoading={isLoading}
          />
      ))}
    </div>
  )
}
