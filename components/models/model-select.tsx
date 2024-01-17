import { TalkifyContext } from "@/hooks/context"
import { LLM, LLMID } from "@/types/llms"
import { FC, useContext, useEffect, useRef, useState } from "react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "../ui/dropdown-menu"
import { Button } from "../ui/button"
import { Icons } from "../icons"
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs"
import { Input } from "../ui/input"
import { ModelOption } from "./model-option"

interface ModelSelectProps {
  hostedModelOptions: LLM[]
  localModelOptions: LLM[]
  selectedModelId: string
  onSelectModel: (modelId: LLMID) => void
}

export const ModelSelect: FC<ModelSelectProps> = ({
  hostedModelOptions,
  localModelOptions,
  selectedModelId,
  onSelectModel
}) => {
  const { availableLocalModels } = useContext(TalkifyContext)

  const inputRef = useRef<HTMLInputElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)

  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState("")
  const [tab, setTab] = useState<"hosted" | "local">("hosted")


  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus()
      }, 100) // FIX: hacky
    }
  }, [isOpen])


  const handleSelectModel = (modelId: LLMID) => {
    onSelectModel(modelId)
    setIsOpen(false)
  }

  const ALL_MODELS = [
    ...hostedModelOptions,
    ...localModelOptions,
  ]

  const groupedModels = ALL_MODELS.reduce<Record<string, LLM[]>>(
    (groups, model) => {
      const key = model.provider
      if (!groups[key]) {
        groups[key] = []
      }
      groups[key].push(model)
      return groups
    },
    {}
  )

  const SELECTED_MODEL = ALL_MODELS.find(
    model => model.modelId === selectedModelId
  )

  if (!SELECTED_MODEL) return null

  const usingLocalModels = availableLocalModels.length > 0

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
           
              <Icons.robot
                // modelId={SELECTED_MODEL.modelId as LLMID}
                width={26}
                height={26}
              />

            <div className="flex items-center ml-2">
              {SELECTED_MODEL.modelName}
            </div>
          </div>

          <Icons.chevronDown />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="p-2 space-y-2 overflow-auto"
        style={{ width: triggerRef.current?.offsetWidth }}
        align="start"
      >
        <Tabs value={tab} onValueChange={(value: any) => setTab(value)}>
          {usingLocalModels && (
            <TabsList defaultValue="hosted" className="grid grid-cols-2">
              <TabsTrigger value="hosted">Hosted</TabsTrigger>

              <TabsTrigger value="local">Local</TabsTrigger>
            </TabsList>
          )}
        </Tabs>

        <Input
          ref={inputRef}
          className="w-full"
          placeholder="Search models..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />

        <div className="max-h-[300px] overflow-auto">
          {Object.entries(groupedModels).map(([provider, models]) => {
            const filteredModels = models
              .filter(model => {
                if (tab === "hosted") return model.provider !== "ollama"
                if (tab === "local") return model.provider === "ollama"
              })
              .filter(model =>
                model.modelName.toLowerCase().includes(search.toLowerCase())
              )
              .sort((a, b) => a.provider.localeCompare(b.provider))

            if (filteredModels.length === 0) return null

            return (
              <div key={provider}>
                <div className="mb-1 ml-2 text-xs font-bold tracking-wide opacity-50">
                    {provider.toLocaleUpperCase()}
                </div>

                <div className="mb-4">
                  {filteredModels.map(model => {
                    return (
                      <div
                        key={model.modelId}
                        className="flex items-center space-x-1"
                      >
                        {selectedModelId === model.modelId && (
                          <Icons.check className="ml-2" size={32} />
                        )}

                        <ModelOption
                          key={model.modelId}
                          model={model}
                          onSelect={() => handleSelectModel(model.modelId)}
                        />
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}