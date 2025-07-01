"use client";

import React, { useState, useEffect } from "react";
import {
  FaRobot,
  FaHandPointer,
  FaPause,
  FaPlay,
  FaGreaterThan,
  FaRedo,
  FaBan,
  FaMagic,
} from "react-icons/fa";
import GameIconButton from "@/src/components/GameIconButton";
import "@/src/games/flip-tile/styles/game.css";
import { UseGameData } from "@/src/games/game-of-life/components/UseGameData";

const UiOverlay: React.FC = () => {
  const [isUiVisible, setIsUiVisible] = useState(true);
  const {
    population,
    generation,
    paused,
    autoPlayMode,
    discoMode,
    setDiscoMode,
    setAutoPlayMode,
    setPaused,
  } = UseGameData();

  const handleToggleAutoMode = () => {
    setAutoPlayMode(!autoPlayMode);
  };

  const handleTogglePause = () => {
    setPaused(!paused);
  };

  const handleAdvance = () => {
    document.dispatchEvent(new CustomEvent("clickAdvance"));
  };

  const handleReset = () => {
    document.dispatchEvent(new CustomEvent("resetTiles"));
  };

  const handleToggleDisco = () => {
    setDiscoMode(!discoMode);
  };

  useEffect(() => {
    const handleUiMenuOpen = () => {
      setIsUiVisible(false);
    };
    const handleUiMenuClose = () => {
      setIsUiVisible(true);
    };

    // Add event listeners
    document.addEventListener("uiMenuOpen", handleUiMenuOpen);
    document.addEventListener("uiMenuClose", handleUiMenuClose);

    // Cleanup event listeners on component unmount
    return () => {
      document.removeEventListener("uiMenuOpen", handleUiMenuOpen);
      document.removeEventListener("uiMenuClose", handleUiMenuClose);
    };
  }, [discoMode, setDiscoMode]);

  return (
    // z-20 so that its behind z-30 windows, but above mostly everything else
    <div
      className={`z-20 pointer-events-none fixed bottom-3 w-full flex flex-col gap-1 ${
        isUiVisible ? "" : "hidden"
      }`}
      id="ui-overlay"
      aria-label="Game UI Overlay"
    >
      {/* Population and Generation Display */}
      <div
        id="game-state-info"
        className="pointer-events-none flex justify-center items-center gap-6"
        aria-label="Game State Info"
      >
        <p className="mb-0 text-primary-text-color">Population: {population}</p>
        <p className="mb-0 text-primary-text-color">Generation: {generation}</p>
      </div>

      {/* Buttons and Toggles */}
      <div
        id="game-of-life-buttons"
        className="pointer-events-none gap-1 flex flex-row justify-center"
        aria-label="Tile Buttons"
      >
        {/* Disco Button */}
        <GameIconButton
          onPointerDown={handleToggleDisco}
          icon={discoMode ? <FaBan size={30} /> : <FaMagic size={30} />}
          ariaLabel="Toggle Disco Mode"
          lightModeDark={true} // Use dark mode colors even in light mode since it looks better on the bkg
          title="Toggle Disco Mode"
        />

        {/* Auto Mode Button */}
        <GameIconButton
          onPointerDown={handleToggleAutoMode}
          icon={
            autoPlayMode ? <FaHandPointer size={30} /> : <FaRobot size={30} />
          }
          ariaLabel="Toggle Auto Mode"
          lightModeDark={true} // Use dark mode colors even in light mode since it looks better on the bkg
          title="Toggle Auto Mode"
        />

        {/* Pause/Play Button */}
        <GameIconButton
          onPointerDown={handleTogglePause}
          icon={paused ? <FaPlay size={30} /> : <FaPause size={30} />}
          ariaLabel={paused ? "Play" : "Pause"}
          lightModeDark={true} // Use dark mode colors even in light mode since it looks better on the bkg
          title={paused ? "Play" : "Pause"}
        />

        {/* Advance Button */}
        <GameIconButton
          onPointerDown={handleAdvance}
          icon={<FaGreaterThan size={30} />}
          ariaLabel="Advance to Next Generation"
          lightModeDark={true} // Use dark mode colors even in light mode since it looks better on the bkg
          title="Advance to Next Generation"
        />

        {/* Reset Button */}
        <GameIconButton
          onPointerDown={handleReset}
          icon={<FaRedo size={30} />}
          ariaLabel="Reset Tiles"
          lightModeDark={true} // Use dark mode colors even in light mode since it looks better on the bkg
          title="Reset Tiles"
        />
      </div>
    </div>
  );
};

export default UiOverlay;
