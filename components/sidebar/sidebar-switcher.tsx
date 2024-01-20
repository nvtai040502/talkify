import { FC } from "react"
import { TabsList } from "../ui/tabs"
import { ContentType } from "@/types/content"
import { Icons } from "../icons"
import { SidebarSwitchItem } from "./sidebar-switcher-item"
import ProfileSettings from "../profile/profile-settings"
import { ThemeToggle } from "../theme-toggle"
import { MessageSquare, Settings2 } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip"
import { IconPencil } from "@tabler/icons-react"

export const SIDEBAR_ICON_SIZE = 28

interface SidebarSwitcherProps {
  onContentTypeChange: (contentType: ContentType) => void
}

export const SidebarSwitcher: FC<SidebarSwitcherProps> = ({
    onContentTypeChange
}) => {
  return (
    <div className="flex flex-col justify-between pb-5 border-r-2">
      <TabsList className="bg-background grid h-[400px] grid-rows-7">
        <SidebarSwitchItem
          icon={<MessageSquare size={SIDEBAR_ICON_SIZE}/>}
          contentType="chats"
          onContentTypeChange={onContentTypeChange}
        />

        <SidebarSwitchItem
        icon={<Settings2 size={SIDEBAR_ICON_SIZE} />}
        contentType="presets"
        onContentTypeChange={onContentTypeChange}
        />
        <SidebarSwitchItem
          icon={<IconPencil size={SIDEBAR_ICON_SIZE}/>}
          contentType="prompts"
          onContentTypeChange={onContentTypeChange}
        />
      </TabsList>
      
      <div className="flex flex-col items-center gap-4 mb-4">
        <ThemeToggle side="right"/>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Icons.user />
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Profile Settings</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  )
}