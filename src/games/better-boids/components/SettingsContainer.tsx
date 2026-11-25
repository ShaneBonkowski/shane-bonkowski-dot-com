"use client";

import React, { useState, useEffect } from "react";
import { FaCog, FaSync } from "react-icons/fa";
import GameIconButton from "@/src/components/GameIconButton";
import GameUiWindow from "@/src/components/GameUiWindow";
import { dispatchMenuEvent } from "@/src/events/game-events";
import { UseSettings } from "@/src/games/better-boids/components/UseSettings";
import Image from "next/image";
import { installTouchThroughBlocker } from "@/src/utils/touch-through-blocker";
import { MAX_BOIDS_PER_TYPE } from "@/src/games/better-boids/settings-store";

type SettingConfig =
  | {
      title: string;
      desc: string;
      image: string;
      type: "slider" | "section";
      lowerBound?: number;
      upperBound?: number;
      step?: number;
    }
  | {
      title: string;
      desc: string;
      type: "checkbox";
      image: string;
    }
  | {
      title: string;
      desc: string;
      type: "slider";
      attractImage: string;
      repelImage: string;
      lowerBound: number;
      upperBound: number;
      step: number;
    };

const settingsConfig: Record<string, SettingConfig> = {
  collisionsEnabled: {
    title: "Collisions",
    desc: "Enables or disables collision detection between boids and obstacles.",
    image: "/webps/games/better-boids-hitbox-graphic.webp",
    type: "checkbox" as const,
  },
  showHitboxes: {
    title: "Show Hitboxes",
    desc: "Show the collision hitboxes as red boxes.",
    image: "/webps/games/better-boids-hitbox-graphic.webp",
    type: "checkbox" as const,
  },
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
  leaderStrength: {
    title: "Leader",
    desc: "Negative (-) makes boids repel from the leader. Positive (+) makes them attract. 0 disables the leader.",
    attractImage: "/webps/games/better-boids-leader-follow-graphic.webp",
    repelImage: "/webps/games/better-boids-leader-repel-graphic.webp",
    type: "slider" as const,
    lowerBound: -100,
    upperBound: 100,
    step: 1,
  },
  goodBoidCount: {
    title: "Boid Mix",
    desc: `Adjust the proportion of good boids, bad boids, and obstacles. Each type is capped at ${MAX_BOIDS_PER_TYPE}.`,
    image: "/webps/games/better-boids-boid-mix-graphic.webp",
    type: "section" as const,
  },
};

