import { FC, useContext } from "react"
import { TabsContent } from "../ui/tabs"
import { WorkspaceSettings } from "../workspace/workspace-settings"
import { SidebarContent } from "./sidebar-content"
import { ContentType } from "@/types/content"
import { TalkifyContext } from "@/global/context"
import { SIDEBAR_WIDTH } from "@/app/(chat)/layout"
import { WorkspaceSwitcher } from "../workspace/workspace-swicher"
import { Chat, Preset } from "@prisma/client"
import { DataListType } from "@/types/sidebar-data"

interface SidebarContentContainerProps {
  contentType: ContentType
  showSidebar: boolean
}

export const SidebarContentContainer: FC<SidebarContentContainerProps> = ({ contentType, showSidebar }) => {
  const {
    chats,
    presets,
  } = useContext(TalkifyContext)

  const renderSidebarContent = (
    contentType: ContentType,
    data: DataListType,
  ) => {
    return (
      <SidebarContent contentType={contentType} data={data}/>
    )
  }

  return (
    <TabsContent
      className="m-0 w-full space-y-2"
      style={{
        // Sidebar - SidebarSwitcher
        minWidth: showSidebar ? `calc(${SIDEBAR_WIDTH}px - 60px)` : "0px",
        maxWidth: showSidebar ? `calc(${SIDEBAR_WIDTH}px - 60px)` : "0px",
        width: showSidebar ? `calc(${SIDEBAR_WIDTH}px - 60px)` : "0px"
      }}
      value={contentType}
    >
      <div className="flex h-full flex-col p-3">
        <div className="flex items-center border-b-2 pb-2">
          <WorkspaceSwitcher />

          <WorkspaceSettings />
        </div>

        {(() => {
          switch (contentType) {
            case "chats":
              return renderSidebarContent("chats", chats)

            case "presets":
              return renderSidebarContent("presets", presets)
            default:
              return null
          }
        })()}
      </div>
    </TabsContent>
  )
}