// Modified from https://github.com/mckaywrigley/chatbot-ui/blob/main/context/context.tsx
import { LLM } from "@/types/llms"
import { Chat, Message, Message as PrismaMessage } from "@prisma/client"
import { Dispatch, SetStateAction, createContext } from "react"
import { Message as VercelMessage } from "ai"
interface TalkifyContextProps {
  userInput: string
  isGenerating: boolean
  chats: Chat[]
  chatMessages: Message[]
  selectedChat: Chat | null
  abortController: AbortController | null
  setAbortController: Dispatch<SetStateAction<AbortController | null>>
  setChatMessages: Dispatch<SetStateAction<Message[]>>
  setSelectedChat: Dispatch<SetStateAction<Chat | null>>
  setChats: Dispatch<SetStateAction<Chat[]>>
  setUserInput: Dispatch<SetStateAction<string>>
  setIsGenerating: Dispatch<SetStateAction<boolean>>
}
export const TalkifyContext = createContext<TalkifyContextProps>({
  chats: [],
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