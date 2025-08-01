"use client";

import React, { useState, useEffect } from "react";
import { FaCog } from "react-icons/fa";
import GameIconButton from "@/src/components/GameIconButton";
import GameUiWindow from "@/src/components/GameUiWindow";
import { dispatchMenuEvent } from "@/src/events/game-events";
import { UseSettings } from "@/src/games/better-boids/components/UseSettings";
import Image from "next/image";
import { installTouchThroughBlocker } from "@/src/utils/touch-through-blocker";

const settingsConfig = {
  alignmentFactor: {
    title: "Alignment",
    desc: "Determines how much boids align with their neighbors.",
    image: "/webps/games/better-boids-alignment-graphic.webp",
    type: "slider" as const,
    lowerBound: 0.1,
    upperBound: 1,
    step: 0.1,
  },
  cohesionFactor: {
    title: "Cohesion",
    desc: "Controls how strongly boids move toward the center of their group.",
    image: "/webps/games/better-boids-cohesion-graphic.webp",
    type: "slider" as const,
    lowerBound: 0.01,
    upperBound: 0.1,
    step: 0.01,
  },
  separationFactor: {
    title: "Separation",
    desc: "Determines how much boids avoid crowding each other.",
    image: "/webps/games/better-boids-separation-graphic.webp",
    type: "slider" as const,
    lowerBound: 0.5,
    upperBound: 1,
    step: 0.01,
  },
  speed: {
    title: "Speed",
    desc: "Controls how fast the boids move.",
    image: "/webps/games/better-boids-velocity-graphic.webp",
    type: "slider" as const,
    lowerBound: 0.1,
    upperBound: 5,
    step: 0.1,
  },
  flockSearchRadius: {
    title: "Flock Radius",
    desc: "Defines the radius within which boids consider their neighbors.",
    image: "/webps/games/better-boids-search-radius-graphic.webp",
    type: "slider" as const,
    lowerBound: 10,
    upperBound: 100,
    step: 1,
  },
  leaderBoidEnabled: {
    title: "Leader Boid",
    desc: "Enables or disables the leader boid follow behavior on hold and drag.",
    image: "/webps/games/better-boids-leader-follow-graphic.webp",
    type: "checkbox" as const,
  },
};

const SettingsContainer: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isButtonVisible, setIsButtonVisible] = useState(true);
  const [selectedSetting, setSelectedSetting] = useState<string | null>(null);

  const settings = UseSettings();

  const openWindow = () => {
    // Prevent touch-through on mobile devices when window is toggled.
    installTouchThroughBlocker();
    setIsVisible(true);
    dispatchMenuEvent("Settings", "open");
  };

  const closeWindow = () => {
    // Prevent touch-through on mobile devices when window is toggled.
    installTouchThroughBlocker();
    setIsVisible(false);
    dispatchMenuEvent("Settings", "close");
  };

  const handleSliderChange = (key: string, value: number) => {
    switch (key) {
      case "alignmentFactor":
        settings.setAlignmentFactor(value);
        break;
      case "cohesionFactor":
        settings.setCohesionFactor(value);
        break;
      case "separationFactor":
        settings.setSeparationFactor(value);
        break;
      case "speed":
        settings.setSpeed(value);
        break;
      case "flockSearchRadius":
        settings.setFlockSearchRadius(value);
        break;
    }
  };

  const handleCheckboxChange = (key: string, value: boolean) => {
    switch (key) {
      case "leaderBoidEnabled":
        settings.setLeaderBoidEnabled(value);
        break;
    }
  };

  useEffect(() => {
    const handleUiMenuOpen = () => {
      setIsButtonVisible(false);
      setSelectedSetting(null); // Have a clean slate when opening the menu
    };
    const handleUiMenuClose = () => {
      setIsButtonVisible(true);
    };

    document.addEventListener("uiMenuOpen", handleUiMenuOpen);
    document.addEventListener("uiMenuClose", handleUiMenuClose);

    return () => {
      document.removeEventListener("uiMenuOpen", handleUiMenuOpen);
      document.removeEventListener("uiMenuClose", handleUiMenuClose);
    };
  }, []);

  return (
    <>
      <GameIconButton
        onPointerDown={openWindow}
        icon={<FaCog size={30} />}
        ariaLabel="Settings"
        className={`fixed bottom-3 left-3 ${isButtonVisible ? "" : "hidden"}`}
        title="Settings"
      />
      <GameUiWindow isVisible={isVisible} onClose={closeWindow}>
        <div className="w-full h-full" id="boids-settings-container">
          {/* Top Section: Settings Info */}
          <div
            className="p-2 flex flex-col items-center"
            id="boids-settings-description"
          >
            <h1 className="text-center">
              {settingsConfig[selectedSetting as keyof typeof settingsConfig]
                ?.title || "Settings"}
            </h1>
            <p className="text-center min-h-[2lh]">
              {settingsConfig[selectedSetting as keyof typeof settingsConfig]
                ?.desc || "Select a setting to view its description."}
            </p>
          </div>

          {/* Bottom Section: Image and Controls */}
          <div
            className="mt-4 flex flex-col landscape:sm:flex-row gap-4 landscape:sm:gap-8"
            id="boids-settings-content"
          >
            {/* Image */}
            <div
              className="min-h-[30vh] p-4 landscape:sm:p-8 w-full landscape:sm:w-1/2 relative"
              id="boids-settings-image"
            >
              <Image
                src={
                  settingsConfig[selectedSetting as keyof typeof settingsConfig]
                    ?.image || settingsConfig.alignmentFactor.image
                }
                alt={selectedSetting || "Description Image"}
                fill
                style={{ objectFit: "contain" }}
              />
            </div>

            {/* Controls */}
            <div
              className="w-full landscape:sm:w-1/2 p-4 landscape:sm:p-8 flex flex-col"
              id="boids-settings-controls"
            >
              {Object.entries(settingsConfig).map(([key, config]) => {
                const currentValue = settings[key as keyof typeof settings];

                return (
                  <div key={key}>
                    {config.type === "checkbox" ? (
                      <div className="flex items-center">
                        <label className="text-sm font-medium">
                          {config.title}
                        </label>
                        {/* Make clickable area larger */}
                        <div
                          className="px-4"
                          onPointerDown={() => setSelectedSetting(key)}
                        >
                          <input
                            type="checkbox"
                            checked={currentValue as boolean}
                            onChange={(e) => {
                              handleCheckboxChange(key, e.target.checked);
                            }}
                          />
                        </div>
                      </div>
                    ) : (
                      <>
                        <label className="block text-sm font-medium mb-2">
                          {config.title}: {currentValue as number}
                        </label>
                        {/* Make clickable area larger */}
                        <div
                          className="pt-2 pb-4"
                          onPointerDown={() => setSelectedSetting(key)}
                        >
                          <input
                            type="range"
                            min={config.lowerBound}
                            max={config.upperBound}
                            step={config.step}
                            value={currentValue as number}
                            onChange={(e) =>
                              handleSliderChange(
                                key,
                                parseFloat(e.target.value)
                              )
                            }
                            className="w-full"
                          />
                        </div>
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
