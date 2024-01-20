"use client"
import { TalkifyContext } from "@/global/context";
import { Icons } from "../icons";
import { TextareaAutosize } from "../ui/textarea-autosize";
import { useContext, useEffect } from "react";
import { useChatHandler } from "@/hooks/use-chat-handler";
import { cn } from "@/lib/utils";
import { KEYBOARD_SHORTCUT } from "@/config/keyboard-shortcut";
import useHotkey from "@/hooks/use-hotkey";

const ChatInput = () => {
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
    handleStopMessage,
  } = useChatHandler()
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault()
      handleSendMessage(userInput, chatMessages, false)
    }
  }
  const focusChatShortcut = KEYBOARD_SHORTCUT.find((item) => item.key === "FOCUS_CHAT");
  if (!focusChatShortcut) {
    console.log("may be the key in focus chat input will be changed")
  }

  useHotkey(focusChatShortcut!.keyboard, () => handleFocusChatInput(userInput))
  // fix bug not focus input when navigate from home page to chat page
  useEffect(() => {
    handleFocusChatInput()
  }, [])
  return ( 
    <>
      {/* <ChatFilesDisplay /> */}

      <div className="border-input relative mt-3 flex min-h-[60px] w-full items-center justify-center rounded-xl border-2">
        <div className="absolute bottom-[76px] left-0 max-h-[300px] w-full overflow-auto rounded-xl dark:border-none">
          {/* <ChatCommandInput /> */}
        </div>

        <>
          <Icons.add
            className="absolute bottom-[12px] left-3 cursor-pointer p-1 hover:opacity-50"
            size={32}
            // onClick={() => fileInputRef.current?.click()}
          />

          {/* Hidden input to select files from device */}
          {/* <Input
            ref={fileInputRef}
            className="hidden"
            type="file"
            onChange={e => {
              if (!e.target.files) return
              handleSelectDeviceFile(e.target.files[0])
            }}
            accept={filesToAccept}
          /> */}
        </>

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

        <div className="absolute bottom-[14px] right-3 cursor-pointer hover:opacity-50">
          {isGenerating ? (
            <Icons.stop
              className="p-1 bg-transparent rounded hover:bg-background animate-pulse"
              onClick={handleStopMessage}
              size={30}
            />
          ) : (
            <Icons.send
              className={cn(
                "bg-primary text-secondary rounded p-1",
                !userInput && "cursor-not-allowed opacity-50"
              )}
              onClick={() => {
                if (!userInput) return

                handleSendMessage(userInput, chatMessages, false)
              }}
              size={30}
            />
          )}
        </div>
      </div>
    </>
   );
}
 
export default ChatInput;