"use client"

import { TalkifyContext } from "@/lib/hooks/context"
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
import { AdvancedSettings } from "./advanced-settings"
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

interface AdvancedContentProps {
  chatSettings: ChatSettings
  onChangeChatSettings: (value: ChatSettings) => void
  showTooltip: boolean
}

const AdvancedContent: FC<AdvancedContentProps> = ({
  chatSettings,
  onChangeChatSettings,
  showTooltip
}) => {
  
  return (
    
    <div className="mt-5 mb-10">
      <div className="space-y-3">
        <Label className="flex items-center space-x-1">
          <div>Temperature:</div>

          <div>{chatSettings.temperature}</div>
        </Label>

        <Slider
          value={[chatSettings.temperature]}
          onValueChange={temperature => {
            onChangeChatSettings({
              ...chatSettings,
              temperature: temperature[0]
            })
          }}
          min={0}
          max={1}
          step={0.01}
        />
      </div>

      <div className="mt-6 space-y-3">
        <Label className="flex items-center space-x-1">
          <div>Max Tokens:</div>

          <div>{chatSettings.maxTokens}</div>
        </Label>

        <Slider
          value={[chatSettings.maxTokens]}
          onValueChange={maxTokens => {
            onChangeChatSettings({
              ...chatSettings,
              maxTokens: maxTokens[0]
            })
          }}
          min={50}
          // max={MODEL_LIMITS.MAX_CONTEXT_LENGTH - 200} // 200 is a minimum buffer for token output
          max={1024}
          step={1}
        />
      </div>
      <div className="mt-6 space-y-3">
        <Label className="flex items-center space-x-1">
          <div>Top K:</div>

          <div>{chatSettings.topK}</div>
        </Label>

        <Slider
          value={[chatSettings.topK]}
          onValueChange={topK => {
            onChangeChatSettings({
              ...chatSettings,
              topK: topK[0]
            })
          }}
          min={1}
          // max={MODEL_LIMITS.MAX_CONTEXT_LENGTH - 200} // 200 is a minimum buffer for token output
          max={500}
          step={1}
        />
      </div>
      <div className="mt-6 space-y-3">
        <Label className="flex items-center space-x-1">
          <div>Top P:</div>

          <div>{chatSettings.topP}</div>
        </Label>

        <Slider
          value={[chatSettings.topP]}
          onValueChange={topP => {
            onChangeChatSettings({
              ...chatSettings,
              topP: topP[0]
            })
          }}
          min={0.1}
          // max={MODEL_LIMITS.MAX_CONTEXT_LENGTH - 200} // 200 is a minimum buffer for token output
          max={2}
          step={0.01}
        />
      </div>
      <div className="mt-6 space-y-3">
        <Label className="flex items-center space-x-1">
          <div>Repetition Penalty:</div>

          <div>{chatSettings.repetitionPenalty}</div>
        </Label>

        <Slider
          value={[chatSettings.repetitionPenalty]}
          onValueChange={repetitionPenalty => {
            onChangeChatSettings({
              ...chatSettings,
              repetitionPenalty: repetitionPenalty[0]
            })
          }}
          min={0.1}
          // max={MODEL_LIMITS.MAX_CONTEXT_LENGTH - 200} // 200 is a minimum buffer for token output
          max={2}
          step={0.01}
        />
      </div>
      
    </div>
  )
}