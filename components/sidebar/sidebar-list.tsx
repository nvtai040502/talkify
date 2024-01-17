"use client"
import { ClearHistory } from '@/components/sidebar/clear-history'
import { SidebarItems } from '@/components/sidebar/sidebar-items'
import { ThemeToggle } from '@/components/theme-toggle'
import { TalkifyContext } from '@/hooks/context'
import { useChatHandler } from '@/hooks/use-chat-handler'
import { cache, useContext } from 'react'

interface SidebarListProps {
  userId?: string
  children?: React.ReactNode
}


// const loadChats = cache(async (userId?: string) => {
//   return await getChats(userId)
// })

export function SidebarList({ userId }: SidebarListProps) {
  const { chats } = useContext(TalkifyContext)
  
  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <div className="flex-1 overflow-auto">
        {chats?.length ? (
          <div className="px-2 space-y-2">
            <SidebarItems chats={chats} />
          </div>
        ) : (
          <div className="p-8 text-center">
            <p className="text-sm text-muted-foreground">No chat history</p>
          </div>
        )}
      </div>
      <div className="flex items-center justify-between p-4">
        <ThemeToggle />
        <ClearHistory isEnabled={chats?.length > 0} />
      </div>
    </div>
  )
}
