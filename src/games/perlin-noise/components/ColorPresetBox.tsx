"use client";

import React, { useState, useRef } from "react";
import { FaUndo, FaSave } from "react-icons/fa";
import { ColorPreset } from "@/src/games/perlin-noise/color-presets";
import { TileType } from "@/src/games/perlin-noise/tile-utils";
import GameIconButton from "@/src/components/GameIconButton";
import { isMobileDevice } from "@/src/utils/heuristics";

interface ColorPresetBoxProps {
  preset: ColorPreset;
  onUpdateName: (name: string) => void;
  onUpdateColor: (tileType: TileType, color: number) => void;
  onReset: () => void;
}

const ColorPresetBox: React.FC<ColorPresetBoxProps> = ({
  preset,
  onUpdateName,
  onUpdateColor,
  onReset,
}) => {
  const [tempName, setTempName] = useState(preset.name);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleNameSubmit = () => {
    onUpdateName(tempName);
  };

  const handleColorChange = (tileType: TileType, hexColor: string) => {
    const color = parseInt(hexColor.slice(1), 16);
    onUpdateColor(tileType, color);
  };

  const formatHexColor = (color: number) => {
    return `#${color.toString(16).padStart(6, "0")}`;
  };

  return (
    <div className={"p-4 rounded-lg border-2 cursor-pointer border-gray-500"}>
      {/* Preset Name and controls */}
      <div className="mb-4 gap-2 flex items-center justify-between">
        <GameIconButton
          onPointerDown={() => {
            onReset();
            setTempName(preset.name);
          }}
          icon={<FaUndo size={30} />}
          ariaLabel="Reset Preset"
          title="Reset Preset"
        />
        {/* eslint-disable-next-line no-restricted-syntax */}
        <input
          type="text"
          ref={inputRef}
          placeholder="Preset name here..."
          value={tempName}
          onChange={(e) => setTempName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              // On mobile, we want to prevent the default behavior of the Enter
              // key which may submit a form or cause unwanted side effects.
              if (isMobileDevice()) {
                e.preventDefault();
                inputRef.current?.blur(); // Hide keyboard
              }
            }
          }}
          maxLength={16}
          className="w-full p-2 text-center bg-transparent border-b border-transparent focus:border-gray-500 outline-none"
          style={{ fontSize: "16px" }} // Font size >= 16px on mobile prevents zooming
          aria-label="Preset name input"
        />
        <GameIconButton
          onPointerDown={handleNameSubmit}
          icon={<FaSave size={30} />}
          ariaLabel="Save Preset"
          title="Save Preset"
        />
      </div>

      {/* Color Grid */}
      <div className="grid grid-cols-4 gap-2">
        {Object.entries(preset.colors).map(([tileTypeKey, color]) => {
          const tileType = tileTypeKey as TileType;
          return (
            <input
              type="color"
              value={formatHexColor(color)}
              onChange={(e) => handleColorChange(tileType, e.target.value)}
              className="w-full border border-gray-300 rounded cursor-pointer"
              title={tileType.replace("_", " ").toLowerCase()}
              key={tileType}
            />
          );
        })}
      </div>
    </div>
  );
};

export default ColorPresetBox;
