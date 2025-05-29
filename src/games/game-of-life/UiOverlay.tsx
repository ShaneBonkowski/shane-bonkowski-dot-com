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

const UiOverlay: React.FC = () => {
  const [isUiVisible, setIsUiVisible] = useState(true);
  const [isAutoMode, setIsAutoMode] = useState(false);
  const [isPaused, setIsPaused] = useState(true);
  const [isDiscoMode, setIsDiscoMode] = useState(false);
  const [population, setPopulation] = useState(0);
  const [generation, setGeneration] = useState(0);

  const handleToggleAutoMode = () => {
    setIsAutoMode((prev) => !prev);
    document.dispatchEvent(new CustomEvent("toggleAutomatic"));
  };

  const handleTogglePause = () => {
    setIsPaused((prev) => !prev);
    document.dispatchEvent(new CustomEvent("togglePause"));
  };

  const handleAdvance = () => {
    document.dispatchEvent(new CustomEvent("clickAdvance"));
  };

  const handleReset = () => {
    document.dispatchEvent(new CustomEvent("resetTiles"));
  };

  const handleToggleDisco = () => {
    setIsDiscoMode((prev) => !prev);
    document.dispatchEvent(new CustomEvent("toggleDisco"));
  };

  useEffect(() => {
    const handleUiMenuOpen = () => {
      setIsUiVisible(false);
    };
    const handleUiMenuClose = () => {
      setIsUiVisible(true);
    };

    const handlePopChange = (event: CustomEvent) => {
      setPopulation(parseInt(event.detail.message, 10));
    };

    const handleGenChange = (event: CustomEvent) => {
      setGeneration(parseInt(event.detail.message, 10));
    };

    const handleManualUnpause = () => {
      setIsPaused(false);
    };

    const handleManualPause = () => {
      setIsPaused(true);
    };

    const handleManualColorChange = () => {
      // If the color theme changes from the settings screen and disco mode is
      // on, we should disable disco mode.
      if (isDiscoMode) {
        setIsDiscoMode(false);
        document.dispatchEvent(new CustomEvent("toggleDisco"));
      }
    };

    // Add event listeners
    document.addEventListener("uiMenuOpen", handleUiMenuOpen);
    document.addEventListener("uiMenuClose", handleUiMenuClose);
    document.addEventListener("popChange", handlePopChange as EventListener);
    document.addEventListener("genChange", handleGenChange as EventListener);
    document.addEventListener(
      "manualUnpause",
      handleManualUnpause as EventListener
    );
    document.addEventListener(
      "manualPause",
      handleManualPause as EventListener
    );
    document.addEventListener(
      "changeColorThemeFromSettings",
      handleManualColorChange as EventListener
    );

    // Cleanup event listeners on component unmount
    return () => {
      document.removeEventListener("uiMenuOpen", handleUiMenuOpen);
      document.removeEventListener("uiMenuClose", handleUiMenuClose);
      document.removeEventListener(
        "popChange",
        handlePopChange as EventListener
      );
      document.removeEventListener(
        "genChange",
        handleGenChange as EventListener
      );
      document.removeEventListener(
        "manualUnpause",
        handleManualUnpause as EventListener
      );
      document.removeEventListener(
        "manualPause",
        handleManualPause as EventListener
      );
      document.removeEventListener(
        "changeColorThemeFromSettings",
        handleManualColorChange as EventListener
      );
    };
  }, [isDiscoMode]);

  return (
    <div
      className="z-50 pointer-events-none fixed bottom-5 w-full flex flex-col gap-3"
      id="ui-overlay"
      aria-label="Game UI Overlay"
    >
      {/* Population and Generation Display */}
      {isUiVisible && (
        <div
          id="game-state-info"
          className="pointer-events-none flex justify-center items-center gap-6"
          aria-label="Game State Info"
        >
          <p className="mb-0">Population: {population}</p>
          <p className="mb-0">Generation: {generation}</p>
        </div>
      )}

      {/* Buttons and Toggles */}
      {isUiVisible && (
        <div
          id="game-of-life-buttons"
          className="pointer-events-none gap-5 flex flex-row justify-center"
          aria-label="Tile Buttons"
        >
          {/* Disco Button */}
          <GameIconButton
            onPointerDown={handleToggleDisco}
            icon={isDiscoMode ? <FaBan size={30} /> : <FaMagic size={30} />}
            ariaLabel={isDiscoMode ? "Disable Disco Mode" : "Enable Disco Mode"}
          />

          {/* Auto Mode Button */}
          <GameIconButton
            onPointerDown={handleToggleAutoMode}
            icon={
              isAutoMode ? <FaHandPointer size={30} /> : <FaRobot size={30} />
            }
            ariaLabel="Toggle Auto Mode"
          />

          {/* Pause/Play Button */}
          <GameIconButton
            onPointerDown={handleTogglePause}
            icon={isPaused ? <FaPlay size={30} /> : <FaPause size={30} />}
            ariaLabel={isPaused ? "Play" : "Pause"}
          />

          {/* Advance Button */}
          <GameIconButton
            onPointerDown={handleAdvance}
            icon={<FaGreaterThan size={30} />}
            ariaLabel="Advance to Next Generation"
          />

          {/* Reset Button */}
          <GameIconButton
            onPointerDown={handleReset}
            icon={<FaRedo size={30} />}
            ariaLabel="Reset Tiles"
          />
        </div>
      )}
    </div>
  );
};

export default UiOverlay;
