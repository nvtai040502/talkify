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
    prompts
  } = useContext(TalkifyContext)
    // console.log("🚀 ~ presets:", presets)
    // console.log("🚀 ~ chats:", chats)
  
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
      className="w-full m-0 space-y-2"
      style={{
        // Sidebar - SidebarSwitcher
        minWidth: showSidebar ? `calc(${SIDEBAR_WIDTH}px - 60px)` : "0px",
        maxWidth: showSidebar ? `calc(${SIDEBAR_WIDTH}px - 60px)` : "0px",
        width: showSidebar ? `calc(${SIDEBAR_WIDTH}px - 60px)` : "0px"
      }}
      value={contentType}
    >
      <div className="flex flex-col h-full p-3">
        <div className="flex items-center pb-2 border-b-2">
          <WorkspaceSwitcher />

          <WorkspaceSettings />
        </div>

        {(() => {
          switch (contentType) {
            case "chats":
              return renderSidebarContent("chats", chats)

            case "presets":
              return renderSidebarContent("presets", presets)
            case "prompts":
              return renderSidebarContent("prompts", prompts)
            default:
              return null
          }
        })()}
      </div>
    </TabsContent>
  )
}