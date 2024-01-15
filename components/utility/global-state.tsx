// TODO: Separate into multiple contexts, keeping simple for now

"use client"

import { getChats } from "@/actions/chats"
import { db } from "@/lib/db"
import { TalkifyContext } from "@/lib/hooks/context"
import { Chat, Message } from "@prisma/client"
import { FC, useEffect, useState } from "react"

interface GlobalStateProps {
  children: React.ReactNode
}

export const GlobalState: FC<GlobalStateProps> = ({children}) => {
  const [userInput, setUserInput] = useState<string>("")
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null)
  const [isGenerating, setIsGenerating] = useState<boolean>(false)
  const [abortController, setAbortController] = useState<AbortController | null>(null)
  const [chats, setChats] = useState<Chat[]>([])
  const [chatMessages, setChatMessages] = useState<Message[]>([])
  // THIS COMPONENT
  const [loading, setLoading] = useState<boolean>(true)
  useEffect(() => {
    fetchStartingData()
  }, [])


  const fetchStartingData = async () => {
    setLoading(true)
    const chats = await getChats()
    setChats(chats)
    setLoading(false)
  }
  if (loading) {
    return <div>isLoading............................</div>
  }
    return (
    <TalkifyContext.Provider
      value={{
        chats,
        setChats,
        userInput,
        chatMessages,
        selectedChat,
        setUserInput,
        setChatMessages,
        setSelectedChat,

        // ACTIVE CHAT STORE
        abortController,
        isGenerating,
        setAbortController,
        setIsGenerating,
      }}
    >
      {children}
    </TalkifyContext.Provider>
  )
}