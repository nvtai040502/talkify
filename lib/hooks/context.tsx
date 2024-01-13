// Modified from https://github.com/mckaywrigley/chatbot-ui/blob/main/context/context.tsx
import { LLM } from "@/types/llms"
import { Chat } from "@prisma/client"
import { Dispatch, SetStateAction, createContext } from "react"

interface TalkifyContextProps {
  userInput: string
  setUserInput: Dispatch<SetStateAction<string>>
}
export const TalkifyContext = createContext<TalkifyContextProps>({
  userInput: "",
  setUserInput: () => {},
})