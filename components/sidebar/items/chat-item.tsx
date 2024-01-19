import { Icons } from "@/components/icons"
import { WithTooltip } from "@/components/ui/with-tooltip"
import { LLM_LIST } from "@/constants/models/llm-list"
import { TalkifyContext } from "@/global/context"
import { cn } from "@/lib/utils"
import { Chat } from "@prisma/client"
import { IconRobotFace } from "@tabler/icons-react"
import Image from "next/image"
import { useParams, useRouter } from "next/navigation"
import { FC, useContext, useRef } from "react"

interface ChatItemProps {
  chat: Chat
}

export const ChatItem: FC<ChatItemProps> = ({ chat }) => {
  const {
    selectedChat,
    availableLocalModels,
    // assistantImages,
    // availableOpenRouterModels
  } = useContext(TalkifyContext)

  const router = useRouter()
  const params = useParams()
  const isActive = params.chatid === chat.id || selectedChat?.id === chat.id

  const itemRef = useRef<HTMLDivElement>(null)

  const handleClick = () => {
    router.push(`/chat/${chat.id}`)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter") {
      e.stopPropagation()
      itemRef.current?.click()
    }
  }

  // const MODEL_DATA = [
  //   ...LLM_LIST,
  //   ...availableLocalModels,
  //   // ...availableOpenRouterModels
  // ].find(llm => llm.modelId === chat.model) as LLM

  // const assistantImage = assistantImages.find(
  //   image => image.assistantId === chat.assistant_id
  // )?.base64

  return (
    <div
      ref={itemRef}
      className={cn(
        "hover:bg-accent focus:bg-accent flex w-full cursor-pointer items-center rounded p-2 hover:opacity-50 focus:outline-none",
        isActive && "bg-accent"
      )}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onClick={handleClick}
    >
      {/* {chat.assistant_id ? (
        assistantImage ? (
          <Image
            className="rounded"
            src={assistantImage}
            alt="Assistant image"
            width={30}
            height={30}
          />
        ) : (
          <IconRobotFace
            className="bg-primary text-secondary border-primary rounded border-[1px] p-1"
            size={30}
          />
        )
      ) : ( */}
        <WithTooltip
          delayDuration={200}
          display={<div>{"modelName"}</div>}
          trigger={
            <Icons.robot height={30} width={30} />
          }
        />
      {/* )} */}

      <div className="flex-1 ml-3 text-sm font-semibold truncate">
        {chat.name}
      </div>

      {isActive && (
        <div
          onClick={e => {
            e.stopPropagation()
            e.preventDefault()
          }}
          className="flex ml-2 space-x-2"
        >
          {/* <UpdateChat chat={chat} />

          <DeleteChat chat={chat} /> */}
        </div>
      )}
    </div>
  )
}