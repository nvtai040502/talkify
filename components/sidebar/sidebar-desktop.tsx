import { Sidebar1 } from '@/components/sidebar/sidebar1'

import { auth } from '@/auth'
import { ChatHistory } from '@/components/sidebar/chat-history'

export async function SidebarDesktop() {
  // const session = await auth()

  // if (!session?.user?.id) {
  //   return null
  // }

  return (
    <Sidebar1 className="peer absolute inset-y-0 z-30 hidden -translate-x-full border-r bg-muted duration-300 ease-in-out data-[state=open]:translate-x-0 lg:flex lg:w-[250px] xl:w-[300px]">
      <ChatHistory />
    </Sidebar1>
  )
}
