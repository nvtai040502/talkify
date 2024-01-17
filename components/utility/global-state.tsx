// TODO: Separate into multiple contexts, keeping simple for now

"use client"

import { getChats } from "@/actions/chats"
import { TalkifyContext } from "@/lib/hooks/context"
import { ChatSettings } from "@/types/chat"
import { LLM, LLMID } from "@/types/llms"
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
  const [chatSettings, setChatSettings] = useState<ChatSettings>({
    model: "mistralai/Mixtral-8x7B-v0.1",
    prompt: "You are a helpful AI assistant.",
  })
  const [availableLocalModels, setAvailableLocalModels] = useState<LLM[]>([])
  // THIS COMPONENT
  const [loading, setLoading] = useState<boolean>(true)
  useEffect(() => {
    
    if (process.env.NEXT_PUBLIC_OLLAMA_URL) {
      fetchOllamaModels()
    }

    fetchStartingData()
  }, [])


  const fetchStartingData = async () => {
    setLoading(true)
    const chats = await getChats()
    setChats(chats)
    setLoading(false)
  }

  const fetchOllamaModels = async () => {
    setLoading(true)

    try {
      const response = await fetch(
        process.env.NEXT_PUBLIC_OLLAMA_URL + "/api/tags"
      )

      if (!response.ok) {
        throw new Error(`Ollama server is not responding.`)
      }

      const data = await response.json()

      const localModels = data.models.map((model: any) => ({
        modelId: model.name as LLMID,
        modelName: model.name,
        provider: "ollama",
        hostedId: model.name,
        platformLink: "https://ollama.ai/library",
        imageInput: false
      }))

      setAvailableLocalModels(localModels)
    } catch (error) {
      console.warn("Error fetching Ollama models: " + error)
    }

    setLoading(false)
  }

  if (loading) {
    return <div>isLoading............................</div>
  }
    return (
    <TalkifyContext.Provider
      value={{
        chats,
        chatSettings,
        availableLocalModels,
        setAvailableLocalModels,
        setChatSettings,
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