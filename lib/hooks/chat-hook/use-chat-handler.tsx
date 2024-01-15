// Modified from https://github.com/mckaywrigley/chatbot-ui/blob/main/components/chat/chat-hooks/use-chat-handler.tsx
import { useContext, useRef } from 'react';
import { TalkifyContext } from '../context';
import toast from 'react-hot-toast';
import { v4 as uuidV4 } from 'uuid';
import { Chat, Message } from '@prisma/client';
import { ChatMessages } from '@/components/chats/chat-messages';
import { db } from '../../db';
import { createMessage, deleteMessagesIncludingAndAfter, updateMessage } from '@/actions/messages';
import { handleCreateChat, handleHostedChat } from '@/lib/hooks/chat-hook/chat-helpers';
import { deleteChat, updateChat } from '@/actions/chats';

export const useChatHandler = () => {
  const chatInputRef = useRef<HTMLTextAreaElement>(null);
  const {
    userInput,
    setUserInput,
    setAbortController,
    abortController,
    setIsGenerating,
    setChatMessages,
    setChats,
    setSelectedChat,
    chatMessages,
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
          window.history.pushState({}, "", `/chat/${currentChat.id}`)
          
          // console.log("11111111111")
        
      } else {
        console.log(currentChat.name)
        const updatedChat = await updateChat(currentChat.id)
        setChats(prevChats => {
          const updatedChats = prevChats.map(prevChat =>
            prevChat.id === updatedChat.id ? updatedChat : prevChat
          )
  
          return updatedChats
        })
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

  const handleStopMessage = () => {
    if (abortController) {
      abortController.abort()
    }
  }

  const handleNewChat = () => {
    setUserInput("")
    setChatMessages([])
    setSelectedChat(null)
    setIsGenerating(false)
  }
  
  const handleSendEdit = async (
    editedContent: string,
    sequenceNumber: number
  ) => {
    if (!selectedChat) return

    await deleteMessagesIncludingAndAfter(
      selectedChat.id,
      sequenceNumber
    )

    const filteredMessages = chatMessages.filter(
      chatMessage => chatMessage.sequence_number < sequenceNumber
    )

    setChatMessages(filteredMessages)

    handleSendMessage(editedContent, filteredMessages, false)
  }

  const handleRemoveChat = async (id: string) => {
    await deleteChat(id)

    setChats(prevState => prevState.filter(c => c.id !== id))

    handleNewChat()
  }

  return {
    chatInputRef,
    handleFocusChatInput,
    handleSendEdit,
    handleSendMessage,
    handleNewChat,
    handleStopMessage,
    handleRemoveChat
  };
};
