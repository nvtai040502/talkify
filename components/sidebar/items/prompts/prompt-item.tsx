import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { TextareaAutosize } from "@/components/ui/textarea-autosize"
import { IconPencil } from "@tabler/icons-react"
import { FC, useState } from "react"
import { SidebarItem } from "../all/sidebar-display-item"
import { Prompt } from "@prisma/client"

interface PromptItemProps {
  prompt: Prompt
}

export const PromptItem: FC<PromptItemProps> = ({ prompt }) => {
  const [name, setName] = useState(prompt.name)
  const [content, setContent] = useState(prompt.content)
  const [isTyping, setIsTyping] = useState(false)
  return (
    <SidebarItem
      item={prompt}
      isTyping={isTyping}
      contentType="prompts"
      icon={<IconPencil size={30} />}
      updateState={{ name, content, id: prompt.id, }}
      renderInputs={() => (
        <>
          <div className="space-y-1">
            <Label>Name</Label>

            <Input
              placeholder="Prompt name..."
              value={name}
              onChange={e => setName(e.target.value)}
              // maxLength={PROMPT_NAME_MAX}
              onCompositionStart={() => setIsTyping(true)}
              onCompositionEnd={() => setIsTyping(false)}
            />
          </div>

          <div className="space-y-1">
            <Label>Prompt</Label>

            <TextareaAutosize
              placeholder="Prompt..."
              value={content || ""}
              onValueChange={setContent}
              minRows={6}
              maxRows={20}
              onCompositionStart={() => setIsTyping(true)}
              onCompositionEnd={() => setIsTyping(false)}
            />
          </div>
        </>
      )}
    />
  )
}