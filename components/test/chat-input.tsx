"use client"
import { TalkifyContext } from "@/global/context";
import { Icons } from "../icons";
import { TextareaAutosize } from "../ui/textarea-autosize";
import { useContext, useEffect } from "react";
import { useChatHandler } from "@/hooks/use-chat-handler";
import { cn } from "@/lib/utils";

const ChatInputTest = () => {
  const {
    userInput,
    chatMessages,
    setUserInput,
    isGenerating,
  } = useContext(TalkifyContext)
  const {
    chatInputRef,
    handleSendMessage,
    handleFocusChatInput,
    handleStopMessage
  } = useChatHandler()
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault()
      handleSendMessage(userInput, chatMessages, false)
    }

    
  }
  useEffect(() => {
    handleFocusChatInput()
  }, [])
  return ( 
    <>
        <TextareaAutosize
          textareaRef={chatInputRef}
          className="flex w-full py-2 bg-transparent border-none rounded-md resize-none ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring text-md px-14 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
          placeholder={`Ask anything. Type "@" for files. Type "/" for prompts.`}
          onValueChange={(value: string) => setUserInput(value)}
          value={userInput}
          minRows={1}
          maxRows={18}
          onKeyDown={handleKeyDown}
          // onPaste={handlePaste}
        />
       
    </>
   );
}
 
export default ChatInputTest;