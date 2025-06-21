import React, { useState, useEffect } from "react";
import CharacterInfoBar from "@/src/games/cowpoke/CharacterInfoBar";
import { CHARACTER_TYPES } from "@/src/games/cowpoke/character";
import { FaRobot, FaHandPointer, FaSkull } from "react-icons/fa";
import { GiRabbit, GiSnail } from "react-icons/gi";
import GameIconButton from "@/src/components/GameIconButton";
import { UseGameData } from "@/src/games/cowpoke/UseGameData";

export default function UpperHud() {
  const [isVisible, setIsVisible] = useState(true);
  const { autoMode, fastMode, playerKills } = UseGameData();

  const handleToggleAutoMode = () => {
    document.dispatchEvent(new CustomEvent("toggleAutomatic"));

    // If auto mode is turned off, also turn off speed up mode
    if (autoMode) {
      document.dispatchEvent(new CustomEvent("toggleFastMode"));
    }
  };

  const handleToggleFastMode = () => {
    document.dispatchEvent(new CustomEvent("toggleFastMode"));
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
        position="top-left"
      ></CharacterInfoBar>

      <div
        className="flex flex-row items-center gap-5"
        id="hud-controls"
        aria-label="HUD controls"
      >
        <GameIconButton
          onPointerDown={handleToggleAutoMode}
          icon={autoMode ? <FaHandPointer size={30} /> : <FaRobot size={30} />}
          ariaLabel="Toggle Auto Mode"
          darkModeLight={true} // Use light mode colors even in dark mode since it looks better on the bkg
        />
        <GameIconButton
          onPointerDown={handleToggleFastMode}
          icon={fastMode ? <GiSnail size={30} /> : <GiRabbit size={30} />}
          ariaLabel="Speed Up or Slow Down"
          darkModeLight={true} // Use light mode colors even in dark mode since it looks better on the bkg
          disabled={!autoMode} // Disable speed up if auto mode is off
        />
        <div className="z-20 flex flex-row items-center">
          <FaSkull size={25} className="text-primary-text-color-light" />
          <span className="ml-1 font-bold text-primary-text-color-light">
            <b>x</b>
            {playerKills}
          </span>
        </div>
      </div>

      <CharacterInfoBar
        characterType={CHARACTER_TYPES.ENEMY}
        position="top-right"
      ></CharacterInfoBar>
    </div>
  );
}
