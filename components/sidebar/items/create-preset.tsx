import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { TalkifyContext } from "@/global/context"
import { FC, useContext, useState } from "react"
import { SidebarCreateItem } from "./sidebar-create-item"
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
    // profile, 
    selectedWorkspace } = useContext(TalkifyContext)

  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [presetChatSettings, setPresetChatSettings] = useState({
    model: selectedWorkspace?.defaultModel,
    prompt: selectedWorkspace?.defaultPrompt,
    temperature: selectedWorkspace?.defaultTemperature,
    includeWorkspaceInstructions:
    selectedWorkspace?.includeWorkspaceInstructions,
    // contextLength: selectedWorkspace?.default_context_length,
    // includeProfileContext: selectedWorkspace?.include_profile_context,
    // embeddingsProvider: selectedWorkspace?.embeddings_provider
  })

  // if (!profile) return null
  if (!selectedWorkspace) return null

  return (
    <SidebarCreateItem
      contentType="presets"
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      createState={
        {
          // user_id: profile.user_id,
          name,
          description,
          include_workspace_instructions:
          presetChatSettings.includeWorkspaceInstructions,
          model: presetChatSettings.model,
          prompt: presetChatSettings.prompt,
          temperature: presetChatSettings.temperature,
          // // include_profile_context: presetChatSettings.includeProfileContext,
          // context_length: presetChatSettings.contextLength,
          // embeddings_provider: presetChatSettings.embeddingsProvider
        } as Preset
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

          {/* <div className="space-y-1">
            <Label>Description (optional)</Label>

            <Input
              placeholder="Preset description..."
              value={description}
              onChange={e => setDescription(e.target.value)}
              maxLength={PRESET_DESCRIPTION_MAX}
            />
          </div> */}

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