
import { Message as MessageVercel } from 'ai'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'

import { cn } from '@/lib/utils'
import { CodeBlock } from '@/components/ui/codeblock'
import { MemoizedReactMarkdown } from '@/components/markdown'
import { IconOpenAI, IconUser } from '@/components/ui/icons'
import { MessageActions } from '@/components/messages/message-actions'
import { UseChatHelpers } from 'ai/react/dist'
import { useChatHandler } from '@/lib/hooks/use-chat-handler'
import { useEffect, useRef, useState } from 'react'
import { Icons } from '../icons'
import Image from 'next/image'
import { TextareaAutosize } from '../ui/textarea-autosize'
import { MessageMarkdown } from './message-markdown'
import { Button } from '../ui/button'
import OpenAI from 'openai'



const ICON_SIZE = 28

interface MessageProps extends Pick<
UseChatHelpers,
// | 'setMessages'
| 'isLoading'
| 'reload'
// | 'messages'

> {
  message: MessageVercel
  // isEditing: boolean
  isLast: boolean
  // onStartEdit: (message: Message) => void
  // onCancelEdit: () => void
}
export function Message({ 
  message, 
  // isEditing,
  isLoading,
  isLast,
  // messages,
  reload,
  // setMessages,
  // onStartEdit,
  // onCancelEdit,
  ...props 
}: MessageProps) {
  // const { handleSendEdit: obSubmitEdit } = useChatHandler()
  // const [editedMessage, setEditedMessage] = useState<string>(message.content)
  // const editInputRef = useRef<HTMLTextAreaElement>(null)
  const [isHovering, setIsHovering] = useState(false)

  // const handleSendEdit = () => {
  //   obSubmitEdit({setMessages: setMessages, messageId: message.id, reload: reload, editedContent: editedMessage, messages})
  //   onCancelEdit()
  // }
  const handleCopy = () => {
    navigator.clipboard.writeText(message.content)
  }
  // const handleStartEdit = () => {
  //   onStartEdit(message)
  // }
  // const handleKeyDown = (event: React.KeyboardEvent) => {
  //   if (isEditing && event.key === "Enter" && event.metaKey) {
  //     handleSendEdit()
  //   }
  // }
  // useEffect(() => {
  //   setEditedMessage(message.content)

  //   if (isEditing && editInputRef.current) {
  //     const input = editInputRef.current
  //     input.focus()
  //     input.setSelectionRange(input.value.length, input.value.length)
  //   }
  // }, [isEditing])

  return (
    <div
      className={cn('flex w-full justify-center')}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
     
      <div className="relative flex w-[300px] flex-col py-6 sm:w-[400px] md:w-[500px] lg:w-[600px] xl:w-[700px]">
        <div className="absolute right-0 top-7">
          <MessageActions 
            isAssistant={message.role === "assistant"}
            isLast={isLast}
            // isEditing={isEditing}
            isHovering={isHovering}
            isLoading={isLoading}
            onCopy={handleCopy}
            reload={reload}
            // onEdit={handleStartEdit}
            
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
                {message.role === "assistant" ? "ChatGPT" : "You"}
              </div>
            </div>
            <MessageMarkdown content={message.content} />
        </div>
      </div>
    </div>
  )
}
