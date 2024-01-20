import { IconChevronDown, IconCircleCheckFilled } from "@tabler/icons-react"
import { FC, useContext, useEffect, useRef, useState } from "react"
import { Button } from "../ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger
} from "../ui/dropdown-menu"
import { Input } from "../ui/input"
import { Workspace } from "@prisma/client"
import { TalkifyContext } from "@/global/context"

interface AssignWorkspaces {
  selectedWorkspaces: Workspace[]
  onSelectWorkspace: (workspace: Workspace) => void
}

export const AssignWorkspaces: FC<AssignWorkspaces> = ({
  selectedWorkspaces,
  onSelectWorkspace
}) => {
  const { workspaces } = useContext(TalkifyContext)

  const inputRef = useRef<HTMLInputElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)

  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState("")

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus()
      }, 100) // FIX: hacky
    }
  }, [isOpen])

  const handleWorkspaceSelect = (workspace: Workspace) => {
    onSelectWorkspace(workspace)
  }

  if (!workspaces) return null

  return (
    <DropdownMenu
      open={isOpen}
      onOpenChange={isOpen => {
        setIsOpen(isOpen)
        setSearch("")
      }}
    >
      <DropdownMenuTrigger
        className="justify-start w-full px-3 py-5 border-2 bg-background"
        asChild
      >
        <Button
          ref={triggerRef}
          className="flex items-center justify-between"
          variant="ghost"
        >
          <div className="flex items-center">
            <div className="flex items-center ml-2">
              {selectedWorkspaces.length} workspaces selected
            </div>
          </div>

          <IconChevronDown />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        style={{ width: triggerRef.current?.offsetWidth }}
        className="p-2 space-y-2 overflow-auto"
        align="start"
      >
        <Input
          ref={inputRef}
          placeholder="Search workspaces..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          onKeyDown={e => e.stopPropagation()}
        />

        {selectedWorkspaces
          .filter(workspace =>
            workspace.name.toLowerCase().includes(search.toLowerCase())
          )
          .map(workspace => (
            <WorkspaceItem
              key={workspace.id}
              selectedWorkspaces={selectedWorkspaces}
              workspace={workspace}
              selected={selectedWorkspaces.some(
                selectedWorkspace => selectedWorkspace.id === workspace.id
              )}
              onSelect={handleWorkspaceSelect}
            />
          ))}

        {workspaces
          .filter(
            workspace =>
              !selectedWorkspaces.some(
                selectedWorkspace => selectedWorkspace.id === workspace.id
              ) && workspace.name.toLowerCase().includes(search.toLowerCase())
          )
          .map(workspace => (
            <WorkspaceItem
              key={workspace.id}
              selectedWorkspaces={selectedWorkspaces}
              workspace={workspace}
              selected={selectedWorkspaces.some(
                selectedWorkspace => selectedWorkspace.id === workspace.id
              )}
              onSelect={handleWorkspaceSelect}
            />
          ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

interface WorkspaceItemProps {
  selectedWorkspaces: Workspace[]
  workspace: Workspace
  selected: boolean
  onSelect: (workspace: Workspace) => void
}

const WorkspaceItem: FC<WorkspaceItemProps> = ({
  selectedWorkspaces,
  workspace,
  selected,
  onSelect
}) => {
  const handleSelect = () => {
    if (selected && selectedWorkspaces.length === 1) {
      alert("You must select at least one workspace")
      return
    }

    onSelect(workspace)
  }

  return (
    <div
      className="flex cursor-pointer items-center justify-between py-0.5 hover:opacity-50"
      onClick={handleSelect}
    >
      <div className="flex items-center truncate grow">
        <div className="truncate">{workspace.name}</div>
      </div>

      {selected && (
        <IconCircleCheckFilled size={20} className="min-w-[30px] flex-none" />
      )}
    </div>
  )
}