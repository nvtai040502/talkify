"use client"

import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover"
import { ChevronsUpDown } from "lucide-react"
import { FC, useContext, useEffect, useState } from "react"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { TalkifyContext } from "@/hooks/context"
import { useChatHandler } from "@/hooks/use-chat-handler"
import { createWorkspace } from "@/actions/workspaces"
import { Icons } from "../icons"

interface WorkspaceSwitcherProps {}

export const WorkspaceSwitcher: FC<WorkspaceSwitcherProps> = ({}) => {
  // useHotkey(";", () => setOpen(prevState => !prevState))

  const { workspaces, selectedWorkspace, setSelectedWorkspace, setWorkspaces } =
    useContext(TalkifyContext)
  const { handleNewChat } = useChatHandler()

  const [open, setOpen] = useState(false)
  const [value, setValue] = useState("")
  const [search, setSearch] = useState("")

  const handleCreateWorkspace = async () => {
    if (!selectedWorkspace) return

    const createdWorkspace = await createWorkspace({
      defaultMaxTokens: selectedWorkspace.defaultMaxTokens,
      defaultModel: selectedWorkspace.defaultModel,
      defaultPrompt: selectedWorkspace.defaultPrompt,
      defaultTemperature: selectedWorkspace.defaultTemperature,
      description: "",
      defaultRepetitionPenalty: selectedWorkspace.defaultRepetitionPenalty,
      defaultTopK: selectedWorkspace.defaultTopK,
      defaultTopP: selectedWorkspace.defaultTopP,
      isHome: false,
      name: "New Workspace"
    })

    setWorkspaces([...workspaces, createdWorkspace])
    setSelectedWorkspace(createdWorkspace)
    setOpen(false)

    handleNewChat()
  }

  const getWorkspaceName = (workspaceId: string) => {
    const workspace = workspaces.find(workspace => workspace.id === workspaceId)

    if (!workspace) return

    return workspace.name
  }

  const handleSelect = (workspaceId: string) => {
    const workspace = workspaces.find(workspace => workspace.id === workspaceId)

    if (!workspace) return

    setSelectedWorkspace(workspace)
    setOpen(false)
  }

  useEffect(() => {
    if (!selectedWorkspace) return

    setValue(selectedWorkspace.id)
  }, [selectedWorkspace])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        className="border-input flex h-[36px]
        w-full cursor-pointer items-center justify-between rounded-md border px-2 py-1 hover:opacity-50"
      >
        <div className="flex items-center truncate">
          {selectedWorkspace?.isHome && (
            <Icons.home className="mb-0.5 mr-2" size={16} />
          )}

          {getWorkspaceName(value) || "Select workspace..."}
        </div>

        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
      </PopoverTrigger>

      <PopoverContent className="p-2">
        <div className="space-y-2">
          <Button
            className="flex w-full items-center space-x-2"
            size="sm"
            onClick={handleCreateWorkspace}
          >
            <Icons.add />
            <div className="ml-2">New Workspace</div>
          </Button>

          <Input
            placeholder="Search workspaces..."
            autoFocus
            value={search}
            onChange={e => setSearch(e.target.value)}
          />

          <div className="flex flex-col space-y-1">
            {workspaces
              .filter(workspace => workspace.isHome)
              .map(workspace => (
                <Button
                  key={workspace.id}
                  className="flex items-center justify-start"
                  variant="ghost"
                  onClick={() => handleSelect(workspace.id)}
                >
                  <Icons.home className="mr-2" size={20} />
                  <div className="text-lg">{workspace.name}</div>
                </Button>
              ))}

            {workspaces
              .filter(
                workspace =>
                  !workspace.isHome &&
                  workspace.name.toLowerCase().includes(search.toLowerCase())
              )
              .sort((a, b) => a.name.localeCompare(b.name))
              .map(workspace => (
                <Button
                  key={workspace.id}
                  className="flex justify-start"
                  variant="ghost"
                  onClick={() => handleSelect(workspace.id)}
                >
                  <div className="text-lg">{workspace.name}</div>
                </Button>
              ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}