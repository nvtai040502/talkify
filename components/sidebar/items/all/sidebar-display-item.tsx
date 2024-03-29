import { TalkifyContext } from "@/global/context"
import { cn } from "@/lib/utils"
import { ContentType } from "@/types/content"
import { DataItemType } from "@/types/sidebar-data"
import { useRouter } from "next/navigation"
import { FC, useContext, useRef, useState } from "react"
import { SidebarUpdateItem } from "./sidebar-update-item"

interface SidebarItemProps {
  item: DataItemType
  contentType: ContentType
  icon: React.ReactNode
  updateState: any
  renderInputs: (renderState: any) => JSX.Element
  isTyping: boolean
}

export const SidebarItem: FC<SidebarItemProps> = ({
  item,
  contentType,
  updateState,
  renderInputs,
  icon,
  isTyping
}) => {
  const { selectedWorkspace, setChats, 
    // setSelectedAssistant 
  } =
    useContext(TalkifyContext)

  const router = useRouter()

  const itemRef = useRef<HTMLDivElement>(null)

  const [isHovering, setIsHovering] = useState(false)

  const actionMap = {
    chats: async (item: any) => {},
    presets: async (item: any) => {},
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter") {
      e.stopPropagation()
      itemRef.current?.click()
    }
  }

  // const handleClickAction = async (
  //   e: React.MouseEvent<SVGSVGElement, MouseEvent>
  // ) => {
  //   e.stopPropagation()

  //   const action = actionMap[contentType]

  //   await action(item as any)
  // }

  return (
    <SidebarUpdateItem
      item={item}
      contentType={contentType}
      updateState={updateState}
      renderInputs={renderInputs}
      isTyping={isTyping}
    >
      <div
        ref={itemRef}
        className={cn(
          "hover:bg-accent flex w-full cursor-pointer items-center rounded p-2 hover:opacity-50 focus:outline-none"
        )}
        tabIndex={0}
        onKeyDown={handleKeyDown}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        {icon}

        <div className="flex-1 ml-3 text-sm font-semibold truncate">
          {item.name}
        </div>

        {/* TODO */}
        {/* {isHovering && (
          <WithTooltip
            delayDuration={1000}
            display={<div>Start chat with {contentType.slice(0, -1)}</div>}
            trigger={
              <IconSquarePlus
                className="cursor-pointer hover:text-blue-500"
                size={20}
                onClick={handleClickAction}
              />
            }
          />
        )} */}
      </div>
    </SidebarUpdateItem>
  )
}