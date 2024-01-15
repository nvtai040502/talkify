"use client"
import { type Message as MessageVercel } from 'ai'

import { Separator } from '@/components/ui/separator'
import { Message } from '@/components/messages/message'
import { useContext, useEffect, useState } from 'react'
import { useChatHandler } from '@/lib/hooks/use-chat-handler'
import { UseChatHelpers } from 'ai/react/dist'
import { getPrismaMessages } from '@/app/actions'
import { TalkifyContext } from '@/lib/hooks/context'
import { Message as PrismaMessage} from '@prisma/client'



export function ChatMessages() {
  const { chatMessages, isGenerating, setChatMessages } = useContext(TalkifyContext)
  const [editingMessage, setEditingMessage] = useState<MessageVercel>()
  if (!chatMessages.length) {
    return null
  }
  return chatMessages
    .sort((a, b) => a.sequence_number - b.sequence_number)
    .map((chatMessage, index, array) => {
      return (
        <Message
          key={chatMessage.sequence_number}
          message={chatMessage}
          isEditing={editingMessage?.id === chatMessage.id}
          isLast={index === array.length - 1}
          onStartEdit={setEditingMessage}
          onCancelEdit={() => setEditingMessage(undefined)}
          // onSubmitEdit={handleSendEdit}
        />
      )
    })
}
