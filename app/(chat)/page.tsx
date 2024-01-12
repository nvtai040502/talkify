import { nanoid } from '@/lib/utils'
import { Chat } from '@/components/chat'
import { db } from '@/lib/db'
import {v4 as uuidV4} from "uuid"
export default async function IndexPage() {
  const id = uuidV4()
  return <Chat id={id} />
}
