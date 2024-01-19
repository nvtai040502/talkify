import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Preset } from "@prisma/client"
import { FC, useState } from "react"
import { SidebarItem } from "../sidebar-item"
import { Icons } from "@/components/icons"
import { ChatSettingsForm } from "@/components/chats/chat-settings-form"

interface PresetItemProps {
  preset: Preset
}

export const PresetItem: FC<PresetItemProps> = ({ preset }) => {
  const [name, setName] = useState(preset.name)
  const [description, setDescription] = useState(preset.description)
  const [presetChatSettings, setPresetChatSettings] = useState({
    model: preset.model,
    prompt: preset.prompt,
    temperature: preset.temperature,
    includeWorkspaceInstructions: preset.include_workspace_instructions
    // contextLength: preset.context_length,
    // includeProfileContext: preset.include_profile_context,
  })

  return (
    <SidebarItem
      item={preset}
      contentType="presets"
      icon={
        <Icons.robot height={30} width={30} />
      }
      updateState={{
        name,
        description,
        include_workspace_instructions:
        presetChatSettings.includeWorkspaceInstructions,
        model: presetChatSettings.model,
        prompt: presetChatSettings.prompt,
        temperature: presetChatSettings.temperature
        // include_profile_context: presetChatSettings.includeProfileContext,
        // context_length: presetChatSettings.contextLength,
      }}
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