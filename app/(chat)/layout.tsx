import Sidebar from "@/components/sidebar/sidebar"

interface ChatLayoutProps {
  children: React.ReactNode,
}
export const SIDEBAR_WIDTH = 350
export default async function ChatLayout({ children}: ChatLayoutProps) {
  return (
    <div className="flex h-full w-full">
      {/* <CommandK /> */}

      <Sidebar/>

      <div className="bg-muted/50 flex grow flex-col">
          {children}
      </div>
    </div>
  )
}