import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { TalkifyContext } from "@/global/context"
import { FC, useContext, useState } from "react"
import { SidebarCreateItem } from "../all/sidebar-create-item"
import { Preset } from "@prisma/client"
import { ChatSettingsForm } from "@/components/chats/chat-settings-form"

interface CreatePresetProps {
  isOpen: boolean
  onOpenChange: (isOpen: boolean) => void
}

export const CreatePreset: FC<CreatePresetProps> = ({
  isOpen,
  onOpenChange
}) => {
  const { 
    selectedWorkspace } = useContext(TalkifyContext)
  const [isTyping, setIsTyping] = useState(false)
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [presetChatSettings, setPresetChatSettings] = useState({
    model: selectedWorkspace?.defaultModel,
    prompt: selectedWorkspace?.defaultPrompt,
    temperature: selectedWorkspace?.defaultTemperature,
    includeWorkspaceInstructions:
    selectedWorkspace?.includeWorkspaceInstructions,
  })

  if (!selectedWorkspace) return null

  return (
    <SidebarCreateItem
      isTyping={isTyping}
      contentType="presets"
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      createState={
        {
          model: presetChatSettings.model,
          name,
          description,
          includeWorkspaceInstructions: presetChatSettings.includeWorkspaceInstructions,
          prompt: presetChatSettings.prompt,
          temperature: presetChatSettings.temperature,
          workspaceId: selectedWorkspace.id
        } 
      }
      renderInputs={() => (
        <>
          <div className="space-y-1">
            <Label>Name</Label>

            <Input
              placeholder="Preset name..."
              value={name}
              onChange={e => setName(e.target.value)}
              // maxLength={PRESET_NAME_MAX}
            />
          </div>

          <div className="space-y-1">
            <Label>Description (optional)</Label>

            <Input
              placeholder="Preset description..."
              value={description}
              onChange={e => setDescription(e.target.value)}
              // maxLength={PRESET_DESCRIPTION_MAX}
            />
          </div>

          <ChatSettingsForm
            chatSettings={presetChatSettings as any}
            onChangeChatSettings={setPresetChatSettings}
            useAdvancedDropdown={true}
          />
        </>
      )}
    />
  )
}