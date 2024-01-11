import { nanoid } from '@/lib/utils'
import { Chat } from '@/components/chat'
import { db } from '@/lib/db'

export default async function IndexPage() {
  const chat = await db.chat.create({
    data: {
      name: "Home"
    }
  })

  return <Chat id={String(chat.id)} />
}
