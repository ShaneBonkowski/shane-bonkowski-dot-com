"use client";

import React from "react";
import CloseButton from "@/src/components/CloseButton";

interface GameUiWindowProps {
  isVisible: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const GameUiWindow: React.FC<GameUiWindowProps> = ({
  isVisible,
  onClose,
  children,
}) => {
  return (
    <div
      className={`
        overflow-y-auto p-4 fixed h-full w-full ${isVisible ? "" : "hidden"}
        bg-game-menu-bkg-color-light dark:bg-game-menu-bkg-color 
        text-primary-text-color-light dark:text-primary-text-color z-50`}
      id="game-ui-window"
      aria-label="Game UI window"
    >
      {children}

      {/* Close Button */}
      <CloseButton onClose={onClose} aria-label="Close game UI window" />
    </div>
  );
};

export default GameUiWindow;
