"use client";

import React from "react";
import GameUiWindow from "@/src/components/GameUiWindow";
import PageContentLoader from "@/src/components/PageContentLoader";
import { ContentDataProps } from "@/src/types/data-props";

interface GameInfoWindowProps {
  isVisible: boolean;
  onClose: () => void;
  infoData: ContentDataProps[];
}

const GameInfoWindow: React.FC<GameInfoWindowProps> = ({
  isVisible,
  onClose,
  infoData,
}) => {
  return (
    <GameUiWindow isVisible={isVisible} onClose={onClose}>
      <PageContentLoader contentData={infoData} />
    </GameUiWindow>
  );
};

export default GameInfoWindow;
