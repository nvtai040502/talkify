import { updateWorkspace } from "@/actions/workspaces"
import { TalkifyContext } from "@/hooks/context"
import { ChatSettings } from "@/types/chat"
import { LLMID } from "@/types/llms"
import { FC, useContext, useRef, useState } from "react"
import toast from "react-hot-toast"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "../ui/sheet"
import { Icons } from "../icons"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
import { Label } from "../ui/label"
import { Input } from "../ui/input"
import { TextareaAutosize } from "../ui/textarea-autosize"
import { ChatSettingsForm } from "../chats/chat-settings-form"
import { DeleteWorkspace } from "./delete-workspace"
import { Button } from "../ui/button"
import { ScrollArea, ScrollBar } from "../ui/scroll-area"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip"
import { DEFAULT_CHAT_SETTINGS } from "@/constants/chat"

interface WorkspaceSettingsProps {}

export const WorkspaceSettings: FC<WorkspaceSettingsProps> = ({}) => {
  const {
    selectedWorkspace,
    setSelectedWorkspace,
    setWorkspaces,
    setChatSettings
  } = useContext(TalkifyContext)
  // console.log(selectedWorkspace)

  const buttonRef = useRef<HTMLButtonElement>(null)

  const [isOpen, setIsOpen] = useState(false)

  const [name, setName] = useState(selectedWorkspace?.name || "")
  const [description, setDescription] = useState(
    selectedWorkspace?.description || ""
  )
  const [instructions, setInstructions] = useState(
    selectedWorkspace?.instructions || ""
  )

  const [defaultChatSettings, setDefaultChatSettings] = useState({
    model: selectedWorkspace?.defaultModel,
    prompt: selectedWorkspace?.defaultPrompt,
    temperature: selectedWorkspace?.defaultTemperature,
    maxTokens: selectedWorkspace?.defaultMaxTokens,
    topK: selectedWorkspace?.defaultTopK,
    topP: selectedWorkspace?.defaultTopP,
    repetitionPenalty: selectedWorkspace?.defaultRepetitionPenalty,
    includeWorkspaceInstructions: selectedWorkspace?.includeWorkspaceInstructions
  })
  // console.log("🚀 ~ defaultChatSettings:", defaultChatSettings.includeWorkspaceInstructions)
  
  const handleSave = async () => {
    if (!selectedWorkspace) return

    const updatedWorkspace = await updateWorkspace({
      name,
      description,
      instructions,
      id: selectedWorkspace.id,
      defaultMaxTokens: defaultChatSettings.maxTokens || selectedWorkspace.defaultMaxTokens,
      defaultModel: defaultChatSettings.model || selectedWorkspace.defaultModel,
      defaultPrompt: defaultChatSettings.prompt || selectedWorkspace.defaultPrompt,
      defaultRepetitionPenalty: defaultChatSettings.repetitionPenalty || selectedWorkspace.defaultRepetitionPenalty,
      defaultTemperature: defaultChatSettings.temperature || selectedWorkspace.defaultTemperature,
      defaultTopK: defaultChatSettings.topK || selectedWorkspace.defaultTopK,
      defaultTopP: defaultChatSettings.topP || selectedWorkspace.defaultTopP,
      isHome: selectedWorkspace.isHome,
      includeWorkspaceInstructions: 
        defaultChatSettings.includeWorkspaceInstructions !== undefined
          ? defaultChatSettings.includeWorkspaceInstructions
          : selectedWorkspace.includeWorkspaceInstructions,
    })
    // console.log(updatedWorkspace)
    if (
      defaultChatSettings.model &&
      defaultChatSettings.prompt &&
      defaultChatSettings.temperature &&
      defaultChatSettings.maxTokens &&
      defaultChatSettings.temperature &&
      defaultChatSettings.topK &&
      defaultChatSettings.topP &&
      defaultChatSettings.repetitionPenalty &&
      defaultChatSettings.includeWorkspaceInstructions !== undefined
    ) {
      
      setChatSettings({
        model: defaultChatSettings.model as LLMID,
        prompt: defaultChatSettings.prompt,
        temperature: defaultChatSettings.temperature,
        maxTokens: defaultChatSettings.maxTokens,
        repetitionPenalty: defaultChatSettings.repetitionPenalty,
        topK: defaultChatSettings.topK,
        topP: defaultChatSettings.topP,
        includeWorkspaceInstructions: defaultChatSettings.includeWorkspaceInstructions
      })
    }
    

    setSelectedWorkspace(updatedWorkspace)
    setWorkspaces(workspaces => {
      return workspaces.map(workspace => {
        if (workspace.id === selectedWorkspace.id) {
          return updatedWorkspace
        }
        return workspace
      })
    })

    setIsOpen(false)
    setSelectedWorkspace(updatedWorkspace)
    setWorkspaces(workspaces => {
      return workspaces.map(workspace => {
        if (workspace.id === selectedWorkspace.id) {
          return updatedWorkspace
        }
        return workspace
      })
    })

    toast.success("Workspace updated!")
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      buttonRef.current?.click()
    }
  }

  if (!selectedWorkspace) return null

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Icons.settings
          className="ml-3 cursor-pointer pr-[5px] hover:opacity-50"
          size={32}
          onClick={() => setIsOpen(true)}
        />
      </SheetTrigger>
      <SheetContent
        className="flex flex-col justify-between p-0"
        side="left"
        // onKeyDown={handleKeyDown}
      >
      <ScrollArea className=" p-6">
        <div className="grow">
          <SheetHeader>
            <SheetTitle className="flex items-center justify-between">
              Workspace Settings
              {selectedWorkspace?.isHome && <Icons.home />}
            </SheetTitle>

            {selectedWorkspace?.isHome && (
              <div className="text-sm font-light">
                This is your home workspace.
              </div>
            )}
          </SheetHeader>

          <Tabs defaultValue="main">
            <TabsList className="mt-4 grid w-full grid-cols-2">
              <TabsTrigger value="main">Main</TabsTrigger>
              <TabsTrigger value="defaults">Defaults</TabsTrigger>
            </TabsList>

            <TabsContent className="mt-4 space-y-4" value="main">
              <>
                <div className="space-y-1">
                  <Label>Name</Label>

                  <Input
                    placeholder="Name..."
                    value={name}
                    onChange={e => setName(e.target.value)}
                  />
                </div>

                <div className="space-y-1">
                  <Label>Description</Label>

                  <Input
                    placeholder="Description... (optional)"
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                  />
                </div>
              </>

              <div className="space-y-1">
                <Label>
                  How would you like the AI to respond in this workspace?
                </Label>

                <TextareaAutosize
                  placeholder="Instructions... (optional)"
                  value={instructions}
                  onValueChange={setInstructions}
                  minRows={5}
                  maxRows={10}
                />

                
              </div>
            </TabsContent>

            <TabsContent className="mt-5" value="defaults">
              <div className="mb-4 text-sm">
                These are the settings your workspace begins with when selected.
              </div>

              <ChatSettingsForm
                chatSettings={defaultChatSettings as any}
                onChangeChatSettings={setDefaultChatSettings}
              />
            </TabsContent>
          </Tabs>
        </div>

        <div className="mt-6 flex justify-between">
          <div>
            {!selectedWorkspace.isHome && (
              <DeleteWorkspace
                workspace={selectedWorkspace}
                onDelete={() => setIsOpen(false)}
              />
            )}
          </div>

          <div className="space-x-2">
            <Button variant="ghost" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>

            <Button onClick={handleSave}>
              Save
            </Button>
          </div>
        </div>
      </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}