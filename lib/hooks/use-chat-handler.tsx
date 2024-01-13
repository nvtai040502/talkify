// Modified from https://github.com/mckaywrigley/chatbot-ui/blob/main/components/chat/chat-hooks/use-chat-handler.tsx
// import { updateMessage } from '@/app/actions';
import { updateMessage } from '@/app/actions';
import { db } from '@/lib/db';
import { Message } from 'ai';
import { UseChatHelpers } from 'ai/react/dist';
import { error } from 'console';
import { useRef } from 'react';

export const useChatHandler = () => {
  const chatInputRef = useRef<HTMLTextAreaElement>(null);

  const handleFocusChatInput = (userInput?: string) => {
    chatInputRef.current?.focus();
    
    // Move the cursor to the end of the text if there is existing text
    if (chatInputRef.current && userInput?.trim()) {
      const inputLength = userInput.length;
      chatInputRef.current.setSelectionRange(inputLength, inputLength);
    }
  };

  interface HandleSendEditProps extends Pick<UseChatHelpers, |'setMessages' |'messages' | 'reload' > {
    messageId: string;
    editedContent: string;
  }
  
  const handleSendEdit = async ({
    setMessages,
    messages,
    reload,
    editedContent,
    messageId
  }: HandleSendEditProps) => {
    const messageUpdated = await updateMessage(messageId, editedContent);
  
    if (!messageUpdated) return
  
    const lastMessage = messages[messages.length - 1];
  
    if (lastMessage && lastMessage.role === "assistant") {
      setMessages([...messages.slice(0, -2), messageUpdated]);
    } else if (lastMessage && lastMessage.role === "user") {
      setMessages([...messages.slice(0, -1), messageUpdated]);
    }
    reload()
  };

  return {
    chatInputRef,
    handleFocusChatInput,
    handleSendEdit
  };
};
