import { isMacOs } from "@/lib/utils";
import React from "react";

export const ShortcutKey = ({keyName}:{keyName: string}) => {
  let displayKey = keyName;

  if (keyName.toLowerCase() === "control") {
    displayKey = isMacOs() ? "⌘" : "Ctrl";
  }
  if (keyName.toLowerCase() === "escape") {
    displayKey = "Esc"
  }
  return (
    <div className="min-w-[20px] p-1 text-center border-accent border">
      {displayKey}
    </div>
  );
};

export default ShortcutKey;
