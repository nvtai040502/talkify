import Sidebar from "@/components/sidebar/sidebar"

interface ChatLayoutProps {
  children: React.ReactNode,
}
export const SIDEBAR_WIDTH = 350
export default async function ChatLayout({ children}: ChatLayoutProps) {
  return (
    <div className="flex w-full h-full">
      {/* <CommandK /> */}

      <Sidebar/>

      <div className="flex flex-col bg-muted/50 grow">
          {children}
      </div>
    </div>
  )
}