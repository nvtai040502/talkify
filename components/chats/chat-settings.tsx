import { TalkifyContext } from "@/global/context"
import { LLM_LIST } from "@/constants/models/llm-list"
import { FC, useContext, useEffect, useRef } from "react"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { Button } from "../ui/button"
import { Icons } from "../icons"
import { ChatSettingsForm } from "./chat-settings-form"
import { Settings2, SlidersHorizontal } from "lucide-react"
import { ScrollArea } from "../ui/scroll-area"

interface ChatSettingsProps {}

export const ChatSettings: FC<ChatSettingsProps> = ({}) => {
  // useHotkey("i", () => handleClick())

  const { chatSettings, setChatSettings } = useContext(TalkifyContext)

  // const buttonRef = useRef<HTMLButtonElement>(null)

  // const handleClick = () => {
  //   if (buttonRef.current) {
  //     buttonRef.current.click()
  //   }
  // }

  useEffect(() => {
    if (!chatSettings) return

    setChatSettings(chatSettings)
  }, [chatSettings?.model])

  if (!chatSettings) return null

  const fullModel = LLM_LIST.find(llm => llm.modelId === chatSettings.model)

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          // ref={buttonRef}
          className="flex items-center space-x-2"
          variant="ghost"
        >
          <div className="text-xl">
            {fullModel?.modelName || chatSettings.model}
          </div>

          <Settings2 size={28} />
        </Button>
      </PopoverTrigger>

      <ScrollArea>
      <PopoverContent
        className="bg-background border-input relative flex max-h-[calc(100vh-60px)] w-[300px] flex-col space-y-4 overflow-auto rounded-lg border-2 p-6 sm:w-[400px] md:w-[500px] lg:w-[600px] dark:border-none"
        align="end"
      >

        <ChatSettingsForm
          chatSettings={chatSettings}
          onChangeChatSettings={setChatSettings}
        />
      </PopoverContent>
      </ScrollArea>
    </Popover>
  )
}