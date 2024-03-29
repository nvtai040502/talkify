
import { Message as MessageVercel } from 'ai'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'

import { cn } from '@/lib/utils'
import { CodeBlock } from '@/components/ui/codeblock'
import { MemoizedReactMarkdown } from '@/components/markdown'
import { IconOpenAI, IconUser } from '@/components/ui/icons'
import { MessageActions } from '@/components/messages/message-actions'
import { UseChatHelpers } from 'ai/react/dist'
import { useChatHandler } from '@/hooks/use-chat-handler'
import { useContext, useEffect, useRef, useState } from 'react'
import { Icons } from '../icons'
import Image from 'next/image'
import { TextareaAutosize } from '../ui/textarea-autosize'
import { MessageMarkdown } from './message-markdown'
import { Button } from '../ui/button'
import { TalkifyContext } from '@/global/context'
import { Message as PrismaMessage } from '@prisma/client'




interface MessageProps {
  message: PrismaMessage
  isEditing: boolean
  isLast: boolean
  onStartEdit: (message: PrismaMessage) => void
  onCancelEdit: () => void
  onSubmitEdit: (value: string, sequenceNumber: number) => void
}
export function Message({ 
  message, 
  isEditing,
  isLast,
  onStartEdit,
  onCancelEdit,
  onSubmitEdit
}: MessageProps) {
  const {
    setIsGenerating,
    chatMessages,
  } = useContext(TalkifyContext)
  const [editedMessage, setEditedMessage] = useState<string>(message.content)
  const editInputRef = useRef<HTMLTextAreaElement>(null)    
  const [isHovering, setIsHovering] = useState(false)
  const { handleSendMessage } = useChatHandler()
  
  const handleSendEdit = () => {
    onSubmitEdit(editedMessage, message.sequence_number)
    onCancelEdit()
  }
  const handleCopy = () => {
    navigator.clipboard.writeText(message.content)
  }
  const handleStartEdit = () => {
    onStartEdit(message)
  }
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (isEditing && event.key === "Enter" && !event.shiftKey) {
      handleSendEdit()
    }
  }
  const handleRegenerate = async () => {
    setIsGenerating(true)
    await handleSendMessage(
      editedMessage || chatMessages[chatMessages.length - 2].content,
      chatMessages,
      true
    )
  }
  useEffect(() => {
    setEditedMessage(message.content)

    if (isEditing && editInputRef.current) {
      const input = editInputRef.current
      input.focus()
      input.setSelectionRange(input.value.length, input.value.length)
    }
  }, [isEditing])

  return (
    <div
      className={cn('flex w-full justify-center')}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onKeyDown={handleKeyDown}
    >
     
      <div className="relative flex w-[300px] flex-col py-6 sm:w-[400px] md:w-[500px] lg:w-[600px] xl:w-[700px]">
        <div className="absolute right-0 top-7">
          <MessageActions 
            isAssistant={message.role === "assistant"}
            isLast={isLast}
            isEditing={isEditing}
            isHovering={isHovering}
            onCopy={handleCopy}
            onRegenerate={handleRegenerate}
            onEdit={handleStartEdit}
            
          />
        </div>
        <div className="space-y-3">
          
            <div className="flex items-center space-x-3">
              {message.role === "assistant" ? (
                  <IconOpenAI/>
              ) : (
                <IconUser/>
              )}

              <div className="font-semibold">
                {message.role === "assistant" ? (<div>{message.id}</div>) : (<div> {message.id}</div>)}
              </div>
            </div>
            {isEditing ? (
              <TextareaAutosize
                textareaRef={editInputRef}
                className="text-md"
                value={editedMessage}
                onValueChange={setEditedMessage}
                maxRows={20}
              />
            ): (
              <MessageMarkdown content={message.content} />
            )}
        </div>
      </div>
    </div>
  )
}
