// Modified from https://github.com/mckaywrigley/chatbot-ui/blob/main/components/chat/chat-hooks/use-chat-handler.tsx
import { UseChatHelpers } from 'ai/react/dist';
import { useContext, useRef } from 'react';
import { TalkifyContext } from './context';
import { getVercelMessagesUpdated } from '@/app/actions';

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
  };
};
