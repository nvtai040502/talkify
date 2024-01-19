// just used for hooks use-chat-handler

import { Chat, Message, Workspace } from "@prisma/client"
import toast from "react-hot-toast"
import { createChat } from "../actions/chats"
import { v4 as uuidV4 } from 'uuid';
import { createMessage, updateMessage } from "@/actions/messages";
import { buildFinalMessages } from "@/utils/built-prompt";
import { ChatPayload } from "@/types/chat";

export const handleHostedChat = async (
  payload: ChatPayload,
  tempAssistantChatMessage: Message,
  isRegeneration: boolean,
  newAbortController: AbortController,
  setIsGenerating: React.Dispatch<React.SetStateAction<boolean>>,
  setChatMessages: React.Dispatch<React.SetStateAction<Message[]>>,
) => {
  // console.log(payload.chatSettings)
  const formattedMessages = await buildFinalMessages(payload)
  // console.log(formattedMessages)

  const response = await fetchChatResponse(
    `/api/chat/hosted/hf`,
    {
      messages: formattedMessages
    },
    newAbortController,
    true,
    setIsGenerating,
    setChatMessages
  )
  return await processResponse(
    response,
    isRegeneration
      ? payload.chatMessages[payload.chatMessages.length - 1]
      : tempAssistantChatMessage,
    true,
    newAbortController,
    setChatMessages,
  )
}


export const handleLocalChat = async (
  payload: ChatPayload,
  tempAssistantMessage: Message,
  isRegeneration: boolean,
  newAbortController: AbortController,
  setIsGenerating: React.Dispatch<React.SetStateAction<boolean>>,
  setChatMessages: React.Dispatch<React.SetStateAction<Message[]>>,
) => {

  const formattedMessages = await buildFinalMessages(payload)
  const response = await fetchChatResponse(
    process.env.NEXT_PUBLIC_OLLAMA_URL + "/api/chat",
    // "/api/chat/localhost/ollama", it's won't work when i try to using langchain and ollama, so weird 
    {
      model: payload.chatSettings.model,
      messages: formattedMessages,
      options: {
        "temperature": payload.chatSettings.temperature,
        // "top_k": payload.chatSettings.topK,
        // "top_p": payload.chatSettings.topP,
        // "num_predict": payload.chatSettings.maxTokens,
        // "repeat_penalty": payload.chatSettings.repetitionPenalty,
      }
    },
    newAbortController,
    false,
    setIsGenerating,
    setChatMessages
  )

  return await processResponse(
    response,
    isRegeneration
      ? payload.chatMessages[payload.chatMessages.length - 1]
      : tempAssistantMessage,
    false,
    newAbortController,
    setChatMessages,
  )
}


export const fetchChatResponse = async (
  url: string,
  body: object,
  controller: AbortController,
  isHosted: boolean,
  setIsGenerating: React.Dispatch<React.SetStateAction<boolean>>,
  setChatMessages: React.Dispatch<React.SetStateAction<Message[]>>
) => {
  const response = await fetch(url, {
    method: "POST",
    body: JSON.stringify(body),
    signal: controller.signal
  })
  
  if (!response.ok) {
    if (response.status === 404 && !isHosted) {
      toast.error(
        "Model not found. Make sure you have it downloaded via Ollama."
      )
    }

    const errorData = await response.json()

    toast.error(errorData.message)

    setIsGenerating(false)
    setChatMessages(prevMessages => prevMessages.slice(0, -2))
  }
  console.log(response.body)
  return response
}

export async function consumeReadableStream(
  stream: ReadableStream<Uint8Array>,
  callback: (chunk: string) => void,
  signal: AbortSignal
): Promise<void> {
  const reader = stream.getReader()
  const decoder = new TextDecoder()
  // console.log("🚀 ~ await reader.read():", reader)

  signal.addEventListener("abort", () => reader.cancel(), { once: true })

  try {
    while (true) {
      const { done, value } = await reader.read()
      
      if (done) {
        break
      }

      if (value) {
        // console.log(decoder.decode(value))
        callback(decoder.decode(value))
      }
    }
  } catch (error) {
    if (signal.aborted) {
      console.error("Stream reading was aborted:", error)
      // alert("Aborted!");
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
  isHosted: boolean,
  controller: AbortController,
  setChatMessages: React.Dispatch<React.SetStateAction<Message[]>>,
) => {
  let fullText = ""
  let contentToAdd = ""

  if (response.body) {
    // console.log("🚀 ~ response.body:", response.body)
    
    await consumeReadableStream(
      response.body,
      chunk => {
        try {
          contentToAdd = isHosted ? chunk : JSON.parse(chunk).message.content
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
    console.log(fullText)

    return fullText
  } else {
    throw new Error("Response body is null")
  }
}



export const handleCreateChat = async (
  selectedWorkspace: Workspace,
  messageContent: string,
  setSelectedChat: React.Dispatch<React.SetStateAction<Chat | null>>,
  setChats: React.Dispatch<React.SetStateAction<Chat[]>>,
) => {
  const createdChat = await createChat(selectedWorkspace.id, messageContent.substring(0, 100))
  
  setSelectedChat(createdChat)
  setChats(chats => [createdChat, ...chats])

  return createdChat
}

export function createTempMessages (
  messageContent: string,
  chatMessages: Message[],
  isRegeneration: boolean,
  setChatMessages: React.Dispatch<React.SetStateAction<Message[]>>
) {
  let tempUserChatMessage: Message = {
      chatId: "",
      id: uuidV4(),
      sequence_number: chatMessages.length,
      createdAt: new Date(),
      updatedAt: new Date(),
      content: messageContent,
      role: "user",
  }

  let tempAssistantChatMessage: Message = {
      chatId: "",
      content: "",
      createdAt: new Date(),
      id: uuidV4(),
      role: "assistant",
      sequence_number: chatMessages.length + 1,
      updatedAt: new Date(),
  }

  let newMessages = []

  if (isRegeneration) {
    const lastMessageIndex = chatMessages.length - 1
    chatMessages[lastMessageIndex].content = ""
    newMessages = [...chatMessages]
  } else {
    newMessages = [
      ...chatMessages,
      tempUserChatMessage,
      tempAssistantChatMessage
    ]
  }

  setChatMessages(newMessages)

  return {
    tempUserChatMessage,
    tempAssistantChatMessage
  }
}

export const handleCreateMessages = async (
  chatMessages: Message[],
  currentChat: Chat,
  messageContent: string,
  generatedText: string,
  isRegeneration: boolean,
  setChatMessages: React.Dispatch<React.SetStateAction<Message[]>>,
) => {
  const finalUserMessage = await createMessage({
      content: messageContent,
      chatId: currentChat.id,
      sequence_number: chatMessages.length,
      role: "user"
  })

  const finalAssistantMessage = await createMessage({
      chatId: currentChat.id,
      content: generatedText,
      sequence_number: chatMessages.length,
      role: "assistant",
  })

  let finalChatMessages: Message[] = []

  if (isRegeneration) {
    const lastStartingMessage = chatMessages[chatMessages.length - 1]

    const updatedMessage = await updateMessage(lastStartingMessage.id, generatedText)
    chatMessages[chatMessages.length - 1] = updatedMessage

    finalChatMessages = [...chatMessages]

    setChatMessages(finalChatMessages)
  } else {
    
    finalChatMessages = [
      ...chatMessages,
      finalUserMessage,
      finalAssistantMessage
    ]
    setChatMessages(finalChatMessages)
  }
}

