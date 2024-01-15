'use client'

import { AnimatePresence, motion } from 'framer-motion'


import { SidebarActions } from '@/components/sidebar/sidebar-actions'
import { SidebarItem } from '@/components/sidebar/sidebar-item'
import { Chat } from '@prisma/client'
import { useChatHandler } from '@/lib/hooks/chat-hook/use-chat-handler'

interface SidebarItemsProps {
  chats?: Chat[]
}

export function SidebarItems({ chats }: SidebarItemsProps) {
  if (!chats?.length) return null
  return (
    <AnimatePresence>
      {chats
      .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
      .map(
        (chat, index) =>
          chat && (
            <motion.div
              key={chat?.id}
              exit={{
                opacity: 0,
                height: 0
              }}
            >
              <SidebarItem index={index} chat={chat}>
                <SidebarActions
                  chat={chat}
                  
                  // shareChat={shareChat}
                />
              </SidebarItem>
            </motion.div>
          )
      )}
    </AnimatePresence>
  )
}
