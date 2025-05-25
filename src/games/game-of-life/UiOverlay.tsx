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

// FIXME/TODO:
// - Clean up icon sizes!!! Make sure they look good
// - Add settings screen with all the sliders etc.
// - Make sure if game state changes in the game it sends an event to tell the ui to update correctly
// - Get the game bkg to be a solid color and make sure it updates with all the other colors accordingly

const UiOverlay: React.FC = () => {
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

    // Add event listeners
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

    // Cleanup event listeners on component unmount
    return () => {
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
    };
  }, []);

  return (
    <div id="ui-overlay" aria-label="Game UI Overlay">
      {/* Population and Generation Display */}
      <div
        id="game-state-info"
        className="fixed top-5 right-5 p-3"
        aria-label="Game State Info"
      >
        <p>Population: {population}</p>
        <p>Generation: {generation}</p>
      </div>

      {/* Buttons and Toggles */}
      <div
        id="game-of-life-buttons"
        className="pointer-events-none w-full fixed bottom-5 gap-5 flex flex-row justify-center"
        aria-label="Tile Buttons"
      >
        {/* Disco Button */}
        <GameIconButton
          onPointerDown={handleToggleDisco}
          icon={isDiscoMode ? <FaBan size={25} /> : <FaMagic size={25} />}
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
          icon={isPaused ? <FaPlay size={22} /> : <FaPause size={22} />}
          ariaLabel={isPaused ? "Play" : "Pause"}
        />

        {/* Advance Button */}
        <GameIconButton
          onPointerDown={handleAdvance}
          icon={<FaGreaterThan size={25} />}
          ariaLabel="Advance to Next Generation"
        />

        {/* Reset Button */}
        <GameIconButton
          onPointerDown={handleReset}
          icon={<FaRedo size={25} />}
          ariaLabel="Reset Tiles"
        />
      </div>
    </div>
  );
};

export default UiOverlay;
