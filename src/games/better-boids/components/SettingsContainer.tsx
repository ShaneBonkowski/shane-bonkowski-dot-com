"use client";

import React, { useState, useEffect, useLayoutEffect, useRef } from "react";
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
  const headerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const controlsRef = useRef<HTMLDivElement>(null);

  const settings = UseSettings();

  const getSettingImage = (key: string | null): string => {
    const defaultImage = "/webps/games/better-boids-alignment-graphic.webp";
    
    if (!key) return defaultImage;
    
    const config = settingsConfig[key];
    if (!config) return defaultImage;

    // Handle leader strength image switching based on value
    if (key === "leaderStrength" && "attractImage" in config) {
      return settings.leaderStrength < 0 ? config.repelImage : config.attractImage;
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

  useLayoutEffect(() => {
    if (!isVisible) return;
    const header = headerRef.current;
    const scroll = scrollRef.current;
    const controls = controlsRef.current;
    if (!header || !scroll || !controls) return;

    const updateMaskBounds = () => {
      const scrollBounds = scroll.getBoundingClientRect();
      const controlBounds = controls.getBoundingClientRect();
      const controlStyle = getComputedStyle(controls);
      const left = controlBounds.left - scrollBounds.left + parseFloat(controlStyle.paddingLeft);
      const width = controlBounds.width - parseFloat(controlStyle.paddingLeft) - parseFloat(controlStyle.paddingRight);
      scroll.style.setProperty("--settings-header-height", `${header.offsetHeight}px`);
      scroll.style.setProperty("--settings-mask-left", `${left}px`);
      scroll.style.setProperty("--settings-mask-width", `${width}px`);
      scroll.style.setProperty("--settings-mask-right", `${Math.max(0, scrollBounds.width - left - width)}px`);
    };
    updateMaskBounds();
    const observer = new ResizeObserver(updateMaskBounds);
    observer.observe(header);
    observer.observe(scroll);
    observer.observe(controls);
    return () => observer.disconnect();
  }, [isVisible]);

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
      <GameUiWindow isVisible={isVisible} onClose={closeWindow} scrollable={false}>
        <div className="relative z-0 -m-4 h-[calc(100%+2rem)] w-[calc(100%+2rem)]" id="boids-settings-container">
          <div
            ref={scrollRef}
            className="h-full w-full overflow-y-auto overscroll-none scroll-pt-[var(--settings-header-height)]"
            id="boids-settings-scroll"
            tabIndex={0}
            aria-label="Settings controls"
          >
            {/* Keep gestures over the fixed header in the native scroll area. */}
            <div aria-hidden="true" className="sticky top-0 z-10 h-[var(--settings-header-height)]">
              <div className="hidden landscape:sm:block landscape:sm:absolute landscape:sm:top-full landscape:sm:left-0 landscape:sm:h-[calc(var(--app-vh)*0.65)] landscape:sm:w-1/2 md:block md:absolute md:top-full md:left-0 md:h-[calc(var(--app-vh)*0.65)] md:w-1/2" />
            </div>

            {/* Settings Controls */}
            <div id="boids-settings-content">
              {/* Controls */}
              <div
                ref={controlsRef}
                className="w-full p-4 landscape:sm:ml-auto landscape:sm:w-1/2 landscape:sm:p-8 md:ml-auto md:w-1/2 md:p-8"
                id="boids-settings-controls"
              >
                {Object.entries(settingsConfig).map(([key, config]) => {
                  const currentValue = settings[key as keyof typeof settings];

                  // Handle Boid Mix section rendering
                  if (config.type === "section") {
                    return (
                      <div key={key} className="space-y-4" onPointerDown={() => setSelectedSetting(key)} onFocusCapture={() => setSelectedSetting(key)}>
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
                              settings.setGoodBoidCount(parseFloat(e.target.value));
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
                              settings.setBadBoidCount(parseFloat(e.target.value));
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
                              settings.setObstacleCount(parseFloat(e.target.value));
                            }}
                            className="game-interactive-control w-full"
                          />
                        </div>

                        <div className="text-xs text-gray-600 mt-2">
                          Total: {settings.goodBoidCount + settings.badBoidCount + settings.obstacleCount} / {MAX_BOIDS_PER_TYPE * 3}
                        </div>
                      </div>
                    );
                  }

                  return (
                    <div key={key} onPointerDown={() => setSelectedSetting(key)} onFocusCapture={() => setSelectedSetting(key)}>
                      {config.type === "checkbox" ? (
                        <div className="flex items-center">
                          <label
                            htmlFor={`boids-setting-${key}`}
                            className="text-sm font-medium"
                          >
                            {config.title}
                          </label>
                          {/* Make clickable area larger */}
                          <div className="px-4">
                            <input
                              id={`boids-setting-${key}`}
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

          {/* Top Section: Settings Info */}
          <div ref={headerRef} className="pointer-events-none absolute inset-x-0 top-0">
            <div
              className="px-12 py-2 flex flex-col items-center"
              id="boids-settings-description"
            >
              <h1 className="text-center">
                {settingsConfig[selectedSetting as keyof typeof settingsConfig]
                  ?.title || "Settings"}
              </h1>
              <p className="text-center">
                {settingsConfig[selectedSetting as keyof typeof settingsConfig]
                  ?.desc || "Select a setting to view its description."}
              </p>
            </div>

            {/* Image */}
            <div
              className="h-[calc(var(--app-vh)*0.2)] w-full flex items-center justify-center px-4 landscape:sm:absolute landscape:sm:top-full landscape:sm:left-0 landscape:sm:h-[calc(var(--app-vh)*0.65)] landscape:sm:w-1/2 landscape:sm:items-start landscape:sm:px-12 md:absolute md:top-full md:left-0 md:h-[calc(var(--app-vh)*0.65)] md:w-1/2 md:items-start md:px-12"
              id="boids-settings-image"
            >
              <Image
                src={getSettingImage(selectedSetting)}
                alt={selectedSetting ? settingsConfig[selectedSetting].title : "Settings illustration"}
                width={600}
                height={600}
                sizes="(min-width: 640px) 40vw, 80vw"
                className="h-full w-full max-h-full max-w-full object-contain landscape:sm:h-auto md:h-auto"
              />
            </div>
          </div>

        </div>
      </GameUiWindow>
    </>
  );
};

export default SettingsContainer;
