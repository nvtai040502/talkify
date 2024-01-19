import { Icons } from "@/components/icons"
import { LLM_LIST } from "@/constants/models/llm-list"
import { TalkifyContext } from "@/global/context"
import { cn } from "@/lib/utils"
import { Chat } from "@prisma/client"
import { IconRobotFace } from "@tabler/icons-react"
import Image from "next/image"
import { useParams, useRouter } from "next/navigation"
import { FC, useContext, useRef, useState } from "react"
import { UpdateChat } from "./update-chat"
import { DeleteChat } from "./delete-chat"
import Link from "next/link"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface ChatItemProps {
  chat: Chat
}

export const ChatItem: FC<ChatItemProps> = ({ chat }) => {
  const {
    selectedChat,
    availableLocalModels,
  } = useContext(TalkifyContext)

  const router = useRouter()
  const params = useParams()
  const isActive = params.chatid === chat.id || selectedChat?.id === chat.id
  const [isHovered, setIsHovered] = useState(false);

  const handleHoverEnter = () => {
    setIsHovered(true);
  };

  const handleHoverLeave = () => {
    setIsHovered(false);
  };

  return (
    <Link
      className={cn(
        "hover:bg-accent focus:bg-accent flex w-full cursor-pointer items-center rounded p-2 hover:opacity-50 focus:outline-none",
        isActive && "bg-accent"
      )}
      href={`/chat/${chat.id}`}
      tabIndex={0}
      onMouseEnter={handleHoverEnter} 
      onMouseLeave={handleHoverLeave}
    >
      <TooltipProvider>
        <Tooltip delayDuration={200}> 
          <TooltipTrigger><Icons.robot height={30} width={30} /></TooltipTrigger>  
          <TooltipContent side="right"><div>{"modelName"}</div></TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <div className="flex-1 ml-3 text-sm font-semibold truncate">
        {chat.name}
      </div>

      {/* Not implement for delete/update chat when hover yet */}
      {(isHovered || isActive ) && (
        <div
          onClick={e => {
            e.stopPropagation()
            e.preventDefault()
          }}
          className="flex ml-2 space-x-2"
        >
          <UpdateChat chat={chat} />

          <DeleteChat chat={chat} />
        </div>
      )}
    </Link>
  )
}