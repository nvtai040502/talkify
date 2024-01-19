import Image from "next/image"
import { FC } from "react"
import { DropdownMenuItem } from "../ui/dropdown-menu"
import { Preset } from "@prisma/client"
import { Icons } from "../icons"

interface QuickSettingOptionProps {
  contentType: "presets" 
  // | "assistants"
  isSelected: boolean
  item: Preset 
  // | Tables<"assistants">
  onSelect: () => void
  image: string
}

export const QuickSettingOption: FC<QuickSettingOptionProps> = ({
  contentType,
  isSelected,
  item,
  onSelect,
  image
}) => {
  return (
    <DropdownMenuItem
      tabIndex={0}
      className="cursor-pointer items-center"
      onSelect={onSelect}
    >
      <div className="w-[32px]">
        {contentType === "presets" ? (
          <Icons.robot  width={32} height={32} />
        ) : image ? (
          <Image
            className="rounded"
            src={image}
            alt="Assistant"
            width={32}
            height={32}
          />
        ) : (
          <Icons.robot
            className="bg-primary text-secondary border-primary rounded border-[1px] p-1"
            size={32}
          />
        )}
      </div>

      <div className="ml-4 flex grow flex-col space-y-1">
        <div className="text-md font-bold">{item.name}</div>

        <div className="text-sm font-light">
          {item.description || "No description."}
        </div>
      </div>

      <div className="min-w-[40px]">
        {isSelected ? (
          <Icons.check className="ml-4" size={20} />
        ) : null}
      </div>
    </DropdownMenuItem>
  )
}