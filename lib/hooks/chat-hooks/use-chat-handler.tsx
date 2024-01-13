// Modified from https://github.com/mckaywrigley/chatbot-ui/blob/main/components/chat/chat-hooks/use-chat-handler.tsx
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

  return {
    chatInputRef,
    handleFocusChatInput
  };
};
