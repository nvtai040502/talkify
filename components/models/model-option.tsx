import { TalkifyContext } from "@/hooks/context"
import { LLM } from "@/types/llms"
import { FC, useContext, useEffect } from "react"
import { Icons } from "../icons"

interface ModelOptionProps {
  model: LLM
  onSelect: () => void
}

export const ModelOption: FC<ModelOptionProps> = ({ model, onSelect }) => {

  const handleSelectModel = () => {
    onSelect()
  }

  return (
    <div
      className="hover:bg-accent flex w-full cursor-pointer justify-start space-x-3 truncate rounded p-2 hover:opacity-50"
      onClick={handleSelectModel}
    >
      <div className="flex items-center space-x-2">

          <Icons.robot width={28} height={28} />

        <div className="text-sm font-semibold">{model.modelName}</div>
      </div>
    </div>
  )
}