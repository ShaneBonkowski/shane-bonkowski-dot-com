"use client";

import React from "react";
import { FaInfoCircle } from "react-icons/fa";
import GameIconButton from "@/src/components/GameIconButton";

interface InfoButtonProps {
  onPointerDown: () => void;
}

const InfoButton: React.FC<InfoButtonProps> = ({ onPointerDown }) => {
  return (
    <GameIconButton
      onPointerDown={onPointerDown}
      icon={<FaInfoCircle size={30} />}
      ariaLabel="Info"
      className="fixed bottom-5 right-5"
    />
  );
};

export default InfoButton;
