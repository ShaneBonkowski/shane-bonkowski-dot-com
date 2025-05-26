"use client";

import React, { useState, useEffect, useRef } from "react";
import { FaCog } from "react-icons/fa";
import GameIconButton from "@/src/components/GameIconButton";
import GameUiWindow from "@/src/components/GameUiWindow";
import { dispatchMenuEvent } from "@/src/events/game-events";
import { tileAndBackgroundColors } from "@/src/games/game-of-life/tile-utils";

export const settings = {
  autoPause: {
    title: "Auto Pause",
    desc: "If enabled, automatically pause when clicking to add/subtract a cell. Enabled by default.",
    type: "checkbox",
    value: true,
    lowerBound: null,
    upperBound: null,
    step: null,
  },
  infiniteEdges: {
    title: "Infinite Edges",
    desc: "If enabled, cells treat edges as a portal to the other side (Kind've like Pac-Man). Enabled by default.",
    type: "checkbox",
    value: true,
    lowerBound: null,
    upperBound: null,
    step: null,
  },
  diagonalNeighbors: {
    title: "Diagonal Neighbors",
    desc: "If enabled, cells treat other cells that are diagonal to them as neighbors. Enabled by default.",
    type: "checkbox",
    value: true,
    lowerBound: null,
    upperBound: null,
    step: null,
  },
  updateInterval: {
    title: "Cell Update Interval",
    desc: "How many milliseconds to wait between cell updates. Lower value means quicker updates.",
    type: "slider",
    value: 200,
    lowerBound: 10,
    upperBound: 1000,
    step: 10,
  },
  underpopulation: {
    title: "Underpopulation",
    desc: "Any live cell with fewer than this many neighbors dies. Defaults to 2.",
    type: "slider",
    value: 2,
    lowerBound: 0,
    upperBound: 8,
    step: 1,
  },
  overpopulation: {
    title: "Overpopulation",
    desc: "Any live cell with more than this many neighbors dies. Defaults to 3.",
    type: "slider",
    value: 3,
    lowerBound: 0,
    upperBound: 8,
    step: 1,
  },
  reproduction: {
    title: "Reproduction",
    desc: "Any dead cell with exactly this many neighbors becomes alive. Defaults to 3.",
    type: "slider",
    value: 3,
    lowerBound: 1, // canot have 0 birth criteria since that breaks things
    upperBound: 8,
    step: 1,
  },
  colorTheme: {
    title: "Color Theme",
    desc: "Select the color theme for the Game of Life cell space.",
    type: "slider",
    value: 0,
    lowerBound: 0,
    upperBound: tileAndBackgroundColors.length - 1,
    step: 1,
  },
};

const SettingsContainer: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isButtonVisible, setIsButtonVisible] = useState(true);
  const [selectedSetting, setSelectedSetting] = useState<string>("autoPause");
  const [, forceUpdate] = useState(0); // Dummy state to force re-renders
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const openWindow = () => {
    // Add a small delay before revealing.
    // This is a hack b/c phones sometimes double click.
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true);
    }, 150);

    dispatchMenuEvent("Info", "open");
  };

  const closeWindow = () => {
    // Add a small delay before hiding the box.
    // This is a hack b/c phones sometimes double click and
    // click on the box behind the button.
    timeoutRef.current = setTimeout(() => {
      setIsVisible(false);
    }, 150);

    dispatchMenuEvent("Info", "close");
  };

  const handleSliderChange = (key: string, value: number) => {
    settings[key as keyof typeof settings].value = value;
    forceUpdate((prev) => prev + 1); // Force a re-render
  };

  const handleCheckboxChange = (key: string, value: boolean) => {
    settings[key as keyof typeof settings].value = value;
    forceUpdate((prev) => prev + 1); // Force a re-render
  };

  useEffect(() => {
    const handleUiMenuOpen = () => setIsButtonVisible(false);
    const handleUiMenuClose = () => setIsButtonVisible(true);

    const handleManualColorUpdate = () => {
      // Force a re-render so that the color slider updates.
      forceUpdate((prev) => prev + 1);
    };

    document.addEventListener("uiMenuOpen", handleUiMenuOpen);
    document.addEventListener("uiMenuClose", handleUiMenuClose);
    document.addEventListener(
      "changeColorThemeFromMainGame",
      handleManualColorUpdate as EventListener
    );

    return () => {
      document.removeEventListener("uiMenuOpen", handleUiMenuOpen);
      document.removeEventListener("uiMenuClose", handleUiMenuClose);
      document.removeEventListener(
        "changeColorThemeFromMainGame",
        handleManualColorUpdate as EventListener
      );

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, []);

  return (
    <>
      {isButtonVisible && (
        <GameIconButton
          onPointerDown={openWindow}
          icon={<FaCog size={30} />}
          ariaLabel="Game of Life Settings"
          className="fixed bottom-5 left-5"
        />
      )}
      <GameUiWindow isVisible={isVisible} onClose={closeWindow}>
        <div className="w-full h-full p-4" id="game-of-life-settings-container">
          {/* Top Section: Settings Info */}
          <div className="p-2" id="game-of-life-settings-description">
            <div className="flex flex-col items-center">
              <h1 className="text-center my-0">
                {settings[selectedSetting as keyof typeof settings]?.title ||
                  "Select a setting"}
              </h1>
              <p className="text-center mb-0">
                {settings[selectedSetting as keyof typeof settings]?.desc}
              </p>
            </div>
          </div>

          {/* Bottom Section: Image and Controls */}
          <div
            className="mt-4 landscape:sm:mt-8 flex flex-col landscape:sm:flex-row gap-4 landscape:sm:gap-8"
            id="game-of-life-settings-content"
          >
            {/* Controls */}
            <div
              className="w-full landscape:sm:w-1/2 p-4 landscape:sm:p-8 flex flex-col gap-4"
              id="game-of-life-settings-controls"
            >
              {Object.entries(settings)
                .filter(([key]) => settings[key as keyof typeof settings]) // Only include settings with a description
                .map(([key, desc]) => {
                  return (
                    <div key={key}>
                      {desc?.type === "checkbox" ? (
                        <div className="flex items-center gap-4">
                          <label className="text-sm font-medium">
                            {desc?.title}
                          </label>
                          <input
                            type="checkbox"
                            checked={desc.value as boolean}
                            onChange={(e) =>
                              handleCheckboxChange(key, e.target.checked)
                            }
                            onPointerDown={() => setSelectedSetting(key)}
                          />
                        </div>
                      ) : (
                        <>
                          <label className="block text-sm font-medium mb-2">
                            {desc?.title}: {desc?.value}
                          </label>
                          <input
                            type="range"
                            min={desc?.lowerBound || 0}
                            max={desc?.upperBound || 10}
                            step={desc?.step || 1}
                            value={desc.value as number}
                            onChange={(e) =>
                              handleSliderChange(
                                key,
                                parseFloat(e.target.value)
                              )
                            }
                            onPointerDown={() => setSelectedSetting(key)}
                            className="w-full"
                          />
                        </>
                      )}
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      </GameUiWindow>
    </>
  );
};

export default SettingsContainer;
