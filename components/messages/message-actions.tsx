'use client'

import { type Message } from 'ai'

import { Button } from '@/components/ui/button'
import { useCopyToClipboard } from '@/lib/hooks/use-copy-to-clipboard'
import { cn } from '@/lib/utils'
import { Icons } from '../icons'
import { useEffect, useState } from 'react'
import { WithTooltip } from '../ui/with-tooltip'
import { UseChatHelpers } from 'ai/react/dist'

export const MESSAGE_ICON_SIZE = 18

interface MessageActionsProps extends Pick<
UseChatHelpers,
| 'isLoading'
| 'reload'

> {
  isAssistant: boolean
  isLast: boolean
  // isEditing: boolean
  isHovering: boolean
  onCopy: () => void
  // onEdit: () => void
}

export function MessageActions({
  isAssistant,
  isLast,
  // isEditing,
  isLoading,
  reload,
  isHovering,
  onCopy,
  // onEdit,
}: MessageActionsProps) {
  // const { isCopied, copyToClipboard } = useCopyToClipboard({ timeout: 2000 })

  // const onCopy = () => {
  //   if (isCopied) return
  //   copyToClipboard(message.content)
  // }

  const [showCheckmark, setShowCheckmark] = useState(false)

  const handleCopy = () => {
    onCopy()
    setShowCheckmark(true)
  }

  const handleForkChat = async () => {}

  useEffect(() => {
    if (showCheckmark) {
      const timer = setTimeout(() => {
        setShowCheckmark(false)
      }, 2000)

      return () => clearTimeout(timer)
    }
  }, [showCheckmark])

  return (isLast && isLoading) ? null : (
    <div className="text-muted-foreground flex items-center space-x-2 ">
      {/* {((isAssistant && isHovering) || isLast) && (
        <WithTooltip
          delayDuration={1000}
          side="bottom"
          display={<div>Fork Chat</div>}
          trigger={
            <IconGitFork
              className="cursor-pointer hover:opacity-50"
              size={MESSAGE_ICON_SIZE}
              onClick={handleForkChat}
            />
          }
        />
      )} */}

      {!isAssistant && isHovering && (
        // <WithTooltip
        //   delayDuration={1000}
        //   side="bottom"
        //   display={<div>Edit</div>}
        //   trigger={
        //     <Icons.edit
        //       className="cursor-pointer hover:opacity-50"
        //       size={MESSAGE_ICON_SIZE}
        //       onClick={onEdit}
        //     />
        //   }
        // />
        <></>
      )}

      {(isHovering || isLast) && (
        <WithTooltip
          delayDuration={1000}
          side="bottom"
          display={<div>Copy</div>}
          trigger={
            showCheckmark ? (
              <Icons.check size={MESSAGE_ICON_SIZE} />
            ) : (
              <Icons.copy
                className="cursor-pointer hover:opacity-50"
                size={MESSAGE_ICON_SIZE}
                onClick={handleCopy}
              />
            )
          }
        />
      )}

      {isLast && (
        <WithTooltip
          delayDuration={1000}
          side="bottom"
          display={<div>Regenerate</div>}
          trigger={
            <Icons.repeat
              className="cursor-pointer hover:opacity-50"
              size={MESSAGE_ICON_SIZE}
              onClick={() => reload()}
            />
          }
        />
      )}

      {/* {1 > 0 && isAssistant && <MessageReplies />} */}
    </div>
  )
}
