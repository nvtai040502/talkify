"use client"
import { TalkifyContext } from "@/hooks/context";
import { ChatScrollButtons } from "./chat-scroll-button";
import { useContext, useEffect, useState } from "react";
import { useScroll } from "@/hooks/use-scroll";
import { useParams } from "next/navigation";
import { useChatHandler } from "@/hooks/use-chat-handler";
import ChatInput from "./chat-input";
import { ChatMessages } from "./chat-messages";
import { getMessagesByChatId } from "@/actions/messages";
import { getChatById } from "@/actions/chats";

const ChatUI = ({
  chatId
}: {
  chatId?: string
}) => {
  const { userInput,chatMessages, isGenerating, setChatMessages, setSelectedChat, selectedChat } = useContext(TalkifyContext)
  const [loading, setLoading] = useState(true)
  const { handleFocusChatInput } = useChatHandler()
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
  } = useScroll({isGenerating, chatMessages})
  useEffect(() => {
    
    const fetchData = async (chatId: string) => {
      await fetchMessages(chatId)
      await fetchChat(chatId)

      scrollToBottom()
      setIsAtBottom(true)
    }
    if (chatId) {fetchData(chatId)}
    
    setLoading(false)
    
  }, [])
  
  const fetchMessages = async (chatId: string) => {
    const fetchedMessages = await getMessagesByChatId(chatId)
    
    setChatMessages(fetchedMessages)
  }

  const fetchChat = async (chatId: string) => {
    const chat = await getChatById(chatId)
    if (!chat) return
    setSelectedChat(chat)
  }

  if (loading) {
    return <div>isLoading...............................</div>
  }
  
  return ( 
    <div className="relative flex flex-col items-center h-full">
      <div className="absolute left-4 top-2.5 flex justify-center">
        <ChatScrollButtons
          isAtTop={isAtTop}
          isAtBottom={isAtBottom}
          isOverflowing={isOverflowing}
          scrollToTop={scrollToTop}
          scrollToBottom={scrollToBottom}
        />
      </div>

      <div className="absolute right-4 top-1 flex h-[40px] items-center space-x-2">
        {/* <ChatSecondaryButtons /> */}
      </div>

      <div className="bg-secondary flex max-h-[50px] min-h-[50px] w-full items-center justify-center border-b-2 px-20 font-bold">
        <div className="max-w-[300px] truncate sm:max-w-[400px] md:max-w-[500px] lg:max-w-[600px] xl:max-w-[700px]">
          {selectedChat?.name || "Chat"}
        </div>
      </div>

      <div
        className="flex flex-col w-full h-full overflow-auto border-b"
        onScroll={handleScroll}
      >
        <div ref={messagesStartRef} />

        <ChatMessages />

        <div ref={messagesEndRef} />
      </div>

      <div className="relative w-[300px] items-end pb-8 pt-5 sm:w-[400px] md:w-[500px] lg:w-[660px] xl:w-[800px]">
        <ChatInput />
      </div>

      <div className="absolute hidden bottom-2 right-2 md:block lg:bottom-4 lg:right-4">
        {/* <ChatHelp /> */}
      </div>
    </div>
   );
}
 
export default ChatUI;