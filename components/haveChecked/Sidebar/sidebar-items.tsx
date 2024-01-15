'use client'

import { AnimatePresence, motion } from 'framer-motion'

import { removeChat, shareChat, updateChat } from '@/app/actions'

import { SidebarActions } from '@/components/haveChecked/Sidebar/sidebar-actions'
import { SidebarItem } from '@/components/haveChecked/Sidebar/sidebar-item'
import { Chat } from '@prisma/client'

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
                  removeChat={removeChat}
                  shareChat={shareChat}
                />
              </SidebarItem>
            </motion.div>
          )
      )}
    </AnimatePresence>
  )
}
