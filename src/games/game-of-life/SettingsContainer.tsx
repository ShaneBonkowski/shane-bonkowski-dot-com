"use client";

import React, { useState, useEffect, useRef } from "react";
import { FaCog } from "react-icons/fa";
import GameIconButton from "@/src/components/GameIconButton";
import GameUiWindow from "@/src/components/GameUiWindow";
import { dispatchMenuEvent } from "@/src/events/game-events";
import { tileAndBackgroundColors } from "@/src/games/game-of-life/tile-utils";

export const settings = {
  updateInterval: {
    title: "Update Interval",
    desc: "How many milliseconds to wait between cell updates. Lower value means quicker updates.",
    type: "slider",
    value: 200,
    lowerBound: 10,
    upperBound: 1000,
    step: 10,
  },
  underpopulation: {
    title: "Underpopulation",
    desc: "Any live cell with less than this many neighbors dies. Default = 2.",
    type: "slider",
    value: 2,
    lowerBound: 0,
    upperBound: 8,
    step: 1,
  },
  overpopulation: {
    title: "Overpopulation",
    desc: "Any live cell with more than this many neighbors dies. Default = 3.",
    type: "slider",
    value: 3,
    lowerBound: 0,
    upperBound: 8,
    step: 1,
  },
  reproduction: {
    title: "Reproduction",
    desc: "Any dead cell with exactly this many neighbors becomes alive. Default = 3.",
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
  autoPause: {
    title: "Auto Pause",
    desc: "If enabled, automatically pause when clicking a cell. Enabled by default.",
    type: "checkbox",
    value: true,
    lowerBound: null,
    upperBound: null,
    step: null,
  },
  infiniteEdges: {
    title: "Infinite Edges",
    desc: "If enabled, edges teleport to the other side (like Pac-Man). Enabled by default.",
    type: "checkbox",
    value: true,
    lowerBound: null,
    upperBound: null,
    step: null,
  },
  diagonalNeighbors: {
    title: "Diagonal Neighbors",
    desc: "If enabled, count diagonal cells as neighbors. Enabled by default.",
    type: "checkbox",
    value: true,
    lowerBound: null,
    upperBound: null,
    step: null,
  },
};

const SettingsContainer: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isButtonVisible, setIsButtonVisible] = useState(true);
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

    if (key === "colorTheme") {
      document.dispatchEvent(new CustomEvent("changeColorThemeFromSettings"));
    }
  };

  const handleCheckboxChange = (key: string, value: boolean) => {
    settings[key as keyof typeof settings].value = value;
    forceUpdate((prev) => prev + 1); // Force a re-render
  };

  useEffect(() => {
    const handleUiMenuOpen = () => {
      setIsButtonVisible(false);
    };
    const handleUiMenuClose = () => {
      setIsButtonVisible(true);
    };

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
          lightModeDark={true} // Use dark mode colors even in light mode since it looks better on the bkg
        />
      )}
      <GameUiWindow isVisible={isVisible} onClose={closeWindow}>
        <div className="w-full h-full p-4" id="game-of-life-settings-container">
          {/* Top Section: Settings Info */}
          <div className="p-2" id="game-of-life-settings-description">
            <div className="flex flex-col items-center">
              <h1 className="text-center my-0">Settings</h1>
            </div>
          </div>

          {/* Bottom Section: Controls */}
          <div
            className="w-full mt-4 p-4 landscape:sm:p-8 flex flex-col gap-8"
            id="game-of-life-settings-controls"
          >
            {Object.entries(settings).map(([key, setting]) => {
              return (
                <div key={key}>
                  {setting?.type === "checkbox" ? (
                    <div className="flex flex-col">
                      <div className="flex items-center gap-4 mb-2">
                        <input
                          type="checkbox"
                          checked={setting.value as boolean}
                          onChange={(e) =>
                            handleCheckboxChange(key, e.target.checked)
                          }
                        />
                        <label className="text-md font-bold">
                          {setting?.title}
                        </label>
                      </div>
                      <label className="text-sm">{setting?.desc}</label>
                    </div>
                  ) : (
                    <div className="flex flex-col">
                      <label className="text-md font-bold mb-2">
                        {setting?.title}: {setting?.value}
                      </label>
                      <label className="text-sm mb-2">{setting?.desc}</label>
                      <input
                        type="range"
                        min={setting?.lowerBound || 0}
                        max={setting?.upperBound || 10}
                        step={setting?.step || 1}
                        value={setting.value as number}
                        onChange={(e) =>
                          handleSliderChange(key, parseFloat(e.target.value))
                        }
                        className="w-full"
                      />
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
