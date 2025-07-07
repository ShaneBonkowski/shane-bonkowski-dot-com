"use client";

import React, { useState, useEffect, useRef } from "react";
import { FaCog } from "react-icons/fa";
import GameIconButton from "@/src/components/GameIconButton";
import GameUiWindow from "@/src/components/GameUiWindow";
import { dispatchMenuEvent } from "@/src/events/game-events";
import { tileAndBackgroundColors } from "@/src/games/game-of-life/tile-utils";
import { UseSettings } from "@/src/games/game-of-life/components/UseSettings";
import { UseGameData } from "@/src/games/game-of-life/components/UseGameData";

const settingsConfig = {
  updateInterval: {
    title: "Update Interval",
    desc: "How many milliseconds to wait between cell updates. Lower value means quicker updates.",
    type: "slider" as const,
    lowerBound: 10,
    upperBound: 1000,
    step: 10,
  },
  underpopulation: {
    title: "Underpopulation",
    desc: "Any live cell with less than this many neighbors dies. Default = 2.",
    type: "slider" as const,
    lowerBound: 0,
    upperBound: 8,
    step: 1,
  },
  overpopulation: {
    title: "Overpopulation",
    desc: "Any live cell with more than this many neighbors dies. Default = 3.",
    type: "slider" as const,
    lowerBound: 0,
    upperBound: 8,
    step: 1,
  },
  reproduction: {
    title: "Reproduction",
    desc: "Any dead cell with exactly this many neighbors becomes alive. Default = 3.",
    type: "slider" as const,
    lowerBound: 1, // canot have 0 birth criteria since that breaks things
    upperBound: 8,
    step: 1,
  },
  colorTheme: {
    title: "Color Theme",
    desc: "Select the color theme for the Game of Life cell space.",
    type: "slider" as const,
    lowerBound: 0,
    upperBound: tileAndBackgroundColors.length - 1,
    step: 1,
  },
  autoPause: {
    title: "Auto Pause",
    desc: "If enabled, automatically pause when clicking a cell. Enabled by default.",
    type: "checkbox" as const,
  },
  infiniteEdges: {
    title: "Infinite Edges",
    desc: "If enabled, edges teleport to the other side (like Pac-Man). Enabled by default.",
    type: "checkbox" as const,
  },
  diagonalNeighbors: {
    title: "Diagonal Neighbors",
    desc: "If enabled, count diagonal cells as neighbors. Enabled by default.",
    type: "checkbox" as const,
  },
};

const SettingsContainer: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isButtonVisible, setIsButtonVisible] = useState(true);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const settings = UseSettings();
  const { discoMode, setDiscoMode } = UseGameData();

  const openWindow = () => {
    // Add a small delay before revealing.
    // This is a hack b/c phones sometimes double click.
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true);
      dispatchMenuEvent("Settings", "open");
    }, 150);
  };

  const closeWindow = () => {
    // Add a small delay before hiding the box.
    // This is a hack b/c phones sometimes double click and
    // click on the box behind the button.
    timeoutRef.current = setTimeout(() => {
      setIsVisible(false);
      dispatchMenuEvent("Settings", "close");
    }, 150);
  };

  const handleSliderChange = (key: string, value: number) => {
    switch (key) {
      case "updateInterval":
        settings.setUpdateInterval(value);
        break;
      case "underpopulation":
        settings.setUnderpopulation(value);
        break;
      case "overpopulation":
        settings.setOverpopulation(value);
        break;
      case "reproduction":
        settings.setReproduction(value);
        break;
      case "colorTheme":
        settings.setColorTheme(value);

        // If the color theme changes from the settings screen and disco mode is
        // on, we should disable disco mode.
        if (discoMode) {
          setDiscoMode(false);
        }

        break;
    }
  };

  const handleCheckboxChange = (key: string, value: boolean) => {
    switch (key) {
      case "autoPause":
        settings.setAutoPause(value);
        break;
      case "infiniteEdges":
        settings.setInfiniteEdges(value);
        break;
      case "diagonalNeighbors":
        settings.setDiagonalNeighbors(value);
        break;
    }
  };

  useEffect(() => {
    const handleUiMenuOpen = () => setIsButtonVisible(false);
    const handleUiMenuClose = () => setIsButtonVisible(true);

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
    <>
      <GameIconButton
        onPointerDown={openWindow}
        icon={<FaCog size={30} />}
        ariaLabel="Settings"
        className={`fixed bottom-3 left-3 ${isButtonVisible ? "" : "hidden"}`}
        lightModeDark={true} // Use dark mode colors even in light mode since it looks better on the bkg
        title="Settings"
      />

      <GameUiWindow isVisible={isVisible} onClose={closeWindow}>
        <div className="w-full h-full" id="game-of-life-settings-container">
          {/* Top Section: Settings Info */}
          <div
            className="p-2 flex flex-col items-center"
            id="game-of-life-settings-description"
          >
            <h1 className="text-center">Settings</h1>
          </div>

          {/* Bottom Section: Controls */}
          <div
            className="w-full mt-4 p-4 landscape:sm:p-8 flex flex-col gap-4"
            id="game-of-life-settings-controls"
          >
            {Object.entries(settingsConfig).map(([key, config]) => {
              const currentValue = settings[key as keyof typeof settings];

              return (
                <div key={key}>
                  {config.type === "checkbox" ? (
                    <div className="flex flex-col mb-4">
                      <div className="flex items-center">
                        {/* Make clickable area larger */}
                        <div className="pr-4 pb-2">
                          <input
                            type="checkbox"
                            checked={currentValue as boolean}
                            onChange={(e) =>
                              handleCheckboxChange(key, e.target.checked)
                            }
                          />
                        </div>
                        <label className="mb-2 text-md font-bold">
                          {config.title}
                        </label>
                      </div>
                      <label className="text-sm">{config.desc}</label>
                    </div>
                  ) : (
                    <div className="flex flex-col">
                      <label className="text-md font-bold mb-2">
                        {config.title}: {currentValue as number}
                      </label>
                      <label className="text-sm mb-2">{config.desc}</label>
                      {/* Make clickable area larger */}
                      <div className="py-4">
                        <input
                          type="range"
                          min={config.lowerBound}
                          max={config.upperBound}
                          step={config.step}
                          value={currentValue as number}
                          onChange={(e) =>
                            handleSliderChange(key, parseFloat(e.target.value))
                          }
                          className="w-full"
                        />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </GameUiWindow>
    </>
  );
};

export default SettingsContainer;
