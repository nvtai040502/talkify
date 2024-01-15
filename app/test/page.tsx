"use client"
import { TalkifyContext } from '@/lib/hooks/context';
import { useChatHandler } from '@/lib/hooks/chat-hook/use-chat-handler';
import { useContext, useEffect, useState } from 'react';
import toast from 'react-hot-toast';

export default function App() {
  const {chatMessages} = useContext(TalkifyContext)
  const { handleSendMessage } = useChatHandler()
  useEffect(() => {
    handleSendMessage("hello", chatMessages, false)
  }, [])
  return (
    <div>
      <p>{chatMessages.length}</p>
    </div>
  );
}
