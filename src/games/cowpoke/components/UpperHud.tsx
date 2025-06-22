import React, { useState, useEffect, useRef } from "react";
import CharacterInfoBar from "@/src/games/cowpoke/components/CharacterInfoBar";
import { CHARACTER_TYPES } from "@/src/games/cowpoke/character";
import { FaRobot, FaHandPointer, FaSkull } from "react-icons/fa";
import { GiRabbit, GiSnail, GiCoffin } from "react-icons/gi";
import GameIconButton from "@/src/components/GameIconButton";
import { UseGameData } from "@/src/games/cowpoke/components/UseGameData";
import YesNoBox from "@/src/components/YesNoBox";

export default function UpperHud() {
  const [isVisible, setIsVisible] = useState(true);
  const [selectGameOverVisible, setSelectGameOverVisible] = useState(false);
  const { autoMode, fastMode, playerKills } = UseGameData();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

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

  const handleTryToEndGame = () => {
    // Add a small delay before revealing.
    // This is a hack b/c phones sometimes double click and
    // click on the box behind the button.
    timeoutRef.current = setTimeout(() => {
      setSelectGameOverVisible(true);
    }, 150);
  };

  const onYesGameOver = () => {
    // Add a small delay before hiding the box.
    // This is a hack b/c phones sometimes double click and
    // click on the box behind the button.
    timeoutRef.current = setTimeout(() => {
      setSelectGameOverVisible(false);

      // Dispatch the event to end the game manually
      document.dispatchEvent(new CustomEvent("manualEndGame"));
    }, 150);
  };

  const onNoGameOver = () => {
    // Add a small delay before hiding the box.
    // This is a hack b/c phones sometimes double click and
    // click on the box behind the button.
    timeoutRef.current = setTimeout(() => {
      setSelectGameOverVisible(false);
    }, 150);
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

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, []);

  return (
    <div
      id="upper-hud"
      className={`absolute flex flex-row items-center justify-between gap-8 top-5 right-5 ${
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
        <GameIconButton
          onPointerDown={handleTryToEndGame}
          icon={<GiCoffin size={30} />}
          ariaLabel="Bite the Dust - End Game"
          darkModeLight={true} // Use light mode colors even in dark mode since it looks better on the bkg
        ></GameIconButton>
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

      {/* End Game Popup */}
      {selectGameOverVisible && (
        <YesNoBox
          yesButtonText="Yes"
          noButtonText="No"
          onYes={onYesGameOver}
          onNo={onNoGameOver}
          id="select-end-game"
        >
          <p className="text-left">Are you sure you want to bite the dust?</p>
        </YesNoBox>
      )}
    </div>
  );
}
