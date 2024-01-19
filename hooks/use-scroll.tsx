// Modified from https://github.com/mckaywrigley/chatbot-ui/blob/main/components/chat/chat-hooks/use-scroll.tsx

import { useCallback, useContext, useEffect, useRef, useState } from "react"
import { TalkifyContext } from "../global/context"
import { Message } from "ai"

export const useScroll = ({
  isGenerating,
  chatMessages
}: {
  isGenerating: boolean
  chatMessages: Message[]
}) => {
  // const { isGenerating, chatMessages } = useContext(TalkifyContext)

  const messagesStartRef = useRef<HTMLDivElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const isAutoScrolling = useRef(false)

  const [isAtTop, setIsAtTop] = useState(false)
  const [isAtBottom, setIsAtBottom] = useState(false)
  const [userScrolled, setUserScrolled] = useState(false)
  const [isOverflowing, setIsOverflowing] = useState(false)
  useEffect(() => {
    setUserScrolled(false)

    if (!isGenerating && userScrolled) {
      setUserScrolled(false)
    }
  }, [isGenerating])

  useEffect(() => {
    if (isGenerating && !userScrolled) {
      scrollToBottom()
    }
  }, [chatMessages])

  const handleScroll = useCallback((e: any) => {
    const bottom =
    Math.round(e.target.scrollHeight) - Math.round(e.target.scrollTop) ===
    Math.round(e.target.clientHeight)
    setIsAtBottom(bottom)

    const top = e.target.scrollTop === 0
    setIsAtTop(top)

    if (!bottom && !isAutoScrolling.current) {
      setUserScrolled(true)
    } else {
      setUserScrolled(false)
    }
    
    const isOverflow = e.target.scrollHeight > e.target.clientHeight
    setIsOverflowing(isOverflow)
  }, [])

  const scrollToTop = useCallback(() => {
    if (messagesStartRef.current) {
      messagesStartRef.current.scrollIntoView({ behavior: "instant" })
    }
  }, [])

  const scrollToBottom = useCallback(() => {
    isAutoScrolling.current = true

    setTimeout(() => {
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: "instant" })
      }

      isAutoScrolling.current = false
    }, 0)
  }, [])

  return {
    messagesStartRef,
    messagesEndRef,
    isAtTop,
    isAtBottom,
    userScrolled,
    isOverflowing,
    handleScroll,
    scrollToTop,
    scrollToBottom,
    setIsAtBottom
  }
}