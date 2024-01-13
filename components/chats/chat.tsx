'use client'

import { useChat, type Message } from 'ai/react'

import { cn } from '@/lib/utils'
import { ChatMessages } from '@/components/chats/chat-messages'
import { ChatPanel } from '@/components/chats/chat-panel'
import { EmptyScreen } from '@/components/empty-screen'
import { useLocalStorage } from '@/lib/hooks/use-local-storage'

import { toast } from 'react-hot-toast'
import { usePathname, useRouter } from 'next/navigation'
import axios from "axios"
import { createChat } from '@/actions/chat'
import { db } from '@/lib/db'
import { useCallback, useEffect, useState } from 'react'
import { useScroll } from '@/lib/hooks/use-scroll'
import { ChatScrollButtons } from './chat-scroll-button'
export interface ChatProps extends React.ComponentProps<'div'> {
  initialMessages?: Message[]
  id?: string
}

export function Chat({ id, initialMessages, className }: ChatProps) {
  const router = useRouter()
  const path = usePathname()
  
  const { messages, append, reload, stop, isLoading, setMessages } =
    useChat({
      api: `/api/chat/hf`,
      initialMessages,
      id,
      body: {
        id,
      },
      onResponse(response) {
        if (response.status === 401) {
          toast.error(response.statusText)
        }
      },
      onFinish() {
        if (!path.includes('chat')) {
          router.push(`/chat/${id}`, { scroll: false });
          router.refresh();
        }
      },
    });
  const {
    messagesStartRef,
    messagesEndRef,
    handleScroll,
    scrollToBottom,
    setIsAtBottom,
    isAtTop,
    isAtBottom,
    isOverflowing,
    scrollToTop
  } = useScroll({isGenerating: isLoading, chatMessages: messages})

  useEffect(() => {
    if (path.includes('chat')) {
      scrollToBottom()
      setIsAtBottom(true)
    }
  }, [])
  return (
    <>
      <div className={cn('pb-[200px] pt-4 md:pt-10', className)}>
        {messages.length ? (

          <>
          <div className="absolute right-4 top-2.5 flex justify-center">
            <ChatScrollButtons
              isAtTop={isAtTop}
              isAtBottom={isAtBottom}
              isOverflowing={isOverflowing}
              scrollToTop={scrollToTop}
              scrollToBottom={scrollToBottom}
            />
          </div>
          <div className="h-72 overflow-auto" onScroll={handleScroll}>
            <div ref={messagesStartRef} />
              <ChatMessages 
                messages={messages} 
                isLoading={isLoading} 
                // setMessages={setMessages} 
                reload={reload}
              />
            <div ref={messagesEndRef} />
          </div>

          
        </>
        ) : (
          <EmptyScreen />
        )}
      </div>
      
      <ChatPanel
        id={id}
        title="hel"
        isLoading={isLoading}
        stop={stop}
        append={append}
        reload={reload}
        setMessages={setMessages}
        messages={messages}
       
      /> 

      
    </>
  )
}
