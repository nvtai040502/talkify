// Modified from https://github.com/mckaywrigley/chatbot-ui/blob/main/context/context.tsx
import { LLM } from "@/types/llms"
import { Chat, Message as PrismaMessage } from "@prisma/client"
import { Dispatch, SetStateAction, createContext } from "react"
import { Message as VercelMessage } from "ai"
interface TalkifyContextProps {
  userInput: string
  setUserInput: Dispatch<SetStateAction<string>>
}
export const TalkifyContext = createContext<TalkifyContextProps>({
  userInput: "",
  setUserInput: () => {},
})