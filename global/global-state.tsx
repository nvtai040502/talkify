// TODO: Separate into multiple contexts, keeping simple for now

"use client"

import { getChatsByWorkspaceId } from "@/actions/chats"
import { createPreset, getPresetWorkspacesByWorkspaceId } from "@/actions/presets"
import { getPromptWorkspacesByWorkspaceId } from "@/actions/prompt"
import { createWorkspace, getWorkSpaces } from "@/actions/workspaces"
import { DEFAULT_CHAT_SETTINGS } from "@/constants/chat"
import { TalkifyContext } from "@/global/context"
import { ChatSettings } from "@/types/chat"
import { LLM, LLMID } from "@/types/llms"
import { Chat, Message, Preset, Prompt, Workspace } from "@prisma/client"
import { FC, useEffect, useRef, useState } from "react"

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
  const [chatSettings, setChatSettings] = useState<ChatSettings>(DEFAULT_CHAT_SETTINGS)
  const [availableLocalModels, setAvailableLocalModels] = useState<LLM[]>([])
  const [presets, setPresets] = useState<Preset[]>([])
  const [selectedPreset, setSelectedPreset] = useState<Preset | null>(null)
  const [prompts, setPrompts] = useState<Prompt[]>([])
  const [selectedPrompt, setSelectedPrompt] = useState<Prompt | null>(null)
  // THIS COMPONENT
  const [loading, setLoading] = useState<boolean>(true)
  const hasInitializedRef = useRef(false);
  useEffect(() => {
    if (process.env.NEXT_PUBLIC_OLLAMA_URL) {
      fetchOllamaModels()
    }

    if (!hasInitializedRef.current) {
      // Perform the initialization logic (create Home workspace) here
      fetchStartingData();
      hasInitializedRef.current = true;
    }
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
    // console.log("After setSelectedWorkspace:", selectedWorkspace);
    if (selectedWorkspace?.id) {
      fetchData(selectedWorkspace.id)
    }
  }, [selectedWorkspace])
 


  const fetchStartingData = async () => {
    try {
      const workspaces = await getWorkSpaces();
      setWorkspaces(workspaces);
  
      let homeWorkspace: Workspace | undefined = workspaces.find(
        (workspace) => workspace.isHome === true
      );
  
      if (!homeWorkspace) {
        homeWorkspace = await createWorkspace({
          instructions: "",
          defaultModel: DEFAULT_CHAT_SETTINGS.model,
          defaultPrompt: DEFAULT_CHAT_SETTINGS.prompt,
          defaultTemperature: DEFAULT_CHAT_SETTINGS.temperature,
          name: 'Home',
          description: '',
          isHome: true,
          // defaultRepetitionPenalty: DEFAULT_CHAT_SETTINGS.repetitionPenalty,
          // defaultTopP: DEFAULT_CHAT_SETTINGS.topP,
          // defaultTopK: DEFAULT_CHAT_SETTINGS.topK,
          // defaultMaxTokens: DEFAULT_CHAT_SETTINGS.maxTokens,
        });
      }
  
      // console.log("Before setSelectedWorkspace:", homeWorkspace);
      setSelectedWorkspace(homeWorkspace);
      // console.log("After setSelectedWorkspace:", selectedWorkspace?.include_workspace_instruction);

  
      setChatSettings({
        model: homeWorkspace.defaultModel as LLMID,
        prompt: homeWorkspace.defaultPrompt,
        temperature: homeWorkspace.defaultTemperature,
        includeWorkspaceInstructions: homeWorkspace.includeWorkspaceInstructions,
        // topK: homeWorkspace.defaultTopK,
        // topP: homeWorkspace.defaultTopP,
        // repetitionPenalty: homeWorkspace.defaultRepetitionPenalty,
        // maxTokens: homeWorkspace.defaultMaxTokens,
      });
    } catch (error) {
      console.log(error);
    }
  };
    
    const fetchData = async (workspaceId: string) => {
      setLoading(true)
  
      const chats = await getChatsByWorkspaceId(workspaceId)
      setChats(chats)

      let presetData = await getPresetWorkspacesByWorkspaceId(workspaceId)
      setPresets(presetData)

      let promptData = await getPromptWorkspacesByWorkspaceId(workspaceId)
      setPrompts(promptData)
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
        presets,
        selectedPreset,
        prompts,
        selectedPrompt,
        setSelectedPrompt,
        setPrompts,
        setSelectedPreset,
        setPresets,
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