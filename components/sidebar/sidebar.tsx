"use client"
import { cn, createUrl, parsedSearchParams } from "@/lib/utils";
import { Button } from "../ui/button";
import { useState } from "react";
import { SIDEBAR_WIDTH } from "@/app/(chat)/layout";
import { IconChevronCompactRight } from "@tabler/icons-react";
import { Tabs } from "../ui/tabs";
import { ContentType } from "@/types/content";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { SidebarSwitcher } from "./sidebar-switcher";
import { SidebarContentContainer } from "./sidebar-content-container";
import { searchParamsSchema } from "@/validations/search-params";
import { KEYBOARD_SHORTCUT } from "@/config/keyboard-shortcut";
import useHotkey from "@/hooks/use-hotkey";

const Sidebar = () => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const {tab: tabValue} = searchParamsSchema.parse(parsedSearchParams(searchParams))
  const [showSidebar, setShowSidebar] = useState(
    localStorage.getItem("showSidebar") === "true"
  )
  const [contentType, setContentType] = useState<ContentType>(tabValue || "chats")
  const handleToggleSidebar = () => {
    setShowSidebar(prevState => !prevState)
    localStorage.setItem("showSidebar", String(!showSidebar))
  }
  const toggleSidebarShortcut = KEYBOARD_SHORTCUT.find((item) => item.key === "TOGGLE_SIDEBAR");
  if (!toggleSidebarShortcut) {
    console.log("may be the key in toggle sidebar will be changed")
  }

  useHotkey(toggleSidebarShortcut!.keyboard, () => handleToggleSidebar)
  return ( 
    <>
    <Button
        className={cn(
          "absolute left-[4px] top-[50%] z-10 h-[32px] w-[32px] cursor-pointer"
        )}
        style={{
          marginLeft: showSidebar ? `${SIDEBAR_WIDTH}px` : "0px",
          transform: showSidebar ? "rotate(180deg)" : "rotate(0deg)"
        }}
        variant="ghost"
        size="icon"
        onClick={handleToggleSidebar}
      >
        <IconChevronCompactRight size={24} />
      </Button>

      <div
        className={cn("border-r-2 duration-200 dark:border-none")}
        style={{
          // Sidebar
          minWidth: showSidebar ? `${SIDEBAR_WIDTH}px` : "0px",
          maxWidth: showSidebar ? `${SIDEBAR_WIDTH}px` : "0px",
          width: showSidebar ? `${SIDEBAR_WIDTH}px` : "0px"
        }}
      >
        {showSidebar && (
          <Tabs
            className="flex h-full"
            value={contentType}
            onValueChange={(tabValue: string) => {
              setContentType(tabValue as ContentType);
              const newSearchParams = new URLSearchParams(searchParams);
              newSearchParams.set("tab", tabValue);
              router.replace(createUrl(pathname, newSearchParams));
            }}
          >
            <SidebarSwitcher onContentTypeChange={setContentType} />

            <SidebarContentContainer contentType={contentType} showSidebar={showSidebar} />
          </Tabs>
        )}
      </div>
    </>
  );
}
 
export default Sidebar;