export const KEYBOARD_SHORTCUT:KeyboartShorcutType[] = [
  {
    title: "Show Helps",
    key: "SHOW_HELPS",
    keyboard: ["Control", "/"]  
  },
  {
    title: "New Chat",
    key: "NEW_CHAT",
    keyboard: ["Control", "Shift", "O"]  
  },
  {
    title: "Focus Chat Input",
    key: "FOCUS_CHAT",
    keyboard: ["Shift", "Escape"]  
  },
  {
    title: "Toggle Sidebar",
    key: "TOGGLE_SIDEBAR",
    keyboard: ["Control", "Shift", "S"]  
  }

] 

export type KeyboartShorcutType = {
  title: string,
  key: "SHOW_HELPS" 
      |"SHOW_WORKSPACES" 
      |"NEW_CHAT" 
      |"FOCUS_CHAT" 
      |"OPEN_SETTINGS" 
      |"OPEN_QUICK_SETTINGS"
      |"TOGGLE_SIDEBAR"
  keyboard: string[]
}
  