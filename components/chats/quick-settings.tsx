"use client"

import { TalkifyContext } from "@/global/context"
import { LLMID } from "@/types/llms"
import { Preset } from "@prisma/client"
import { FC, useContext, useEffect, useRef, useState } from "react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "../ui/dropdown-menu"
import { Button } from "../ui/button"
import { Icons } from "../icons"
import { Input } from "../ui/input"
import { QuickSettingOption } from "./quick-settings-option"

interface QuickSettingsProps {}

export const QuickSettings: FC<QuickSettingsProps> = ({}) => {
  // useHotkey("p", () => setIsOpen(prevState => !prevState))

  const {
    presets,
    selectedPreset,
    chatSettings,
    setSelectedPreset,
    setChatSettings,
  } = useContext(TalkifyContext)

  const inputRef = useRef<HTMLInputElement>(null)

  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState("")

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus()
      }, 100) // FIX: hacky
    }
  }, [isOpen])

  const handleSelectQuickSetting = (
    // item: Tables<"presets"> | Tables<"assistants">,
    // contentType: "presets" | "assistants"
    item: Preset,
    contentType: "presets"
  ) => {
    // if (contentType === "assistants") {
    //   setSelectedAssistant(item as Tables<"assistants">)
    //   setSelectedPreset(null)
    // } else if (contentType === "presets") {
    //   setSelectedPreset(item as Tables<"presets">)
    //   setSelectedAssistant(null)
    // }
    setSelectedPreset(item)
    setChatSettings({
      model: item.model as LLMID,
      prompt: item.prompt || "",
      temperature: item.temperature || 0.8,
      includeWorkspaceInstructions: item.includeWorkspaceInstructions !== null ? item.includeWorkspaceInstructions : true,
      // contextLength: item.context_length,
      // includeProfileContext: item.include_profile_context,
      // embeddingsProvider: item.embeddings_provider as "openai" | "local"
    })
  }

  const checkIfModified = () => {
    if (!chatSettings) return false

    if (selectedPreset) {
      if (
        selectedPreset.includeWorkspaceInstructions !==
        chatSettings.includeWorkspaceInstructions ||
        selectedPreset.model !== chatSettings.model ||
        selectedPreset.prompt !== chatSettings.prompt ||
        selectedPreset.temperature !== chatSettings.temperature
        // selectedPreset.include_profile_context !==
        //   chatSettings.includeProfileContext ||
        // selectedPreset.context_length !== chatSettings.contextLength ||
      ) {
        return true
      }
    } 
    // else if (selectedAssistant) {
    //   if (
    //     selectedAssistant.include_profile_context !==
    //       chatSettings.includeProfileContext ||
    //     selectedAssistant.include_workspace_instructions !==
    //       chatSettings.includeWorkspaceInstructions ||
    //     selectedAssistant.context_length !== chatSettings.contextLength ||
    //     selectedAssistant.model !== chatSettings.model ||
    //     selectedAssistant.prompt !== chatSettings.prompt ||
    //     selectedAssistant.temperature !== chatSettings.temperature
    //   ) {
    //     return true
    //   }
    // }

    return false
  }

  const isModified = checkIfModified()

  const items = [
    ...presets.map(preset => ({ ...preset, contentType: "presets" })),
    // ...assistants.map(assistant => ({
    //   ...assistant,
    //   contentType: "assistants"
    // }))
  ]

  // const selectedAssistantImage = selectedPreset
  //   ? ""
  //   : assistantImages.find(
  //       image => image.path === selectedAssistant?.image_path
  //     )?.base64 || ""
  if (presets.length === 0) return null
  // console.log(presets)
  return (
    <DropdownMenu
      open={isOpen}
      onOpenChange={isOpen => {
        setIsOpen(isOpen)
        setSearch("")
      }}
    >
      <DropdownMenuTrigger className="max-w-[300px]" asChild>
        <Button variant="ghost" className="flex space-x-3 text-xl">
          {selectedPreset && (
            <Icons.robot width={32} height={32} />
          )}

          {/* {selectedAssistant &&
            (selectedAssistantImage ? (
              <Image
                className="rounded"
                src={selectedAssistantImage}
                alt="Assistant"
                width={32}
                height={32}
              />
            ) : (
              <IconRobotFace
                className="bg-primary text-secondary border-primary rounded border-[1px] p-1"
                size={32}
              />
            ))} */}

          <div className="overflow-hidden text-ellipsis">
            {isModified && (selectedPreset 
              // || selectedAssistant
              ) && "Modified "}

            {selectedPreset?.name ||
              // selectedAssistant?.name ||
              "Quick Settings"}
          </div>

          <Icons.chevronDown className="ml-1" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="min-w-[300px] max-w-[500px] space-y-4"
        align="start"
      >
        
          <>
            <Input
              ref={inputRef}
              className="w-full"
              placeholder="Search presets..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              onKeyDown={e => e.stopPropagation()}
            />

            {!!(selectedPreset 
            // || selectedAssistant
            ) && (
              <QuickSettingOption
                contentType={"presets"
                  // selectedPreset ? "presets" : "assistants"
                }
                isSelected={true}
                item={
                  selectedPreset 
                  // ||
                  // (selectedAssistant as
                  //   | Tables<"presets">
                  //   | Tables<"assistants">)
                }
                onSelect={() => {
                  setSelectedPreset(null)
                  // setSelectedAssistant(null)
                }}
                image={selectedPreset ? "" : 
                // selectedAssistantImage
                ""
              }
              />
            )}

            {items
              .filter(
                item =>
                  item.name.toLowerCase().includes(search.toLowerCase()) &&
                  item.id !== selectedPreset?.id 
                  // &&
                  // item.id !== selectedAssistant?.id
              )
              .map(({ contentType, ...item }) => (
                <QuickSettingOption
                  key={item.id}
                  contentType={contentType as "presets" 
                  // | "assistants"
                }
                  isSelected={false}
                  item={item}
                  onSelect={() =>
                    handleSelectQuickSetting(
                      item,
                      contentType as "presets" 
                      // | "assistants"
                    )
                  }
                  image={
                    // contentType === "assistants"
                    //   ? assistantImages.find(
                    //       image =>
                    //         image.path ===
                    //         (item as Tables<"assistants">).image_path
                    //     )?.base64 || ""
                    //   : ""
                    ""
                  }
                />
              ))}
          </>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}