const SettingsContainer: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isButtonVisible, setIsButtonVisible] = useState(true);
  const [selectedSetting, setSelectedSetting] = useState<string | null>(null);
  const settings = UseSettings();

  const getSettingImage = (key: string | null): string => {
    const defaultImage = "/webps/games/better-boids-alignment-graphic.webp";

    if (!key) return defaultImage;

    const config = settingsConfig[key];
    if (!config) return defaultImage;

    // Handle leader strength image switching based on value
    if (key === "leaderStrength" && "attractImage" in config) {
      return settings.leaderStrength < 0
        ? config.repelImage
        : config.attractImage;
    }

    if ("image" in config) {
      return config.image;
    }

    return defaultImage;
  };

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
      case "leaderStrength":
        settings.setLeaderStrength(value);
        break;
    }
  };

  const handleCheckboxChange = (key: string, value: boolean) => {
    switch (key) {
      case "collisionsEnabled":
        settings.setCollisionsEnabled(value);
        break;
      case "showHitboxes":
        settings.setShowHitboxes(value);
        break;
    }
  };

  const handleRefreshLayout = () => {
    // Dispatch event to regenerate obstacles and respawn boids
    document.dispatchEvent(new CustomEvent("refreshGameLayout"));
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
      <GameIconButton
        onPointerDown={handleRefreshLayout}
        icon={<FaSync size={30} />}
        ariaLabel="Refresh Layout"
        className={`fixed bottom-3 left-16 ${isButtonVisible ? "" : "hidden"}`}
        title="Refresh Layout"
      />
      <GameUiWindow
        isVisible={isVisible}
        onClose={closeWindow}
        scrollable={false}
      >
        <div
          className="relative z-0 -m-4 flex h-[calc(100%+2rem)] w-[calc(100%+2rem)] flex-col landscape:flex-row"
          id="boids-settings-container"
        >
          {/* Settings Info */}
          <div
            className="flex min-h-0 min-w-0 flex-1 basis-0 flex-col overflow-y-auto overscroll-contain"
            role="region"
            tabIndex={0}
            aria-label="Settings information"
          >
            <div
              className="shrink-0 px-12 py-2 text-center landscape:px-4"
              id="boids-settings-description"
            >
              <h1>
                {selectedSetting ? settingsConfig[selectedSetting].title : "Settings"}
              </h1>
              <p>
                {selectedSetting
                  ? settingsConfig[selectedSetting].desc
                  : "Select a setting to view its description."}
              </p>
            </div>
            {/* Image */}
            <div
              className="relative min-h-16 min-w-0 flex-1"
              id="boids-settings-image"
            >
              <div className="absolute inset-2 landscape:inset-2">
                <Image
                  src={getSettingImage(selectedSetting)}
                  alt={
                    selectedSetting
                      ? settingsConfig[selectedSetting].title
                      : "Settings illustration"
                  }
                  width={600}
                  height={600}
                  sizes="(orientation: landscape) 50vw, 100vw"
                  className="mx-auto h-full w-full max-w-[600px] object-contain object-top landscape:object-center"
                />
              </div>
            </div>
          </div>
          <div
            className="min-h-0 min-w-0 flex-1 basis-0 overflow-y-auto overscroll-contain"
            id="boids-settings-scroll"
            role="region"
            tabIndex={0}
            aria-label="Settings controls"
          >
              {/* Controls */}
              <div
                className="w-full p-4 landscape:p-8 landscape:pt-20"
                id="boids-settings-controls"
              >
                {Object.entries(settingsConfig).map(([key, config]) => {
                  const currentValue = settings[key as keyof typeof settings];

                  // Handle Boid Mix section rendering
                  if (config.type === "section") {
                    return (
                      <div
                        key={key}
                        className="space-y-4"
                        onPointerDown={() => setSelectedSetting(key)}
                        onFocusCapture={() => setSelectedSetting(key)}
                      >
                        {/* Good Boids */}
                        <div>
                          <label
                            htmlFor={`boids-slider-goodBoidCount`}
                            className="block text-sm font-medium mb-2"
                          >
                            Good Boids: {settings.goodBoidCount}
                          </label>
                          <input
                            id={`boids-slider-goodBoidCount`}
                            type="range"
                            min={0}
                            max={MAX_BOIDS_PER_TYPE}
                            step={1}
                            value={settings.goodBoidCount}
                            onChange={(e) => {
                              settings.setGoodBoidCount(
                                parseFloat(e.target.value),
                              );
                            }}
                            className="game-interactive-control w-full"
                          />
                        </div>

                        {/* Bad Boids */}
                        <div>
                          <label
                            htmlFor={`boids-slider-badBoidCount`}
                            className="block text-sm font-medium mb-2"
                          >
                            Bad Boids: {settings.badBoidCount}
                          </label>
                          <input
                            id={`boids-slider-badBoidCount`}
                            type="range"
                            min={0}
                            max={MAX_BOIDS_PER_TYPE}
                            step={1}
                            value={settings.badBoidCount}
                            onChange={(e) => {
                              settings.setBadBoidCount(
                                parseFloat(e.target.value),
                              );
                            }}
                            className="game-interactive-control w-full"
                          />
                        </div>

                        {/* Obstacles */}
                        <div>
                          <label
                            htmlFor={`boids-slider-obstacleCount`}
                            className="block text-sm font-medium mb-2"
                          >
                            Obstacles: {settings.obstacleCount}
                          </label>
                          <input
                            id={`boids-slider-obstacleCount`}
                            type="range"
                            min={0}
                            max={MAX_BOIDS_PER_TYPE}
                            step={1}
                            value={settings.obstacleCount}
                            onChange={(e) => {
                              settings.setObstacleCount(
                                parseFloat(e.target.value),
                              );
                            }}
                            className="game-interactive-control w-full"
                          />
                        </div>

                        <div className="text-xs text-gray-600 mt-2">
                          Total:{" "}
                          {settings.goodBoidCount +
                            settings.badBoidCount +
                            settings.obstacleCount}{" "}
                          / {MAX_BOIDS_PER_TYPE * 3}
                        </div>
                      </div>
                    );
                  }

                  return (
                    <div
                      key={key}
                      className={key === "alignmentFactor" ? "pt-4" : ""}
                      onPointerDown={() => setSelectedSetting(key)}
                      onFocusCapture={() => setSelectedSetting(key)}
                    >
                      {config.type === "checkbox" ? (
                        <label
                          htmlFor={`boids-setting-${key}`}
                          className="inline-flex items-center gap-4 py-4 text-sm font-medium"
                        >
                          {config.title}
                          {/* Make clickable area larger */}
                          <input
                            id={`boids-setting-${key}`}
                            type="checkbox"
                            checked={currentValue as boolean}
                            onChange={(e) => {
                              handleCheckboxChange(key, e.target.checked);
                            }}
                          />
                        </label>
                      ) : (
                        <>
                          <label
                            htmlFor={`boids-slider-${key}`}
                            className="block text-sm font-medium mb-2"
                          >
                            {config.title}: {currentValue as number}
                          </label>
                          {/* Make clickable area larger */}
                          <div className="pt-1 pb-2">
                            <input
                              id={`boids-slider-${key}`}
                              type="range"
                              min={config.lowerBound}
                              max={config.upperBound}
                              step={config.step}
                              value={currentValue as number}
                              onChange={(e) =>
                                handleSliderChange(
                                  key,
                                  parseFloat(e.target.value),
                                )
                              }
                              className="game-interactive-control w-full"
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
