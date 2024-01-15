// Modified from https://github.com/mckaywrigley/chatbot-ui/blob/main/components/chat/chat-hooks/use-chat-handler.tsx
import { UseChatHelpers } from 'ai/react/dist';
import { useContext, useRef } from 'react';
import { TalkifyContext } from './context';
import { createChat, createMessage, getVercelMessagesUpdated } from '@/app/actions';
import toast from 'react-hot-toast';
import { v4 as uuidV4 } from 'uuid';
import { Chat, Message } from '@prisma/client';
import { ChatMessages } from '@/components/chats/chat-messages';
import { db } from '../db';

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
        "Model not found. Make sure you have it downloaded via Ollama."
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
  const createdChat = await createChat(messageContent.substring(0, 100), "")
  
  setSelectedChat(createdChat)
  setChats(chats => [createdChat, ...chats])

  return createdChat
}

export const useChatHandler = () => {
  const chatInputRef = useRef<HTMLTextAreaElement>(null);
  const {
    userInput,
    setUserInput,
    setAbortController,
    setIsGenerating,
    setChatMessages,
    setChats,
    setSelectedChat,

    selectedChat
  } = useContext(TalkifyContext)

 function createTempMessages (
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
const handleCreateMessages = async (
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
    // const lastStartingMessage = chatMessages[chatMessages.length - 1]

    // const updatedMessage = await db.message.update({
    //   where: {
    //     id: lastStartingMessage.id
    //   }, data: {
    //     ...lastStartingMessage,
    //     content: generatedText
    //   }
    // })
    // // })
    // chatMessages[chatMessages.length - 1] = updatedMessage

    // finalChatMessages = [...chatMessages]

    // setChatMessages(finalChatMessages)
  } else {
    
    finalChatMessages = [
      ...chatMessages,
      finalUserMessage,
      finalAssistantMessage
    ]
    setChatMessages(finalChatMessages)
  }
}


  const handleSendMessage = async (
    messageContent: string,
    chatMessages: Message[],
    isRegeneration: boolean
    ) => {
    const startingInput = messageContent
  
    try {
      setUserInput("")
      setIsGenerating(true)
      
      const newAbortController = new AbortController()
      setAbortController(newAbortController)
  
      if (!messageContent) {
        throw new Error("Message content not found")
      }
  
      let currentChat = selectedChat ? { ...selectedChat } : null
      
      const { tempUserChatMessage, tempAssistantChatMessage } = createTempMessages(
        messageContent,
        chatMessages,
        isRegeneration,
        setChatMessages
        )
        
      
      const payload: {chatMessages: Message[]} = {
        chatMessages: isRegeneration
          ? [...chatMessages]
          : [...chatMessages, tempUserChatMessage],
      }
      
      let generatedText = ""
  
        generatedText = await handleHostedChat(
          payload,
          tempAssistantChatMessage,
          isRegeneration,
          newAbortController,
          setIsGenerating,
          setChatMessages,
        )
        if (!currentChat) {
          currentChat = await handleCreateChat(
            messageContent,
            setSelectedChat,
            setChats,
          )
          window.history.pushState({}, "", `chat/${currentChat.id}`)
          
            
        
      } else {
        console.log("?")
        // const updatedChat = await db.chat.update({
        //   where: {
        //     id: currentChat.id
        //   }, data: {
        //     updatedAt: new Date().toISOString()
        //   }
        // })
          
  
        // setChats(prevChats => {
        //   const updatedChats = prevChats.map(prevChat =>
        //     prevChat.id === updatedChat.id ? updatedChat : prevChat
        //   )
  
        //   return updatedChats
        // })
      }
  
     await handleCreateMessages(
        chatMessages,
        currentChat,
        messageContent,
        generatedText,
        isRegeneration,
        setChatMessages,
      )
      setIsGenerating(false)
      setUserInput("")
    } catch (error) {
      setIsGenerating(false)
      setUserInput(startingInput)
    }
  }
  const handleFocusChatInput = (userInput?: string) => {
    chatInputRef.current?.focus();
    
    // Move the cursor to the end of the text if there is existing text
    if (chatInputRef.current && userInput?.trim()) {
      const inputLength = userInput.length;
      chatInputRef.current.setSelectionRange(inputLength, inputLength);
    }
  };

  
  const handleNewChat = () => {
    setUserInput("")
    setChatMessages([])
    setSelectedChat(null)
    setIsGenerating(false)
  }
  interface HandleSendEditProps extends Pick<UseChatHelpers, |'setMessages' | 'reload' > {
    messageId: string;
    editedContent: string;
    chatId: string
  }
  
  const handleSendEdit = async ({
    setMessages,
    reload,
    chatId,
    editedContent,
    messageId
  }: HandleSendEditProps) => {
    const vercelMessagesUpdated = await getVercelMessagesUpdated({
      messageId,
      editedContent,
      chatId
    })

    if (vercelMessagesUpdated.length) {
      setMessages(vercelMessagesUpdated)
      reload()
    }

  };

  return {
    chatInputRef,
    handleFocusChatInput,
    handleSendEdit,
    handleSendMessage,
    handleNewChat
  };
};
