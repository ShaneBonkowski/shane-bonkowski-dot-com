import React, { useState, useEffect } from "react";
import CharacterInfoBar from "@/src/games/cowpoke/CharacterInfoBar";
import { CHARACTER_TYPES } from "@/src/games/cowpoke/character";
import { FaRobot, FaHandPointer } from "react-icons/fa";
import { GiRabbit, GiSnail } from "react-icons/gi";
import GameIconButton from "@/src/components/GameIconButton";

export default function UpperHud() {
  const [isVisible, setIsVisible] = useState(true);
  const [isAutoMode, setIsAutoMode] = useState(false);
  const [isFastMode, setIsFastMode] = useState(false);

  const handleToggleAutoMode = () => {
    setIsAutoMode((prev) => !prev);
    document.dispatchEvent(new CustomEvent("toggleAutomatic"));
  };

  const handleToggleSpeedUp = () => {
    setIsFastMode((prev) => !prev);
    document.dispatchEvent(new CustomEvent("toggleSpeedUp"));
  };

  useEffect(() => {
    const handleUiMenuOpen = () => {
      setIsVisible(false);
    };
    const handleUiMenuClose = () => {
      setIsVisible(true);
    };

    document.addEventListener("uiMenuOpen", handleUiMenuOpen);
    document.addEventListener("uiMenuClose", handleUiMenuClose);

    return () => {
      document.removeEventListener("uiMenuOpen", handleUiMenuOpen);
      document.removeEventListener("uiMenuClose", handleUiMenuClose);
    };
  });

  return (
    <>
      {isVisible && (
        <div className="absolute flex flex-row items-center justify-between gap-20 top-5 right-5">
          <CharacterInfoBar
            characterType={CHARACTER_TYPES.PLAYER}
            name="Player"
            level={0}
            health={0}
            maxHealth={0}
            xp={0}
            maxXp={0}
            position="top-left"
          ></CharacterInfoBar>

          <div className="flex flex-row items-center gap-5">
            <GameIconButton
              onPointerDown={handleToggleAutoMode}
              icon={
                isAutoMode ? <FaHandPointer size={30} /> : <FaRobot size={30} />
              }
              ariaLabel="Toggle Auto Mode"
              darkModeLight={true} // Use light mode colors even in dark mode since it looks better on the bkg
            />
            <GameIconButton
              onPointerDown={handleToggleSpeedUp}
              icon={isFastMode ? <GiSnail size={30} /> : <GiRabbit size={30} />}
              ariaLabel="Speed Up/Slow Down"
              darkModeLight={true} // Use light mode colors even in dark mode since it looks better on the bkg
            />
          </div>

          <CharacterInfoBar
            characterType={CHARACTER_TYPES.ENEMY}
            name="Enemy"
            level={0}
            health={0}
            maxHealth={0}
            xp={0}
            maxXp={0}
            position="top-right"
          ></CharacterInfoBar>
        </div>
      )}
    </>
  );
}
