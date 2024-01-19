"use client"
// import { Chat } from "@/components/chats/chat"
import ChatInput from "@/components/chats/chat-input"
import ChatUI from "@/components/chats/chat-ui"
import { Icons } from "@/components/icons"
import { TalkifyContext } from "@/global/context"
import { useChatHandler } from "@/hooks/use-chat-handler"
import { useContext } from "react"
import { ChatSettings } from "@/components/chats/chat-settings"
import { QuickSettings } from "@/components/chats/quick-settings"
// import { QuickSettings } from "@/components/chats/quick-settings"

export default function IndexPage() {
  const { chatMessages } = useContext(TalkifyContext)
  return (
    <>
      {chatMessages.length === 0 ? (
        <div className="relative flex flex-col items-center justify-center h-full">
          <div className="top-50% left-50% -translate-x-50% -translate-y-50% absolute mb-20">
            <Icons.add size={36} />
          </div>

          <div className="absolute left-2 top-2">
            {/* <QuickSettings /> */}
          </div>

          <div className="absolute right-2 top-2">
            <ChatSettings />
          </div>

          <div className="flex flex-col items-center justify-center grow" />

          <div className="w-[300px] pb-8 sm:w-[400px] md:w-[500px] lg:w-[660px] xl:w-[800px]">
            <ChatInput />
          </div>

          <div className="absolute hidden bottom-2 right-2 md:block lg:bottom-4 lg:right-4">
            {/* <ChatHelp /> */}
          </div>
        </div>
      ) : (
        <ChatUI />
      )}
    </>
  )
}
