"use client"
import {
  IconBrandGithub,
  IconBrandX,
  IconHelpCircle,
  IconQuestionMark
} from "@tabler/icons-react"
import Link from "next/link"
import { FC, useEffect, useState } from "react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "../ui/dropdown-menu"
// import { Announcements } from "../utility/announcements"
import useHotkey from "@/hooks/use-hotkey"
import { isMacOs } from "@/lib/utils"
import { KEYBOARD_SHORTCUT } from "@/config/keyboard-shortcut"
import ShortcutKey from "./short-key"

interface ChatHelpProps {}

export const ChatHelp: FC<ChatHelpProps> = ({}) => {
  const showHelpShortcut = KEYBOARD_SHORTCUT.find((item) => item.key === "SHOW_HELPS");
  if (!showHelpShortcut) {
    console.log("may be the key in show helps will change")
  }

  useHotkey(showHelpShortcut!.keyboard, () => setIsOpen(prevState => !prevState))
  
  const [isOpen, setIsOpen] = useState(false)

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <IconQuestionMark className="bg-primary text-secondary h-[24px] w-[24px] cursor-pointer rounded-full p-0.5 opacity-60 hover:opacity-50 lg:h-[30px] lg:w-[30px] lg:p-1" />
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        <DropdownMenuLabel className="flex items-center justify-between">
          <div className="flex space-x-2">
            <Link
              className="cursor-pointer hover:opacity-50"
              href="https://twitter.com/NVTai0452"
              target="_blank"
              rel="noopener noreferrer"
            >
              <IconBrandX />
            </Link>

            <Link
              className="cursor-pointer hover:opacity-50"
              href="https://github.com/nvtai040502"
              target="_blank"
              rel="noopener noreferrer"
            >
              <IconBrandGithub />
            </Link>
          </div>

          <div className="flex space-x-2">
            {/* <Announcements /> */}

            <Link
              className="cursor-pointer hover:opacity-50"
              href="/help"
              target="_blank"
              rel="noopener noreferrer"
            >
              <IconHelpCircle size={24} />
            </Link>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        {KEYBOARD_SHORTCUT.map((item, index) => (
          <DropdownMenuItem className="flex justify-between w-80" key={index}>
            <div>{item.title}</div>
            <div className="flex gap-2 opacity-60">
              {item.keyboard.map((keyName, index) => (
                <ShortcutKey key={index} keyName={keyName} />
              ))}
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}