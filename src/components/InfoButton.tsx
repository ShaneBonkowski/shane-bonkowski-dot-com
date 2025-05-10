"use client";

import React from "react";
import { FaInfoCircle } from "react-icons/fa";
import GameIconButton from "@/src/components/GameIconButton";

interface InfoButtonProps {
  onClick: () => void;
}

const InfoButton: React.FC<InfoButtonProps> = ({ onClick }) => {
  return (
    <GameIconButton
      onClick={onClick}
      icon={<FaInfoCircle size={30} />}
      ariaLabel="Info"
      className="fixed bottom-5 right-5"
    />
  );
};

export default InfoButton;
