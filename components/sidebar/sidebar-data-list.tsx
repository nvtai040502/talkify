import { FC, useContext, useEffect, useRef, useState } from "react"
import { Separator } from "../ui/separator"
import { ContentType } from "@/types/content"
import { DataItemType, DataListType } from "@/types/sidebar-data"
import { TalkifyContext } from "@/global/context"
import { Chat, Preset } from "@prisma/client"
import { PresetItem } from "./items/preset-items"
import { cn } from "@/lib/utils"
import { ChatItem } from "./items/chat-item"
interface SidebarDataListProps {
  contentType: ContentType
  data: DataListType
  // folders: Tables<"folders">[]
}

export const SidebarDataList: FC<SidebarDataListProps> = ({
  contentType,
  data,
  // folders
}) => {
  const {
    setChats,
    setPresets,
    // setPrompts,
    // setFiles,
    // setCollections,
    // setAssistants
  } = useContext(TalkifyContext)

  const divRef = useRef<HTMLDivElement>(null)

  const [isOverflowing, setIsOverflowing] = useState(false)
  const [isDragOver, setIsDragOver] = useState(false)

  const getDataListComponent = (
    contentType: ContentType,
    item: DataItemType
  ) => {
    switch (contentType) {
      case "chats":
        return <ChatItem key={item.id} chat={item as Chat} />

      case "presets":
        return <PresetItem key={item.id} preset={item as Preset} />

      // case "prompts":
      //   return <PromptItem key={item.id} prompt={item as Tables<"prompts">} />

      // case "files":
      //   return <FileItem key={item.id} file={item as Tables<"files">} />

      // case "collections":
      //   return (
      //     <CollectionItem
      //       key={item.id}
      //       collection={item as Tables<"collections">}
      //     />
      //   )

      // case "assistants":
      //   return (
      //     <AssistantItem
      //       key={item.id}
      //       assistant={item as Tables<"assistants">}
      //     />
      //   )

      // case "tools":
      //   return <ToolItem key={item.id} tool={item as Tables<"tools">} />

      default:
        return null
    }
  }

  const getSortedData = (
    data: any,
    dateCategory: "Today" | "Yesterday" | "Previous Week" | "Older"
  ) => {
    const now = new Date()
    const todayStart = new Date(now.setHours(0, 0, 0, 0))
    const yesterdayStart = new Date(
      new Date().setDate(todayStart.getDate() - 1)
    )
    const oneWeekAgoStart = new Date(
      new Date().setDate(todayStart.getDate() - 7)
    )

    return data
      .filter((item: any) => {
        const itemDate = new Date(item.updated_at || item.created_at)
        switch (dateCategory) {
          case "Today":
            return itemDate >= todayStart
          case "Yesterday":
            return itemDate >= yesterdayStart && itemDate < todayStart
          case "Previous Week":
            return itemDate >= oneWeekAgoStart && itemDate < yesterdayStart
          case "Older":
            return itemDate < oneWeekAgoStart
          default:
            return true
        }
      })
      .sort(
        (
          a: { updated_at: string; created_at: string },
          b: { updated_at: string; created_at: string }
        ) =>
          new Date(b.updated_at || b.created_at).getTime() -
          new Date(a.updated_at || a.created_at).getTime()
      )
  }

  // const updateFunctions = {
  //   chats: updateChat,
  //   presets: updatePreset,
  //   prompts: updatePrompt,
  //   files: updateFile,
  //   collections: updateCollection,
  //   assistants: updateAssistant,
  //   tools: updateTool
  // }

  // const stateUpdateFunctions = {
  //   chats: setChats,
  //   presets: setPresets,
  //   prompts: setPrompts,
  //   files: setFiles,
  //   collections: setCollections,
  //   assistants: setAssistants,
  //   tools: setAssistants
  // }

  const updateFolder = async (itemId: string, folderId: string | null) => {
    const item: any = data.find(item => item.id === itemId)

    if (!item) return null

    // const updateFunction = updateFunctions[contentType]
    // const setStateFunction = stateUpdateFunctions[contentType]

    // if (!updateFunction || !setStateFunction) return

    // const updatedItem = await updateFunction(item.id, {
    //   folder_id: folderId
    // })

    // setStateFunction((items: any) =>
    //   items.map((item: any) =>
    //     item.id === updatedItem.id ? updatedItem : item
    //   )
    // )
  }

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, id: string) => {
    e.dataTransfer.setData("text/plain", id)
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()

    const target = e.target as Element

    if (!target.closest("#folder")) {
      const itemId = e.dataTransfer.getData("text/plain")
      updateFolder(itemId, null)
    }

    setIsDragOver(false)
  }

  useEffect(() => {
    if (divRef.current) {
      setIsOverflowing(
        divRef.current.scrollHeight > divRef.current.clientHeight
      )
    }
  }, [data])

  // const dataWithFolders = data.filter(item => item.folder_id)
  // const dataWithoutFolders = data.filter(item => item.folder_id === null)

  return (
    <>
      <div
        ref={divRef}
        className="flex flex-col mt-2 overflow-auto"
        onDrop={handleDrop}
      >
        {data.length === 0 && (
          <div className="flex flex-col items-center justify-center grow">
            <div className="p-8 text-lg italic text-centertext-muted-foreground">
              No {contentType}.
            </div>
          </div>
        )}

        {/* {(dataWithFolders.length > 0 || dataWithoutFolders.length > 0) && (
          <div
            className={`h-full ${
              isOverflowing ? "w-[calc(100%-8px)]" : "w-full"
            } space-y-2 pt-2 ${isOverflowing ? "mr-2" : ""}`}
          >
            {folders.map(folder => (
              <Folder
                key={folder.id}
                folder={folder}
                onUpdateFolder={updateFolder}
              >
                {dataWithFolders
                  .filter(item => item.folder_id === folder.id)
                  .map(item => (
                    <div
                      key={item.id}
                      draggable
                      onDragStart={e => handleDragStart(e, item.id)}
                    >
                      {getDataListComponent(contentType, item)}
                    </div>
                  ))}
              </Folder>
            ))}

            {folders.length > 0 && <Separator />}

            {contentType === "chats" ? (
              <>
                {["Today", "Yesterday", "Previous Week", "Older"].map(
                  dateCategory => {
                    const sortedData = getSortedData(
                      dataWithoutFolders,
                      dateCategory as
                        | "Today"
                        | "Yesterday"
                        | "Previous Week"
                        | "Older"
                    )
                    return (
                      sortedData.length > 0 && (
                        <div className="pb-2">
                          <div className="mb-1 text-sm font-bold text-muted-foreground">
                            {dateCategory}
                          </div>

                          <div
                            className={cn(
                              "flex grow flex-col",
                              isDragOver && "bg-accent"
                            )}
                            onDrop={handleDrop}
                            onDragEnter={handleDragEnter}
                            onDragLeave={handleDragLeave}
                            onDragOver={handleDragOver}
                          >
                            {sortedData.map((item: any) => (
                              <div
                                key={item.id}
                                draggable
                                onDragStart={e => handleDragStart(e, item.id)}
                              >
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
              <div
                className={cn("flex grow flex-col", isDragOver && "bg-accent")}
                onDrop={handleDrop}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
              >
                {dataWithoutFolders.map(item => {
                  return (
                    <div
                      key={item.id}
                      draggable
                      onDragStart={e => handleDragStart(e, item.id)}
                    >
                      {getDataListComponent(contentType, item)}
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )} */}
      </div>

      <div
        className={cn("flex grow", isDragOver && "bg-accent")}
        onDrop={handleDrop}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
      ></div>
    </>
  )
}