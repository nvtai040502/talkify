import { TalkifyContext } from "@/global/context"
import { useChatHandler } from "@/hooks/use-chat-handler"
import { ContentType } from "@/types/content"
import { FC, useContext, useState } from "react"
import { Button } from "../ui/button"
import { IconFolderPlus, IconPlus } from "@tabler/icons-react"
import { CreatePreset } from "./items/preset/create-preset"
import Link from "next/link"
import { CreatePrompt } from "./items/prompts/create-prompt"

interface SidebarCreateButtonsProps {
  contentType: ContentType
  hasData: boolean
}

export const SidebarCreateButtons: FC<SidebarCreateButtonsProps> = ({
  contentType,
  hasData
}) => {
  const { 
    selectedWorkspace, 
    
  } =
    useContext(TalkifyContext)
  const { handleNewChat } = useChatHandler()

  const [isCreatingPreset, setIsCreatingPreset] = useState(false)
  const [isCreatingPrompt, setIsCreatingPrompt] = useState(false)
  const handleCreateFolder = async () => {
    if (!selectedWorkspace) return

    // const createdFolder = await createFolder({
    //   user_id: profile.user_id,
    //   workspace_id: selectedWorkspace.id,
    //   name: "New Folder",
    //   description: "",
    //   type: contentType
    // })
    // setFolders([...folders, createdFolder])
  }

  const getCreateFunction = () => {
    switch (contentType) {
      case "chats":
        return async () => {
          handleNewChat()
        }

      case "presets":
        return async () => {
          setIsCreatingPreset(true)
        }
      case "prompts":
        return async () => {
          setIsCreatingPrompt(true)
        }
      default:
        break
    }
  }

  return (
    <div className="flex w-full space-x-2">
      <Link href="/" className="w-full">
        <Button className="flex h-[36px] grow w-full" onClick={getCreateFunction()}>
          <IconPlus className="mr-1" size={20} />
          New{" "}
          {contentType.charAt(0).toUpperCase() +
            contentType.slice(1, contentType.length - 1)}
        </Button>
      </Link>
      {hasData && (
        <Button className="h-[36px] w-[36px] p-1" onClick={handleCreateFolder}>
          <IconFolderPlus size={20} />
        </Button>
      )}


      {isCreatingPreset && (
        <CreatePreset
        isOpen={isCreatingPreset}
        onOpenChange={setIsCreatingPreset}
        />
        )}

      {isCreatingPrompt && (
        <CreatePrompt
          isOpen={isCreatingPrompt}
          onOpenChange={setIsCreatingPrompt}
        />
      )}
      {/* {isCreatingFile && (
        <CreateFile isOpen={isCreatingFile} onOpenChange={setIsCreatingFile} />
      )}

      {isCreatingCollection && (
        <CreateCollection
          isOpen={isCreatingCollection}
          onOpenChange={setIsCreatingCollection}
        />
      )}

      {isCreatingAssistant && (
        <CreateAssistant
          isOpen={isCreatingAssistant}
          onOpenChange={setIsCreatingAssistant}
        />
      )}

      {isCreatingTool && (
        <CreateTool isOpen={isCreatingTool} onOpenChange={setIsCreatingTool} />
      )} */}
    </div>
  )
}