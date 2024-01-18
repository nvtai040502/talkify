import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from "@/components/ui/collapsible"
import { FC, useContext, useState } from "react"
import { Icons } from "../icons"
import { ChatSettings } from "@/types/chat"
import { Label } from "../ui/label"
import { Slider } from "../ui/slider"
import { Checkbox } from "../ui/checkbox"
import { WithTooltip } from "../ui/with-tooltip"
import { TalkifyContext } from "@/hooks/context"

interface AdvancedSettingsProps {
  children: React.ReactNode
}

export const AdvancedSettings: FC<AdvancedSettingsProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(
    false
    // localStorage.getItem("advanced-settings-open") === "true"
  )

  const handleOpenChange = (isOpen: boolean) => {
    setIsOpen(isOpen)
    // localStorage.setItem("advanced-settings-open", String(isOpen))
  }

  return (
    <Collapsible className="pt-2" open={isOpen} onOpenChange={handleOpenChange}>
      <CollapsibleTrigger className="hover:opacity-50">
        <div className="flex items-center font-bold">
          <div className="mr-1">Advanced Settings</div>
          {isOpen ? (
            <Icons.chevronDown size={20} />
          ) : (
            <Icons.chevronRight size={20}  />
          )}
        </div>
      </CollapsibleTrigger>

      <CollapsibleContent className="mt-4">{children}</CollapsibleContent>
    </Collapsible>
  )
}

interface AdvancedContentProps {
  chatSettings: ChatSettings
  onChangeChatSettings: (value: ChatSettings) => void
  showTooltip: boolean
}

export const AdvancedContent: FC<AdvancedContentProps> = ({
  chatSettings,
  onChangeChatSettings,
  showTooltip
}) => {
  const {
    selectedWorkspace,
  } = useContext(TalkifyContext)
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
      <div className="mt-4 flex items-center space-x-2">
        <Checkbox
          checked={chatSettings.includeWorkspaceInstructions}
          onCheckedChange={(value: boolean) =>
            // console.log(value)
            onChangeChatSettings({
              ...chatSettings,
              includeWorkspaceInstructions: value
            })
          }
        />

        <Label>Chats Include Workspace Instructions</Label>

        {showTooltip && (
          <WithTooltip
            delayDuration={0}
            display={
              <div className="w-[400px] p-3">
                {selectedWorkspace?.instructions ||
                  "No workspace instructions."}
              </div>
            }
            trigger={
              <Icons.plusCircle className="cursor-hover:opacity-50" size={16} />
            }
          />
        )}
      </div>

      
    </div>
  )
}