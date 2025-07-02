"use client";

import React from "react";
import GameUiWindow from "@/src/components/GameUiWindow";

interface GameInfoWindowProps {
  isVisible: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const GameInfoWindow: React.FC<GameInfoWindowProps> = ({
  isVisible,
  onClose,
  children,
}) => {
  return (
    <GameUiWindow
      isVisible={isVisible}
      onClose={onClose}
      aria-label="Game information window"
    >
      {children}
    </GameUiWindow>
  );
};

export default GameInfoWindow;
