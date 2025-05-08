"use client";

import React from "react";
import Image from "next/image";

interface InfoButtonProps {
  onClick: () => void;
}

const InfoButton: React.FC<InfoButtonProps> = ({ onClick }) => {
  return (
    <button
      className="fixed bottom-4 right-4 flex items-center justify-center bg-blue-500 dark:bg-blue-700 text-white rounded-full"
      id="info-button"
      onClick={onClick}
    >
      <Image
        src="/webps/games/game-button.webp"
        alt="Info Icon"
        height={120}
        width={120}
        className="w-6 h-6"
      />
      <span className="sr-only">Info</span>
    </button>
  );
};

export default InfoButton;
