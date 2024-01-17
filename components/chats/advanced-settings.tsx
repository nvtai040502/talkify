import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from "@/components/ui/collapsible"
import { FC, useState } from "react"
import { Icons } from "../icons"

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