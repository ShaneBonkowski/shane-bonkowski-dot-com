"use client";

import { createContext, useContext, useEffect, useState } from "react";

const PointerHoverContext = createContext(false);

export function usePointerHover() {
  return useContext(PointerHoverContext);
}

export default function PointerInputProvider({ children }: { children: React.ReactNode }) {
  const [isHoverable, setIsHoverable] = useState(false);

  useEffect(() => {
    const handlePointer = (event: PointerEvent) => {
      if (event.pointerType !== "touch" && event.pointerType !== "mouse" && event.pointerType !== "pen") return;
      const canHover = event.pointerType !== "touch";
      const root = document.documentElement;
      if (root.hasAttribute("data-touch-input") === !canHover) return;
      root.toggleAttribute("data-touch-input", !canHover);
      setIsHoverable(canHover);
    };

    document.addEventListener("pointerdown", handlePointer, true);
    document.addEventListener("pointermove", handlePointer, true);
    return () => {
      document.removeEventListener("pointerdown", handlePointer, true);
      document.removeEventListener("pointermove", handlePointer, true);
    };
  }, []);

  return (
    <PointerHoverContext.Provider value={isHoverable}>
      {children}
    </PointerHoverContext.Provider>
  );
}
