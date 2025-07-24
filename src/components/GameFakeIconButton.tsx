"use client";

import React from "react";
import { FaUndo } from "react-icons/fa";

interface GameFakeIconButtonProps {
  icon?: React.ReactNode;
  sizeFallback?: number; // only gets used if icon is not provided
  invisible?: boolean;
}

/* "Fake" button that can serve as a spacer that is the same size as an actual button.
 * This is useful for layout purposes, especially when you want to maintain the same
 * size as a real button but don't want it to be interactive.
 */
const GameFakeIconButton: React.FC<GameFakeIconButtonProps> = ({
  icon = null,
  sizeFallback = 30,
  invisible = false,
}) => {
  return (
    <div
      className={`p-[8px] z-20 flex items-center justify-center ${
        invisible ? "invisible" : ""
      }`}
      aria-label="Fake Button (Spacer)"
    >
      {icon ?? <FaUndo size={sizeFallback} />}
    </div>
  );
};

export default GameFakeIconButton;
