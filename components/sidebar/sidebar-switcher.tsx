import { FC } from "react"
import { TabsList } from "../ui/tabs"
import { WithTooltip } from "../ui/with-tooltip"
import { ContentType } from "@/types/content"
import { IconMessage } from "../ui/icons"
import { Icons } from "../icons"
import { Settings2 } from "lucide-react"
import { SidebarSwitchItem } from "./sidebar-switcher-item"
import ProfileSettings from "../profile/profile-settings"
import { ThemeToggle } from "../theme-toggle"

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
          icon={<Icons.media size={SIDEBAR_ICON_SIZE}/>}
          contentType="chats"
          onContentTypeChange={onContentTypeChange}
        />

        <SidebarSwitchItem
        icon={<Icons.settings size={SIDEBAR_ICON_SIZE} />}
        contentType="presets"
        onContentTypeChange={onContentTypeChange}
        />

        {/* <SidebarSwitchItem
          icon={<IconPencil size={SIDEBAR_ICON_SIZE} />}
          contentType="prompts"
          onContentTypeChange={onContentTypeChange}
        />

        <SidebarSwitchItem
          icon={<IconFile size={SIDEBAR_ICON_SIZE} />}
          contentType="files"
          onContentTypeChange={onContentTypeChange}
        />

        <SidebarSwitchItem
          icon={<IconBooks size={SIDEBAR_ICON_SIZE} />}
          contentType="collections"
          onContentTypeChange={onContentTypeChange}
        /> */}

        {/* <SidebarSwitchItem
          icon={<IconRobotFace size={SIDEBAR_ICON_SIZE} />}
          contentType="assistants"
          onContentTypeChange={onContentTypeChange}
        />gi

        <SidebarSwitchItem
          icon={<IconBolt size={SIDEBAR_ICON_SIZE} />}
          contentType="tools"
          onContentTypeChange={onContentTypeChange}
        /> */}
      </TabsList>

      <div className="flex flex-col items-center gap-4">
        {/* TODO */}
        {/* <WithTooltip display={<div>Import</div>} trigger={<Import />} /> */}

        {/* TODO */}
        {/* <Alerts /> */}
        <WithTooltip
          display={<div>Theme Mode</div>}
          trigger={<ThemeToggle />}
          side="right"
        />
        <WithTooltip
          display={<div>Profile Settings</div>}
          trigger={<ProfileSettings />}
        />
      </div>
    </div>
  )
}