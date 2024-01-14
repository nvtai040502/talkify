// Modified from https://github.com/mckaywrigley/chatbot-ui/blob/main/components/chat/chat-hooks/use-chat-handler.tsx
import { getUpdatedUserMessages, updateMessage } from '@/app/actions';
import { db } from '@/lib/db';
import { v4 as uuidV4 } from 'uuid';
import { Message as VercelMessage } from 'ai';
import { UseChatHelpers } from 'ai/react/dist';
import { error } from 'console';
import { useContext, useRef } from 'react';
import { TalkifyContext } from './context';

export const useChatHandler = () => {
  const { setPrismaChatMessages } = useContext(TalkifyContext)
  const chatInputRef = useRef<HTMLTextAreaElement>(null);

  // const handleSendMessage = async (
  //   chatId: string,
  //   vercelMessages: VercelMessage[]
  // ) => {
  //   const existingChat = await db.chat.findUnique({
  //     where: { id: chatId},
  //   });
  //   if (existingChat) {
  //     // If the chat exists, update its messages
  //   const lastMessage = vercelMessages[-1]
  //     if (lastMessage.role === "assistant") {
  //       await db.message.create({
  //         data: {
  //           content: lastMessage.content,
  //           role: "assistant",
  //           chatId,
  //         },
  //       });
  //     }
  //   } else {
  //     // If the chat doesn't exist, create a new chat with messages
  //     const name = vercelMessages[0].content.substring(0, 100);
  //     const allMessages = vercelMessages.map((message: VercelMessage) => ({ 
  //       id: uuidV4(),
  //       content: message.content, 
  //       role: message.role,
  //       chatId 
  //     }));

  //     await db.chat.create({
  //       data: { 
  //         id: chatId, 
  //         name: name, 
  //         path: `/chat/${chatId}` 
  //       },
  //     });

  //     await db.message.createMany({
  //       data: allMessages,
  //     });
  
  //     // Fetch the newly created messages using findMany
  //     const createdMessages = await db.message.findMany({
  //       where: {
  //         id: { in: prismaMessages },
  //       },
  //     });
  
  //     setPrismaChatMessages(createdMessages);
  //   }
  // }
  const handleFocusChatInput = (userInput?: string) => {
    chatInputRef.current?.focus();
    
    // Move the cursor to the end of the text if there is existing text
    if (chatInputRef.current && userInput?.trim()) {
      const inputLength = userInput.length;
      chatInputRef.current.setSelectionRange(inputLength, inputLength);
    }
  };

  interface HandleSendEditProps extends Pick<UseChatHelpers, |'setMessages' | 'reload' > {
    indexMessage: number;
    editedContent: string;
    chatId: string
  }
  
  const handleSendEdit = async ({
    setMessages,
    reload,
    chatId,
    editedContent,
    indexMessage
  }: HandleSendEditProps) => {
    const updatedUserMessages = await getUpdatedUserMessages({
      indexMessage,
      editedContent,
      chatId
    })

    if (updatedUserMessages.length) {
      setMessages(updatedUserMessages)
      reload()
    }

  };

  return {
    chatInputRef,
    handleFocusChatInput,
    handleSendEdit,
    // handleSendMessage
  };
};
