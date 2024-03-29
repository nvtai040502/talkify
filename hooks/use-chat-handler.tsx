// Modified from https://github.com/mckaywrigley/chatbot-ui/blob/main/components/chat/chat-hooks/use-chat-handler.tsx
import { useContext, useRef } from 'react';
import { TalkifyContext } from '../global/context';
import { Chat, Message } from '@prisma/client';
import { createMessage, deleteMessagesIncludingAndAfter, updateMessage } from '@/actions/messages';
import { createTempMessages, handleCreateChat, handleCreateMessages, handleHostedChat, handleLocalChat } from '@/hooks/chat-helpers';
import { deleteChat, updateChat } from '@/actions/chats';
import { LLM_LIST } from '@/constants/models/llm-list';
import { ChatPayload } from '@/types/chat';
import { useRouter } from 'next/navigation';

export const useChatHandler = () => {
  const chatInputRef = useRef<HTMLTextAreaElement>(null);
  const {
    userInput,
    setUserInput,
    setAbortController,
    abortController,
    availableLocalModels,
    setIsGenerating,
    selectedWorkspace,
    setChatMessages,
    setChats,
    setSelectedChat,
    chatMessages,
    chatSettings,
    selectedChat
  } = useContext(TalkifyContext)
  const router = useRouter()
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
  
      
      if (!chatSettings) {
        throw new Error("Chat Settings not found")
      }
      const modelData = [
        ...LLM_LIST,
        ...availableLocalModels,
      ].find(llm => llm.modelId === chatSettings.model)

      if (!messageContent) {
        throw new Error("Message content not found")
      }
      if (!modelData) {
        throw new Error("Model not found")
      }

      if (!selectedWorkspace) {
        throw new Error("WorkSpace not found")
      }
      
      let currentChat = selectedChat ? { ...selectedChat } : null
      
      const { tempUserChatMessage, tempAssistantChatMessage } = createTempMessages(
        messageContent,
        chatMessages,
        isRegeneration,
        setChatMessages
        )
        
      
      const payload: ChatPayload = {
        chatMessages: isRegeneration
          ? [...chatMessages]
          : [...chatMessages, tempUserChatMessage],
        chatSettings: chatSettings,
        workspaceInstructions: selectedWorkspace.instructions || "",
        }
      
      let generatedText = ""
        
        if (modelData.provider === "ollama") {
            generatedText = await handleLocalChat(
            payload,
            tempAssistantChatMessage,
            isRegeneration,
            newAbortController,
            setIsGenerating,
            setChatMessages,
          )
        } else if (modelData.provider === "hf") {
            generatedText = await handleHostedChat(
            payload,
            tempAssistantChatMessage,
            isRegeneration,
            newAbortController,
            setIsGenerating,
            setChatMessages,
          )
        }
        if (!currentChat) {
          currentChat = await handleCreateChat(
            selectedWorkspace!,
            messageContent,
            setSelectedChat,
            setChats,
          )
          window.history.pushState({}, "", `/chat/${currentChat.id}`)
          
        
      } else {
        // console.log(currentChat.name)
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
      console.log('aborting...');
    }
  }

  const handleNewChat = (isPush?: boolean) => {
    setUserInput("")
    setChatMessages([])
    setSelectedChat(null)
    setIsGenerating(false)
    if (isPush) {
      router.push("/")
    }
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


  return {
    chatInputRef,
    handleFocusChatInput,
    handleSendEdit,
    handleSendMessage,
    handleNewChat,
    handleStopMessage,
  };
};
