// Modified from https://github.com/mckaywrigley/chatbot-ui/blob/main/context/context.tsx
import { Chat, Message, Workspace } from "@prisma/client"
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