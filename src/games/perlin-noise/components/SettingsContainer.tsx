"use client";

import React, { useState, useEffect } from "react";
import { FaCog, FaChevronRight, FaChevronLeft } from "react-icons/fa";
import GameIconButton from "@/src/components/GameIconButton";
import GameUiWindow from "@/src/components/GameUiWindow";
import { dispatchMenuEvent } from "@/src/events/game-events";
import { installTouchThroughBlocker } from "@/src/utils/touch-through-blocker";
import { UseSettings } from "@/src/games/perlin-noise/components/UseSettings";
import { TileType } from "@/src/games/perlin-noise/tile-utils";
import { DEFAULT_COLOR_PRESETS } from "@/src/games/perlin-noise/color-presets";
import ColorPresetBox from "@/src/games/perlin-noise/components/ColorPresetBox";
import { DEFAULT_GENERATION_PRESETS } from "@/src/games/perlin-noise/generation-presets";
import GenerationPresetBox from "@/src/games/perlin-noise/components/GenerationPresetBox";

const QualitySettings: React.FC = () => {
  const { qualityLevel, setQualityLevel } = UseSettings();

  const qualityOptions = [
    { value: "LOW", label: "Low" },
    { value: "MEDIUM", label: "Medium" },
    { value: "HIGH", label: "High" },
  ] as const;

  return (
    <div className="flex flex-col items-center gap-4 mb-4 max-w-xl">
      {/* Title and Description */}
      <div id="perlin-noise-quality-header">
        <h2 className="text-center">Quality Level</h2>
        <p className="text-center">
          Higher quality increases grid resolution but may impact performance.
        </p>
      </div>

      {/* Quality Checkboxes */}
      <div className="flex gap-4 justify-center">
        {qualityOptions.map((option) => (
          // Use 'label' to make clickable area larger
          <label key={option.value} className="flex items-center p-4 gap-2">
            <input
              type="checkbox"
              checked={qualityLevel === option.value}
              onChange={() => setQualityLevel(option.value)}
              aria-label={`Set quality to ${option.label}`}
            />
            <span>{option.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

const GenerationPresetSettings: React.FC = () => {
  const {
    customGenerationPresets,
    currentGenerationPresetIndex,
    setCustomGenerationPreset,
    setCurrentGenerationPresetIndex,
  } = UseSettings();

  const currentPreset = customGenerationPresets[currentGenerationPresetIndex];

  const handlePrevious = () => {
    const newIndex =
      currentGenerationPresetIndex === 0
        ? customGenerationPresets.length - 1
        : currentGenerationPresetIndex - 1;
    setCurrentGenerationPresetIndex(newIndex);
  };

  const handleNext = () => {
    const newIndex =
      currentGenerationPresetIndex === customGenerationPresets.length - 1
        ? 0
        : currentGenerationPresetIndex + 1;
    setCurrentGenerationPresetIndex(newIndex);
  };

  const handleUpdateName = (index: number, name: string) => {
    const updatedPreset = {
      ...customGenerationPresets[index],
      name,
    };
    setCustomGenerationPreset(index, updatedPreset);
  };

  const handleUpdateOctaves = (index: number, octaves: number) => {
    const updatedPreset = {
      ...customGenerationPresets[index],
      octaves,
    };
    setCustomGenerationPreset(index, updatedPreset);
  };

  const handleUpdateThreshold = (
    index: number,
    tileType: TileType,
    threshold: number
  ) => {
    const updatedPreset = {
      ...customGenerationPresets[index],
      generation: {
        ...customGenerationPresets[index].generation,
        [tileType]: threshold,
      },
    };
    setCustomGenerationPreset(index, updatedPreset);
  };

  const handleReset = (index: number) => {
    if (index < 0 || index >= DEFAULT_GENERATION_PRESETS.length) {
      console.warn(
        `Reset failed: index ${index} out of bounds (0-${
          DEFAULT_GENERATION_PRESETS.length - 1
        })`
      );
      return;
    }

    // Reset to deep copy of default preset
    const defaultPreset = DEFAULT_GENERATION_PRESETS[index];
    const resetPreset = {
      ...defaultPreset,
      generation: { ...defaultPreset.generation },
    };
    setCustomGenerationPreset(index, resetPreset);
  };

  return (
    <div className="flex flex-col items-center gap-4 mb-4 max-w-xl">
      {/* Title and Description */}
      <div id="perlin-noise-generation-preset-header">
        <h2 className="text-center">Generation Presets</h2>
        <p className="text-center">
          Configure terrain generation parameters for different landscape types.
          Higher octaves increase detail but may impact performance.
        </p>
      </div>

      {/* Navigation Controls */}
      <div className="flex items-center gap-4 w-full">
        <GameIconButton
          onPointerDown={handlePrevious}
          icon={<FaChevronLeft size={20} />}
          ariaLabel="Previous preset"
          title="Previous preset"
        />
        <div className="flex-1 text-center">
          <span className="text-gray-500">
            {currentGenerationPresetIndex + 1} of{" "}
            {customGenerationPresets.length}
          </span>
        </div>
        <GameIconButton
          onPointerDown={handleNext}
          icon={<FaChevronRight size={20} />}
          ariaLabel="Next preset"
          title="Next preset"
        />
      </div>

      {/* Single Preset Box */}
      <div className="w-full">
        <GenerationPresetBox
          key={currentGenerationPresetIndex}
          preset={currentPreset}
          onUpdateName={(name) =>
            handleUpdateName(currentGenerationPresetIndex, name)
          }
          onUpdateOctaves={(octaves) =>
            handleUpdateOctaves(currentGenerationPresetIndex, octaves)
          }
          onUpdateThreshold={(tileType, threshold) =>
            handleUpdateThreshold(
              currentGenerationPresetIndex,
              tileType,
              threshold
            )
          }
          onReset={() => handleReset(currentGenerationPresetIndex)}
        />
      </div>
    </div>
  );
};

const ColorPresetSettings: React.FC = () => {
  const {
    customColorPresets,
    currentColorPresetIndex,
    setCustomColorPreset,
    setCurrentColorPresetIndex,
  } = UseSettings();

  const currentPreset = customColorPresets[currentColorPresetIndex];

  const handlePrevious = () => {
    const newIndex =
      currentColorPresetIndex === 0
        ? customColorPresets.length - 1
        : currentColorPresetIndex - 1;
    setCurrentColorPresetIndex(newIndex);
  };

  const handleNext = () => {
    const newIndex =
      currentColorPresetIndex === customColorPresets.length - 1
        ? 0
        : currentColorPresetIndex + 1;
    setCurrentColorPresetIndex(newIndex);
  };

  const handleUpdateName = (index: number, name: string) => {
    const updatedPreset = {
      ...customColorPresets[index],
      name,
    };
    setCustomColorPreset(index, updatedPreset);
  };

  const handleUpdateColor = (
    index: number,
    tileType: TileType,
    color: number
  ) => {
    const updatedPreset = {
      ...customColorPresets[index],
      colors: {
        ...customColorPresets[index].colors,
        [tileType]: color,
      },
    };
    setCustomColorPreset(index, updatedPreset);
  };

  const handleReset = (index: number) => {
    if (index < 0 || index >= DEFAULT_COLOR_PRESETS.length) {
      console.warn(
        `Reset failed: index ${index} out of bounds (0-${
          DEFAULT_COLOR_PRESETS.length - 1
        })`
      );
      return;
    }

    // Reset to deep copy of default preset
    const defaultPreset = DEFAULT_COLOR_PRESETS[index];
    const resetPreset = {
      ...defaultPreset,
      colors: { ...defaultPreset.colors },
    };
    setCustomColorPreset(index, resetPreset);
  };

  return (
    <div className="flex flex-col items-center gap-4 mb-4 max-w-xl">
      {/* Title and Description */}
      <div id="perlin-noise-color-preset-header">
        <h2 className="text-center">Color Presets</h2>
        <p className="text-center">
          Customize terrain colors and names. See{" "}
          <a
            href="https://lospec.com/palette-list"
            target="_blank"
            rel="noopener noreferrer"
          >
            Lospec
          </a>{" "}
          for color palette inspiration.
        </p>
      </div>

      {/* Navigation Controls */}
      <div className="flex items-center gap-4 w-full">
        <GameIconButton
          onPointerDown={handlePrevious}
          icon={<FaChevronLeft size={20} />}
          ariaLabel="Previous preset"
          title="Previous preset"
        />
        <div className="flex-1 text-center">
          <span className="text-gray-500">
            {currentColorPresetIndex + 1} of {customColorPresets.length}
          </span>
        </div>
        <GameIconButton
          onPointerDown={handleNext}
          icon={<FaChevronRight size={20} />}
          ariaLabel="Next preset"
          title="Next preset"
        />
      </div>

      {/* Single Preset Box */}
      <div className="w-full">
        <ColorPresetBox
          key={currentColorPresetIndex}
          preset={currentPreset}
          onUpdateName={(name) =>
            handleUpdateName(currentColorPresetIndex, name)
          }
          onUpdateColor={(tileType, color) =>
            handleUpdateColor(currentColorPresetIndex, tileType, color)
          }
          onReset={() => handleReset(currentColorPresetIndex)}
        />
      </div>
    </div>
  );
};

const SettingsContainer: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isButtonVisible, setIsButtonVisible] = useState(true);

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

  useEffect(() => {
    const handleUiMenuOpen = () => {
      setIsButtonVisible(false);
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
        lightModeDark={true} // Use dark mode colors even in light mode since it looks better on the bkg
        blackShadow={true} // Use a black shadow for the button
      />
      <GameUiWindow isVisible={isVisible} onClose={closeWindow}>
        <div className="w-full h-full" id="perlin-noise-settings-container">
          {/* Top Section: Settings Info */}
          <div
            className="p-2 flex flex-col items-center"
            id="perlin-noise-settings-description"
          >
            <h1 className="text-center">Settings</h1>
            <QualitySettings />
            <GenerationPresetSettings />
            <ColorPresetSettings />
          </div>
        </div>
      </GameUiWindow>
    </>
  );
};

export default SettingsContainer;
