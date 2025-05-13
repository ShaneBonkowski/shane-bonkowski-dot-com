"use client";

import React, { useState } from "react";
import { FaCog } from "react-icons/fa";
import GameIconButton from "@/src/components/GameIconButton";
import GameUiWindow from "@/src/components/GameUiWindow";
import { dispatchMenuEvent } from "@/src/events/game-events";
import Image from "next/image";

export const boidSettings = {
  alignmentFactor: {
    title: "Alignment",
    desc: "Determines how much boids align with their neighbors.",
    image: "/webps/games/alignment-graphic.webp",
    type: "slider",
    value: 0.3,
    lowerBound: 0.1,
    upperBound: 1,
    step: 0.1,
  },
  cohesionFactor: {
    title: "Cohesion",
    desc: "Controls how strongly boids move toward the center of their group.",
    image: "/webps/games/cohesion-graphic.webp",
    type: "slider",
    value: 0.054,
    lowerBound: 0.01,
    upperBound: 0.1,
    step: 0.01,
  },
  separationFactor: {
    title: "Separation",
    desc: "Determines how much boids avoid crowding each other.",
    image: "/webps/games/separation-graphic.webp",
    type: "slider",
    value: 0.935,
    lowerBound: 0.5,
    upperBound: 1,
    step: 0.01,
  },
  speed: {
    title: "Speed",
    desc: "Controls how fast the boids move.",
    image: "/webps/games/velocity-graphic.webp",
    type: "slider",
    value: 0.6,
    lowerBound: 0.1,
    upperBound: 5,
    step: 0.1,
  },
  flockSearchRadius: {
    title: "Flock Radius",
    desc: "Defines the radius within which boids consider their neighbors.",
    image: "/webps/games/search-radius-graphic.webp",
    type: "slider",
    value: 90,
    lowerBound: 10,
    upperBound: 100,
    step: 1,
  },
  leaderBoidEnabled: {
    title: "Leader Boid",
    desc: "Enables or disables the leader boid follow behavior.",
    image: "/webps/games/leader-follow-graphic.webp",
    type: "checkbox",
    value: true,
    lowerBound: null,
    upperBound: null,
    step: null,
  },
};

const BoidsSettingsContainer: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedSetting, setSelectedSetting] =
    useState<string>("alignmentFactor");
  const [, forceUpdate] = useState(0); // Dummy state to force re-renders

  const openWindow = () => {
    setIsVisible(true);
    dispatchMenuEvent("Info", "open");
  };

  const closeWindow = () => {
    setIsVisible(false);
    dispatchMenuEvent("Info", "close");
  };

  const handleSliderChange = (key: string, value: number) => {
    boidSettings[key as keyof typeof boidSettings].value = value;
    forceUpdate((prev) => prev + 1); // Force a re-render
  };

  const handleCheckboxChange = (key: string, value: boolean) => {
    boidSettings[key as keyof typeof boidSettings].value = value;
    forceUpdate((prev) => prev + 1); // Force a re-render
  };

  return (
    <>
      <GameIconButton
        onPointerDown={openWindow}
        icon={<FaCog size={30} />}
        ariaLabel="Boid Settings"
        className="fixed bottom-5 left-5"
      />
      <GameUiWindow isVisible={isVisible} onClose={closeWindow}>
        <div
          className="flex flex-col lg:flex-row h-full"
          id="boids-settings-container"
        >
          {/* Description */}
          <div
            className="w-full lg:w-1/2 h-1/4 lg:h-full p-4 lg:p-8 flex-grow"
            id="boids-settings-description"
          >
            {selectedSetting && (
              <div className="h-full flex flex-col items-center">
                <h1 className="text-center my-0">
                  {boidSettings[selectedSetting as keyof typeof boidSettings]
                    ?.title || "Select a setting"}
                </h1>
                <p className="text-center mb-2 lg:mb-8">
                  {
                    boidSettings[selectedSetting as keyof typeof boidSettings]
                      ?.desc
                  }
                </p>
                <div className="flex-grow w-full relative">
                  <Image
                    src={
                      boidSettings[selectedSetting as keyof typeof boidSettings]
                        ?.image
                    }
                    alt={selectedSetting || "Description Image"}
                    fill
                    style={{ objectFit: "contain" }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Controls */}
          <div
            className="w-full lg:w-1/2 p-4 lg:p-8 flex flex-col gap-4 lg:flex-grow-0 lg:justify-center"
            id="boids-settings-controls"
          >
            {Object.entries(boidSettings)
              .filter(([key]) => boidSettings[key as keyof typeof boidSettings]) // Only include settings with a description
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
                          {desc?.title}
                        </label>
                        <input
                          type="range"
                          min={desc?.lowerBound || 0}
                          max={desc?.upperBound || 10}
                          step={desc?.step || 1}
                          value={desc.value as number}
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
      </GameUiWindow>
    </>
  );
};

export default BoidsSettingsContainer;
