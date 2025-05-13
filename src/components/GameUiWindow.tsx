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
  if (!isVisible) return null;

  return (
    <div
      className="fixed inset-0 bg-info-banner-bkg-color-light dark:bg-info-banner-bkg-color text-primary-text-color-light dark:text-primary-text-color z-50"
      id="game-ui-window"
    >
      {/* Close Button */}
      <CloseButton onClose={onClose} />

      {/* Window Content */}
      <div className="h-full p-4" id="window-children">
        {children}
      </div>
    </div>
  );
};

export default GameUiWindow;
