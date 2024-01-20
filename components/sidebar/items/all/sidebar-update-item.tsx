import { updateChat } from "@/actions/chats"
import { createPresetWorkspaces, deletePresetWorkspaces, updatePreset } from "@/actions/presets"
import { getWorkspacesByPresetId } from "@/actions/workspaces"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from "@/components/ui/sheet"
import { AssignWorkspaces } from "@/components/workspace/assign-workspaces"
import { TalkifyContext } from "@/global/context"
import { ContentType } from "@/types/content"
import { DataItemType } from "@/types/sidebar-data"
import { Preset, Workspace } from "@prisma/client"
import { FC, useContext, useEffect, useRef, useState } from "react"
import toast from "react-hot-toast"
import { SidebarDeleteItem } from "./sidebar-delete-item"
interface SidebarUpdateItemProps {
  isTyping: boolean
  item: DataItemType
  contentType: ContentType
  children: React.ReactNode
  renderInputs: (renderState: any) => JSX.Element
  updateState: any
}

export const SidebarUpdateItem: FC<SidebarUpdateItemProps> = ({
  item,
  contentType,
  children,
  renderInputs,
  updateState,
  isTyping
}) => {
  const {
    workspaces,
    selectedWorkspace,
    setChats,
    setPresets,
  } = useContext(TalkifyContext)

  const buttonRef = useRef<HTMLButtonElement>(null)

  const [isOpen, setIsOpen] = useState(false)
  const [startingWorkspaces, setStartingWorkspaces] = useState<Workspace[]>([])
  const [selectedWorkspaces, setSelectedWorkspaces] = useState<Workspace[]>([])
  
  useEffect(() => {
    if (isOpen) {
      const fetchData = async () => {
        if (workspaces.length > 1) {
          const workspaces = await fetchSelectedWorkspaces()
          setStartingWorkspaces(workspaces)
          setSelectedWorkspaces(workspaces)
        }

        const fetchDataFunction = fetchDataFunctions[contentType]
        if (!fetchDataFunction) return
        // await fetchDataFunction(item.id)
      }

      fetchData()
    }
  }, [isOpen])

  const renderState = {
    chats: null,
    presets: null,
  }

  const fetchDataFunctions = {
    chats: null,
    presets: null,
  }

  const fetchWorkpaceFunctions = {
    chats: null,
    presets: async (presetId: string) => {
      const item = await getWorkspacesByPresetId(presetId)
      return item
    },
  }

  const fetchSelectedWorkspaces = async () => {
    const fetchFunction = fetchWorkpaceFunctions[contentType]

    if (!fetchFunction) return []

    const workspaces = await fetchFunction(item.id)

    return workspaces
  }

  const handleWorkspaceUpdates = async (
    startingWorkspaces: Workspace[],
    selectedWorkspaces: Workspace[],
    itemId: string,
    deleteWorkspaceFn: (
      workspaces: { itemId: string; workspaceId: string }[]
    ) => Promise<boolean>,
    createWorkspaceFn: (
      workspaces: { itemId: string; workspaceId: string }[]
    ) => Promise<void>,
    itemIdKey: string
  ) => {
    if (!selectedWorkspace) return

    const deleteList = startingWorkspaces.filter(
      startingWorkspace =>
        !selectedWorkspaces.some(
          selectedWorkspace => selectedWorkspace.id === startingWorkspace.id
        )
    )

    
    await deleteWorkspaceFn(
      deleteList.map(workspace => {
        return {
          // user_id: workspace.user_id,
          [itemIdKey]: itemId,
          workspaceId: workspace.id
        } as any
      })
    )
    // if (deleteList.map(w => w.id).includes(selectedWorkspace.id)) {
    //   const setStateFunction = stateUpdateFunctions[contentType]

    //   if (setStateFunction) {
    //     setStateFunction((prevItems: any) =>
    //       prevItems.filter((prevItem: any) => prevItem.id !== item.id)
    //     )
    //   }
    // }

    const createList = selectedWorkspaces.filter(
      selectedWorkspace =>
        !startingWorkspaces.some(
          startingWorkspace => startingWorkspace.id === selectedWorkspace.id
        )
    )
    // console.log(itemId)
    await createWorkspaceFn(
      createList.map(workspace => {
        return {
          // user_id: workspace.user_id,
          [itemIdKey]: itemId,
          workspaceId: workspace.id
        } as any
      })
    )
  }

  const updateFunctions = {
    chats: updateChat,
    presets: async (presetId: string, updateState: Preset) => {
      const updatedPreset = await updatePreset(updateState)

      await handleWorkspaceUpdates(
        startingWorkspaces,
        selectedWorkspaces,
        presetId,
        deletePresetWorkspaces as any,
        createPresetWorkspaces as any,
        "presetId"
      )

      return updatedPreset
    },
  }

  const stateUpdateFunctions = {
    chats: setChats,
    presets: setPresets,
  }

  const handleUpdate = async () => {
    
    try {
      const updateFunction = updateFunctions[contentType]
      
      const setStateFunction = stateUpdateFunctions[contentType]

      if (!updateFunction || !setStateFunction) return
      // if (isTyping) return // Prevent update while typing
      console.log(updateFunction)

      const updatedItem = await updateFunction(item.id, updateState)

      setStateFunction((prevItems: any) =>
        prevItems.map((prevItem: any) =>
          prevItem.id === item.id ? updatedItem : prevItem
        )
      )

      setIsOpen(false)

      toast.success(`${contentType.slice(0, -1)} updated successfully`)
    } catch (error) {
      console.log(error)
      toast.error(`Error updating ${contentType.slice(0, -1)}. ${error}`)
    }
  }

  const handleSelectWorkspace = (workspace: Workspace) => {
    setSelectedWorkspaces(prevState => {
      const isWorkspaceAlreadySelected = prevState.find(
        selectedWorkspace => selectedWorkspace.id === workspace.id
      )

      if (isWorkspaceAlreadySelected) {
        return prevState.filter(
          selectedWorkspace => selectedWorkspace.id !== workspace.id
        )
      } else {
        return [...prevState, workspace]
      }
    })
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (!isTyping && e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      buttonRef.current?.click()
    }
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>{children}</SheetTrigger>

      <SheetContent
        className="flex min-w-[450px] flex-col justify-between"
        side="left"
        onKeyDown={handleKeyDown}
      >
        <div className="grow">
          <SheetHeader>
            <SheetTitle className="text-2xl font-bold">
              Edit {contentType.slice(0, -1)}
            </SheetTitle>
          </SheetHeader>

          {/* TODO */}
          {/* <div className="absolute right-4 top-4">
          <ShareMenu item={item} contentType={contentType} />
        </div> */}

          <div className="mt-4 space-y-3">
            {workspaces.length > 1 && (
              <div className="space-y-1">
                <Label>Assigned Workspaces</Label>

                <AssignWorkspaces
                  selectedWorkspaces={selectedWorkspaces}
                  onSelectWorkspace={handleSelectWorkspace}
                />
              </div>
            )}

            {renderInputs(renderState[contentType])}
          </div>
        </div>

        <SheetFooter className="flex justify-between mt-2">
          <SidebarDeleteItem item={item} contentType={contentType} />

          <div className="flex justify-end space-x-2 grow">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>

            <Button ref={buttonRef} 
            onClick={handleUpdate}
            >
              Save
            </Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}