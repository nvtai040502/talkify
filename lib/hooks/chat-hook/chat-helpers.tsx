// just used for hooks use-chat-handler

import { Chat, Message } from "@prisma/client"
import toast from "react-hot-toast"
import { createChat } from "../../../actions/chats"

export const fetchChatResponse = async (
  url: string,
  body: object,
  controller: AbortController,
  setIsGenerating: React.Dispatch<React.SetStateAction<boolean>>,
  setChatMessages: React.Dispatch<React.SetStateAction<Message[]>>
) => {
  const response = await fetch(url, {
    method: "POST",
    body: JSON.stringify(body),
    signal: controller.signal
  })
  
  if (!response.ok) {
    if (response.status === 404) {
      toast.error(
        "Model not found."
      )
    }

    const errorData = await response.json()

    toast.error(errorData.message)

    setIsGenerating(false)
    setChatMessages(prevMessages => prevMessages.slice(0, -2))
  }

  return response
}

export async function consumeReadableStream(
  stream: ReadableStream<Uint8Array>,
  callback: (chunk: string) => void,
  signal: AbortSignal
): Promise<void> {
  const reader = stream.getReader()
  const decoder = new TextDecoder()

  signal.addEventListener("abort", () => reader.cancel(), { once: true })

  try {
    while (true) {
      const { done, value } = await reader.read()
      if (done) {
        break
      }

      if (value) {
        callback(decoder.decode(value))
      }
    }
  } catch (error) {
    if (signal.aborted) {
      console.error("Stream reading was aborted:", error)
    } else {
      console.error("Error consuming stream:", error)
    }
  } finally {
    reader.releaseLock()
  }
}

export const processResponse = async (
  response: Response,
  lastChatMessage: Message,
  controller: AbortController,
  setChatMessages: React.Dispatch<React.SetStateAction<Message[]>>,
) => {
  let fullText = ""
  let contentToAdd = ""

  if (response.body) {
    await consumeReadableStream(
      response.body,
      chunk => {
        try {
          contentToAdd = chunk
          fullText += contentToAdd
          // console.log(fullText)
        } catch (error) {
          console.error("Error parsing JSON:", error)
        }

        setChatMessages(prev =>
          prev.map(chatMessage => {
            if (chatMessage.id === lastChatMessage.id) {
              const updatedChatMessage: Message = {
                  ...chatMessage,
                  content: chatMessage.content + contentToAdd
              }

              return updatedChatMessage
            }

            return chatMessage
          })
        )
      },
      controller.signal
    )
    // console.log(fullText)

    return fullText
  } else {
    throw new Error("Response body is null")
  }
}
export const handleHostedChat = async (
  payload: {chatMessages: Message[]},
  tempAssistantChatMessage: Message,
  isRegeneration: boolean,
  newAbortController: AbortController,
  setIsGenerating: React.Dispatch<React.SetStateAction<boolean>>,
  setChatMessages: React.Dispatch<React.SetStateAction<Message[]>>,
) => {
    

  const response = await fetchChatResponse(
    `/api/chat/hf/test`,
    {
      messages: payload.chatMessages
    },
    newAbortController,
    setIsGenerating,
    setChatMessages
  )
  const fullText = await processResponse(
    response,
    isRegeneration
      ? payload.chatMessages[payload.chatMessages.length - 1]
      : tempAssistantChatMessage,
    newAbortController,
    setChatMessages,
  )

  return fullText
}



export const handleCreateChat = async (
  messageContent: string,
  setSelectedChat: React.Dispatch<React.SetStateAction<Chat | null>>,
  setChats: React.Dispatch<React.SetStateAction<Chat[]>>,
) => {
  const createdChat = await createChat(messageContent.substring(0, 100))
  
  setSelectedChat(createdChat)
  setChats(chats => [createdChat, ...chats])

  return createdChat
}