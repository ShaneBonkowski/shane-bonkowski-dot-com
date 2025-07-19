"use client";

import React, { useState, useEffect, useRef } from "react";
import CharacterInfoBar from "@/src/games/cowpoke/components/CharacterInfoBar";
import { CHARACTER_TYPES } from "@/src/games/cowpoke/cowpoke-game-object-types";
import { FaSkull, FaHandPointer, FaRobot } from "react-icons/fa";
import { GiRabbit, GiSnail, GiCoffin } from "react-icons/gi";
import GameIconButton from "@/src/components/GameIconButton";
import { UseGameData } from "@/src/games/cowpoke/components/UseGameData";
import YesNoBox from "@/src/components/YesNoBox";
import { isMobileDevice } from "@/src/utils/heuristics";

export default function UpperHud() {
  const [isVisible, setIsVisible] = useState(true);
  const [selectGameOverVisible, setSelectGameOverVisible] = useState(false);
  const { fastMode, autoMode, playerKills, setFastMode, setAutoMode } =
    UseGameData();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleToggleFastMode = () => {
    setFastMode(!fastMode);
  };

  const handleToggleAutoMode = () => {
    setAutoMode(!autoMode);
  };

  const handleTryToEndGame = () => {
    // Turn off auto mode if player manually tries to end the game. This prevents
    // weird states where the game tries to continue playing while the player
    // is "dead", causing null value errors. NOTE: We do this on the "are you sure"
    // popup since it buys even more time then if it was on the actual "yes end game"
    // button press.
    if (autoMode) {
      setAutoMode(false);
    }

    // Add a small delay before revealing.
    // This is a hack b/c phones sometimes double click and
    // click on the box behind the button.
    timeoutRef.current = setTimeout(
      () => {
        setSelectGameOverVisible(true);
      },
      isMobileDevice() ? 220 : 150
    );
  };

  const onYesGameOver = () => {
    // Add a small delay before hiding the box.
    // This is a hack b/c phones sometimes double click and
    // click on the box behind the button.
    timeoutRef.current = setTimeout(
      () => {
        setSelectGameOverVisible(false);

        // Dispatch the event to end the game manually
        document.dispatchEvent(new CustomEvent("manualEndGame"));
      },
      isMobileDevice() ? 220 : 150
    );
  };

  const onNoGameOver = () => {
    // Add a small delay before hiding the box.
    // This is a hack b/c phones sometimes double click and
    // click on the box behind the button.
    timeoutRef.current = setTimeout(
      () => {
        setSelectGameOverVisible(false);
      },
      isMobileDevice() ? 220 : 150
    );
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
      className={`w-full max-w-[85vw] flex flex-row items-end justify-between p-2 gap-4 ${
        isVisible ? "" : "hidden"
      }`}
      aria-label="Game upper HUD"
    >
      <CharacterInfoBar
        characterType={CHARACTER_TYPES.PLAYER}
        position="top-left"
      />

      <div
        className="flex flex-row items-center mb-1 gap-0"
        id="hud-controls"
        aria-label="HUD controls"
      >
        <GameIconButton
          onPointerDown={handleToggleAutoMode}
          icon={autoMode ? <FaHandPointer size={30} /> : <FaRobot size={30} />}
          ariaLabel="Toggle Auto Mode"
          darkModeLight={true} // Use light mode colors even in dark mode since it looks better on the bkg
          title="Toggle Auto Mode"
          className="pb-0" // override from GameIconButton
        />
        <GameIconButton
          onPointerDown={handleToggleFastMode}
          icon={fastMode ? <GiSnail size={30} /> : <GiRabbit size={30} />}
          ariaLabel="Toggle Fast Mode"
          darkModeLight={true} // Use light mode colors even in dark mode since it looks better on the bkg
          title="Toggle Fast Mode"
          className="pb-0" // override from GameIconButton
        />
        <GameIconButton
          onPointerDown={handleTryToEndGame}
          icon={<GiCoffin size={30} />}
          ariaLabel="End Game"
          darkModeLight={true} // Use light mode colors even in dark mode since it looks better on the bkg
          title="End Game"
          className="pb-0" // override from GameIconButton
        />
        <div className="px-[8px] pt-[8px] pb-0 z-20 flex flex-row items-center">
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
      />

      {/* End Game Popup */}
      {selectGameOverVisible && (
        <YesNoBox
          yesButtonText="Yes"
          noButtonText="No"
          onYes={onYesGameOver}
          onNo={onNoGameOver}
          id="select-end-game"
        >
          <p className="text-left py-2 my-0">
            Are you sure you want to bite the dust?
          </p>
        </YesNoBox>
      )}
    </div>
  );
}
