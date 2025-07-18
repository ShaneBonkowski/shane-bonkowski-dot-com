"use client";

import React from "react";
import CloseButton from "@/src/components/CloseButton";

interface GameUiWindowProps {
  isVisible: boolean;
  onClose: (() => void) | null;
  overrideBgColor?: string;
  overrideTextColor?: string;
  children: React.ReactNode;
}

const GameUiWindow: React.FC<GameUiWindowProps> = ({
  isVisible,
  onClose,
  overrideBgColor,
  overrideTextColor,
  children,
}) => {
  return (
    <div
      className={`
        app-mode z-30 overflow-y-auto p-4 fixed h-full w-full ${
          isVisible ? "" : "hidden"
        }
        ${
          overrideBgColor
            ? overrideBgColor
            : "bg-game-menu-bkg-color-light dark:bg-game-menu-bkg-color"
        } 
        ${
          overrideTextColor
            ? overrideTextColor
            : "text-primary-text-color-light dark:text-primary-text-color"
        }`}
      id="game-ui-window"
      aria-label="Game UI window"
    >
      {children}

      {/* Close Button... only if onClose is provided */}
      {onClose && (
        <CloseButton onClose={onClose} aria-label="Close game UI window" />
      )}
    </div>
  );
};

export default GameUiWindow;
