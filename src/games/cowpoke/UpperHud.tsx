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

    // If auto mode is turned off, also turn off speed up mode
    if (isAutoMode) {
      setIsFastMode(false);
      document.dispatchEvent(new CustomEvent("toggleSpeedUp"));
    }
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
  }, []);

  return (
    <div
      id="upper-hud"
      className={`absolute flex flex-row items-center justify-between gap-20 top-5 right-5 ${
        isVisible ? "" : "hidden"
      }`}
      aria-label="Game upper HUD"
    >
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

      <div
        className="flex flex-row items-center gap-5"
        id="hud-controls"
        aria-label="HUD controls"
      >
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
          ariaLabel="Speed Up or Slow Down"
          darkModeLight={true} // Use light mode colors even in dark mode since it looks better on the bkg
          disabled={!isAutoMode} // Disable speed up if auto mode is off
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
  );
}
