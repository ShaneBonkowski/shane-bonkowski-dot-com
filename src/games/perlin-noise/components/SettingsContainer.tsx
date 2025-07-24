"use client";

import React, { useState, useEffect } from "react";
import { FaCog } from "react-icons/fa";
import GameIconButton from "@/src/components/GameIconButton";
import GameUiWindow from "@/src/components/GameUiWindow";
import { dispatchMenuEvent } from "@/src/events/game-events";
import { installTouchThroughBlocker } from "@/src/utils/touch-through-blocker";
import { UseSettings } from "@/src/games/perlin-noise/components/UseSettings";
import { TileType } from "@/src/games/perlin-noise/tile-utils";
import { DEFAULT_COLOR_PRESETS } from "@/src/games/perlin-noise/color-presets";
import ColorPresetBox from "@/src/games/perlin-noise/components/ColorPresetBox";

const ColorPresetSettings: React.FC = () => {
  const {
    customColorPresets,
    currentColorPresetIndex,
    setCustomColorPreset,
    setCurrentColorPresetIndex,
  } = UseSettings();

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
    const defaultPreset = DEFAULT_COLOR_PRESETS[index];
    if (defaultPreset) {
      setCustomColorPreset(index, { ...defaultPreset });
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 mb-4">
      {/* Title and Description */}
      <div id="perlin-noise-color-preset-header">
        <h2 className="text-center">Color Presets</h2>
        <p className="text-center">
          Click a preset to select it, then customize colors and names
        </p>
      </div>

      {/* Color Preset Boxes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {customColorPresets.map((preset, index) => (
          <ColorPresetBox
            key={index}
            preset={preset}
            isSelected={currentColorPresetIndex === index}
            onSelect={() => setCurrentColorPresetIndex(index)}
            onUpdateName={(name) => handleUpdateName(index, name)}
            onUpdateColor={(tileType, color) =>
              handleUpdateColor(index, tileType, color)
            }
            onReset={() => handleReset(index)}
          />
        ))}
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
            <ColorPresetSettings />
          </div>
        </div>
      </GameUiWindow>
    </>
  );
};

export default SettingsContainer;
