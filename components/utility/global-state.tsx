// TODO: Separate into multiple contexts, keeping simple for now

"use client"

import { getChatsByWorkspaceId } from "@/actions/chats"
import { createWorkspace, getWorkSpaces } from "@/actions/workspaces"
import { DEFAULT_CHAT_SETTINGS } from "@/constants/chat"
import { TalkifyContext } from "@/hooks/context"
import { ChatSettings } from "@/types/chat"
import { LLM, LLMID } from "@/types/llms"
import { Chat, Message, Workspace } from "@prisma/client"
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
  const [workspaces, setWorkspaces] = useState<Workspace[]>([])
  const [selectedWorkspace, setSelectedWorkspace] = useState<Workspace | null>(null)
  const [chatSettings, setChatSettings] = useState<ChatSettings>({
    model: "mistralai/Mixtral-8x7B-v0.1",
    prompt: "You are a helpful AI assistant.",
    temperature: 1,
    maxTokens: 128,
    topK: 40,
    topP: 0.9,
    repetitionPenalty: 1.1
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

  useEffect(() => {
    const isInChat = window?.location?.pathname === "/chat"

    if (!selectedWorkspace && !isInChat) {
      setLoading(false)
      return
    }

    setUserInput("")
    setChatMessages([])
    setSelectedChat(null)
    setIsGenerating(false)

    if (selectedWorkspace?.id) {
      fetchData(selectedWorkspace.id)
    }
  }, [selectedWorkspace])
 


  const fetchStartingData = async () => {

      const workspaces = await getWorkSpaces()
      setWorkspaces(workspaces)

      let homeWorkspace: Workspace | undefined = undefined
      homeWorkspace = workspaces.find(
        workspace => workspace.isHome === true
      )
      if (!homeWorkspace) {
        homeWorkspace = await createWorkspace({
          defaultMaxTokens: DEFAULT_CHAT_SETTINGS.maxTokens,
          defaultModel: DEFAULT_CHAT_SETTINGS.model,
          defaultPrompt: DEFAULT_CHAT_SETTINGS.prompt,
          defaultTopK: DEFAULT_CHAT_SETTINGS.topK,
          defaultTopP: DEFAULT_CHAT_SETTINGS.topP,
          defaultRepetitionPenalty: DEFAULT_CHAT_SETTINGS.repetitionPenalty,
          defaultTemperature: DEFAULT_CHAT_SETTINGS.temperature,
          name: 'Home',
          description: '',
          isHome: true,
        });
      }
      
      // DB guarantees there will always be a home workspace
      setSelectedWorkspace(homeWorkspace)

      setChatSettings({
        model: (homeWorkspace.defaultModel) as LLMID,
        prompt: homeWorkspace?.defaultPrompt,
        temperature: homeWorkspace?.defaultTemperature || 0.8,
        topK: homeWorkspace?.defaultTopK || 40,
        topP: homeWorkspace?.defaultTopP || 0.9,
        repetitionPenalty: homeWorkspace?.defaultRepetitionPenalty || 1.1,
        maxTokens: homeWorkspace?.defaultMaxTokens || 128
      })
    }
    
    const fetchData = async (workspaceId: string) => {
      setLoading(true)
  
      const chats = await getChatsByWorkspaceId(workspaceId)
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
        workspaces,
        selectedWorkspace,
        setSelectedWorkspace,
        setWorkspaces,
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