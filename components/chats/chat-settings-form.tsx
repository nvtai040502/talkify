"use client"

import { TalkifyContext } from "@/hooks/context"
import { ChatSettings } from "@/types/chat"
import { FC, useContext } from "react"
import { Label } from "../ui/label"
import { ModelSelect } from "../models/model-select"
import { LLM_LIST } from "@/models/llm-list"
import { TextareaAutosize } from "../ui/textarea-autosize"
import { Slider } from "../ui/slider"
import { Checkbox } from "../ui/checkbox"
import { WithTooltip } from "../ui/with-tooltip"
import { Icons } from "../icons"
import { Select } from "../ui/select"
import { AdvancedContent, AdvancedSettings } from "./advanced-settings"
import { ScrollArea } from "../ui/scroll-area"

interface ChatSettingsFormProps {
  chatSettings: ChatSettings
  onChangeChatSettings: (value: ChatSettings) => void
  useAdvancedDropdown?: boolean
  showTooltip?: boolean
}

export const ChatSettingsForm: FC<ChatSettingsFormProps> = ({
  chatSettings,
  onChangeChatSettings,
  useAdvancedDropdown = true,
  showTooltip = true
}) => {
  const { availableLocalModels } = useContext(TalkifyContext)
  // console.log(availableLocalModels)
  return (
    <div className="space-y-3">
      <div className="space-y-1">
        <Label>Model</Label>

        <ModelSelect
          hostedModelOptions={LLM_LIST}
          localModelOptions={availableLocalModels}
          selectedModelId={chatSettings.model}
          onSelectModel={model => {
            onChangeChatSettings({ ...chatSettings, model })
          }}
        />
      </div>

      <div className="space-y-1">
        <Label>Prompt</Label>

        <TextareaAutosize
          className="border-2 bg-background border-input"
          placeholder="You are a helpful AI assistant."
          onValueChange={prompt => {
            onChangeChatSettings({ ...chatSettings, prompt })
          }}
          value={chatSettings.prompt}
          minRows={3}
          maxRows={6}
        />
      </div>

      {useAdvancedDropdown ? (
        <AdvancedSettings>
          <AdvancedContent
            chatSettings={chatSettings}
            onChangeChatSettings={onChangeChatSettings}
            showTooltip={showTooltip}
          />
        </AdvancedSettings>
      ) : (
        <div>
          <AdvancedContent
            chatSettings={chatSettings}
            onChangeChatSettings={onChangeChatSettings}
            showTooltip={showTooltip}
          />
        </div>
      )}
    </div>
  )
}

