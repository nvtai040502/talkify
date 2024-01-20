import { FC, useContext, useEffect, useRef, useState } from "react"
import { ContentType } from "@/types/content"
import { DataItemType, DataListType } from "@/types/sidebar-data"
import { TalkifyContext } from "@/global/context"
import { Chat, Preset, Prompt } from "@prisma/client"
import { PresetItem } from "./items/preset/preset-items"
import { cn, getChatsSortedByDate } from "@/lib/utils"
import { ChatItem } from "./items/chat/chat-item"
import { PromptItem } from "./items/prompts/prompt-item"

interface SidebarDataListProps {
  contentType: ContentType
  data: DataListType
}

export const SidebarDataList: FC<SidebarDataListProps> = ({
  contentType,
  data,
}) => {

  const getDataListComponent = (
    contentType: ContentType,
    item: DataItemType
  ) => {
    switch (contentType) {
      case "chats":
        return <ChatItem key={item.id} chat={item as Chat} />

      case "presets":
        return <PresetItem key={item.id} preset={item as Preset} />

      case "prompts":
        return <PromptItem key={item.id} prompt={item as Prompt} />
      default:
        return null
    }
  }

  return (
      <div
        className="flex flex-col mt-2 overflow-auto"
      >
        {data.length === 0 && (
          <div className="flex flex-col items-center justify-center grow">
            <div className="p-8 text-lg italic text-centertext-muted-foreground">
              No {contentType}.
            </div>
          </div>
        )}

          <div className="h-full">
            {contentType === "chats" ? (
              <>
                {["Today", "Yesterday", "Previous Week", "Older"].map(
                  (dateCategory, index) => {
                    const sortedData = getChatsSortedByDate(
                      data as Chat[],
                      dateCategory as
                        | "Today"
                        | "Yesterday"
                        | "Previous Week"
                        | "Older"
                    );
                    return (
                      sortedData.length > 0 && (
                        <div key={dateCategory + index} className="pb-2">
                          <div className="mb-1 text-sm font-bold text-muted-foreground">
                            {dateCategory}
                          </div>
                          <div
                            className={cn(
                              "flex grow flex-col",
                            )}
                          >
                            {sortedData.map((item: Chat) => (
                              <div key={item.id}>
                                {getDataListComponent(contentType, item)}
                              </div>
                            ))}
                          </div>
                        </div>
                      )
                    )
                  }
                )}
              </>
            ) : (
              <div className={cn("flex grow flex-col")}>
                {data.map((item) => (
                  <div key={item.id}>
                    {getDataListComponent(contentType, item)}
                  </div>
                ))}
              </div>
            )}
          </div>
      </div>
  )
}