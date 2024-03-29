// Modified from https://github.com/mckaywrigley/chatbot-ui/blob/main/context/context.tsx
import { Chat, Message, Preset, Prompt, Workspace } from "@prisma/client"
import { Dispatch, SetStateAction, createContext } from "react"
import { ChatSettings } from "@/types/chat"
import { LLM } from "@/types/llms"
interface TalkifyContextProps {
  userInput: string
  isGenerating: boolean
  chats: Chat[]
  chatMessages: Message[]
  selectedChat: Chat | null
  abortController: AbortController | null
  chatSettings: ChatSettings | null
  availableLocalModels: LLM[]
  workspaces: Workspace[]
  selectedWorkspace: Workspace | null
  presets: Preset[]
  selectedPreset: Preset | null
  prompts: Prompt[],
  selectedPrompt: Prompt | null,
  setSelectedPrompt:  Dispatch<SetStateAction<Prompt | null>>
  setPrompts: Dispatch<SetStateAction<Prompt[]>>
  setSelectedPreset:  Dispatch<SetStateAction<Preset | null>>
  setPresets: Dispatch<SetStateAction<Preset[]>>
  setSelectedWorkspace: Dispatch<SetStateAction<Workspace | null>>
  setWorkspaces: Dispatch<SetStateAction<Workspace[]>> 
  setAvailableLocalModels: Dispatch<SetStateAction<LLM[]>>
  setChatSettings: Dispatch<SetStateAction<ChatSettings>>
  setAbortController: Dispatch<SetStateAction<AbortController | null>>
  setChatMessages: Dispatch<SetStateAction<Message[]>>
  setSelectedChat: Dispatch<SetStateAction<Chat | null>>
  setChats: Dispatch<SetStateAction<Chat[]>>
  setUserInput: Dispatch<SetStateAction<string>>
  setIsGenerating: Dispatch<SetStateAction<boolean>>
}
export const TalkifyContext = createContext<TalkifyContextProps>({
  chats: [],
  chatSettings: null,
  availableLocalModels: [],
  workspaces: [],
  selectedWorkspace: null,
  presets: [],
  selectedPreset: null,
  prompts: [],
  selectedPrompt: null,
  setSelectedPrompt: () => {},
  setPrompts: () => {},
  setSelectedPreset: () => {},
  setPresets: () => {},
  setSelectedWorkspace: () => {},
  setWorkspaces: () => {},
  setAvailableLocalModels: () => {},
  setChatSettings: () => {},
  setChats: () => {},
  userInput: "",
  selectedChat: null,
  chatMessages: [],
  setUserInput: () => {},
  setChatMessages: () => {},
  setSelectedChat: () => {},
  isGenerating: false,
  abortController: null,
  setIsGenerating: () => {},
  setAbortController: () => {},
})