import { Chat } from '@/components/chats/chat'
import axios from 'axios'
import {v4 as uuidV4} from "uuid"
export default async function IndexPage() {
  const id = uuidV4()
  
  return (
  <>
  
  <Chat id={id} />
  </>
  )
}
