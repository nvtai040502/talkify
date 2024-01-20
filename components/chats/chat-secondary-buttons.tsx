import { IconInfoCircle, IconMessagePlus } from "@tabler/icons-react"
import { FC, useContext } from "react"
import { WithTooltip } from "../ui/with-tooltip"
import { TalkifyContext } from "@/global/context"
import { useChatHandler } from "@/hooks/use-chat-handler"

interface ChatSecondaryButtonsProps {}

export const ChatSecondaryButtons: FC<ChatSecondaryButtonsProps> = ({}) => {
  const { selectedPreset, chatSettings, selectedChat } = useContext(TalkifyContext)

  const { handleNewChat } = useChatHandler()

  return (
    <>
      {selectedChat && (
        <>
          <WithTooltip
            delayDuration={200}
            display={
              <div>
                <div>Chat info</div>
                <div>{chatSettings?.model}</div>
                <div>{chatSettings?.prompt}</div>

                <div>{chatSettings?.temperature}</div>

                <div>{chatSettings?.includeWorkspaceInstructions}</div>
              </div>
            }
            trigger={
              <div className="mt-1">
                <IconInfoCircle
                  className="cursor-pointer hover:opacity-50"
                  size={24}
                />
              </div>
            }
          />

          <WithTooltip
            delayDuration={200}
            display={<div>Start a new chat</div>}
            trigger={
              <div className="mt-1">
                <IconMessagePlus
                  className="cursor-pointer hover:opacity-50"
                  size={24}
                  onClick={() => handleNewChat(true)}
                />
              </div>
            }
          />
        </>
      )}

      {/* TODO */}
      {/* <ShareMenu item={selectedChat} contentType="chats" /> */}
    </>
  )
}