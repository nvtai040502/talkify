// TODO: Separate into multiple contexts, keeping simple for now

"use client"

import { db } from "@/lib/db"
import { TalkifyContext } from "@/lib/hooks/context"
import { Chat } from "@prisma/client"
import { FC, useEffect, useState } from "react"

interface GlobalStateProps {
  children: React.ReactNode
}

export const GlobalState: FC<GlobalStateProps> = ({children}) => {
  const [userInput, setUserInput] = useState<string>("")
  const [chats, setChats] = useState<Chat[]>([])
  
  
    return (
    <TalkifyContext.Provider
      value={{
        userInput,
        setUserInput,
        chats,
        setChats
      }}
    >
      {children}
    </TalkifyContext.Provider>
  )
}