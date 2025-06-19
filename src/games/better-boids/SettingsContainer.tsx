"use client";

import React, { useState, useEffect, useRef } from "react";
import { FaCog } from "react-icons/fa";
import GameIconButton from "@/src/components/GameIconButton";
import GameUiWindow from "@/src/components/GameUiWindow";
import { dispatchMenuEvent } from "@/src/events/game-events";
import Image from "next/image";

export const settings = {
  alignmentFactor: {
    title: "Alignment",
    desc: "Determines how much boids align with their neighbors.",
    image: "/webps/games/better-boids-alignment-graphic.webp",
    type: "slider",
    value: 0.3,
    lowerBound: 0.1,
    upperBound: 1,
    step: 0.1,
  },
  cohesionFactor: {
    title: "Cohesion",
    desc: "Controls how strongly boids move toward the center of their group.",
    image: "/webps/games/better-boids-cohesion-graphic.webp",
    type: "slider",
    value: 0.054,
    lowerBound: 0.01,
    upperBound: 0.1,
    step: 0.01,
  },
  separationFactor: {
    title: "Separation",
    desc: "Determines how much boids avoid crowding each other.",
    image: "/webps/games/better-boids-separation-graphic.webp",
    type: "slider",
    value: 0.935,
    lowerBound: 0.5,
    upperBound: 1,
    step: 0.01,
  },
  speed: {
    title: "Speed",
    desc: "Controls how fast the boids move.",
    image: "/webps/games/better-boids-velocity-graphic.webp",
    type: "slider",
    value: 0.6,
    lowerBound: 0.1,
    upperBound: 5,
    step: 0.1,
  },
  flockSearchRadius: {
    title: "Flock Radius",
    desc: "Defines the radius within which boids consider their neighbors.",
    image: "/webps/games/better-boids-search-radius-graphic.webp",
    type: "slider",
    value: 90,
    lowerBound: 10,
    upperBound: 100,
    step: 1,
  },
  leaderBoidEnabled: {
    title: "Leader Boid",
    desc: "Enables or disables the leader boid follow behavior on hold and drag.",
    image: "/webps/games/better-boids-leader-follow-graphic.webp",
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
  const [selectedSetting, setSelectedSetting] = useState<string | null>(null);
  const [, forceUpdate] = useState(0); // Dummy state to force re-renders
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

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
    settings[key as keyof typeof settings].value = value;
    forceUpdate((prev) => prev + 1); // Force a re-render
  };

  const handleCheckboxChange = (key: string, value: boolean) => {
    settings[key as keyof typeof settings].value = value;
    forceUpdate((prev) => prev + 1); // Force a re-render
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
        ariaLabel="Boid Settings"
        className={`fixed bottom-5 left-5 ${isButtonVisible ? "" : "hidden"}`}
      />
      <GameUiWindow isVisible={isVisible} onClose={closeWindow}>
        <div className="w-full h-full p-4" id="boids-settings-container">
          {/* Top Section: Settings Info */}
          <div className="p-2" id="boids-settings-description">
            <div className="flex flex-col items-center">
              <h1 className="text-center my-0">
                {settings[selectedSetting as keyof typeof settings]?.title ||
                  "Settings"}
              </h1>
              <p className="text-center mb-0">
                {settings[selectedSetting as keyof typeof settings]?.desc ||
                  "Select a setting to view its description."}
              </p>
            </div>
          </div>

          {/* Bottom Section: Image and Controls */}
          <div
            className="mt-4 landscape:sm:mt-8 flex flex-col landscape:sm:flex-row gap-4 landscape:sm:gap-8"
            id="boids-settings-content"
          >
            {/* Image */}
            <div
              className="min-h-[30vh] p-4 landscape:sm:p-8 w-full landscape:sm:w-1/2 relative"
              id="boids-settings-image"
            >
              <Image
                src={
                  settings[selectedSetting as keyof typeof settings]?.image ||
                  settings.alignmentFactor.image
                }
                alt={selectedSetting || "Description Image"}
                fill
                style={{ objectFit: "contain" }}
              />
            </div>

            {/* Controls */}
            <div
              className="w-full landscape:sm:w-1/2 p-4 landscape:sm:p-8 flex flex-col gap-4"
              id="boids-settings-controls"
            >
              {Object.entries(settings).map(([key, setting]) => {
                return (
                  <div key={key}>
                    {setting?.type === "checkbox" ? (
                      <div className="flex items-center gap-4">
                        <label className="text-sm font-medium">
                          {setting?.title}
                        </label>
                        <input
                          type="checkbox"
                          checked={setting.value as boolean}
                          onChange={(e) => {
                            handleCheckboxChange(key, e.target.checked);
                            // set selected onChange, rather than onPointerDown like
                            // the sliders, since checkboxes are not as interactive. This
                            // prevents some jumpiness when clicking the checkbox.
                            setSelectedSetting(key);
                          }}
                        />
                      </div>
                    ) : (
                      <>
                        <label className="block text-sm font-medium mb-2">
                          {setting?.title}: {setting?.value}
                        </label>
                        <input
                          type="range"
                          min={setting?.lowerBound || 0}
                          max={setting?.upperBound || 10}
                          step={setting?.step || 1}
                          value={setting.value as number}
                          onChange={(e) =>
                            handleSliderChange(key, parseFloat(e.target.value))
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
