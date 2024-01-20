import { isMacOs } from "@/lib/utils";
import { useEffect } from "react";

const useHotkey = (keys: string[], callback: () => void): void => {
  useEffect(() => {
    const modifierKey = isMacOs() ? "Meta" : "Control";
    const pressedKeys = new Set<string>();

    const handleKeyDown = (event: KeyboardEvent): void => {
      pressedKeys.add(event.key.toLowerCase());

      const isKeyCombinationPressed = keys.every(
        k => (k.toLowerCase() === modifierKey.toLowerCase() && pressedKeys.has(modifierKey.toLowerCase())) || pressedKeys.has(k.toLowerCase())
      );

      if (isKeyCombinationPressed) {
        event.preventDefault();
        callback();
      }
    };

    const handleKeyUp = (event: KeyboardEvent): void => {
      pressedKeys.delete(event.key.toLowerCase());
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [keys, callback]);
};

export default useHotkey;
