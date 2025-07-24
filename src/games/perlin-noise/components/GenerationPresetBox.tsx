"use client";

import React, { useRef } from "react";
import { FaUndo } from "react-icons/fa";
import GameIconButton from "@/src/components/GameIconButton";
import { GenerationPreset } from "@/src/games/perlin-noise/generation-presets";
import { TILE_TYPES, TileType } from "@/src/games/perlin-noise/tile-utils";
import { isMobileDevice } from "@/src/utils/heuristics";
import GameFakeIconButton from "@/src/components/GameFakeIconButton";

interface GenerationPresetBoxProps {
  preset: GenerationPreset;
  onUpdateName: (name: string) => void;
  onUpdateOctaves: (octaves: number) => void;
  onUpdateThreshold: (tileType: TileType, threshold: number) => void;
  onReset: () => void;
}

const GenerationPresetBox: React.FC<GenerationPresetBoxProps> = ({
  preset,
  onUpdateName,
  onUpdateOctaves,
  onUpdateThreshold,
  onReset,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  // Get ordered tile types for proper threshold constraints
  const orderedTileTypes = [
    TILE_TYPES.DEEP_WATER,
    TILE_TYPES.SHALLOW_WATER,
    TILE_TYPES.BEACH,
    TILE_TYPES.SOIL,
    TILE_TYPES.GRASS,
    TILE_TYPES.FOREST,
    TILE_TYPES.MOUNTAIN,
    TILE_TYPES.SNOW,
  ];

  const getSliderConstraints = (currentTileType: TileType) => {
    const currentIndex = orderedTileTypes.indexOf(currentTileType);
    const prevTileType = orderedTileTypes[currentIndex - 1];
    const nextTileType = orderedTileTypes[currentIndex + 1];

    const min = prevTileType ? preset.generation[prevTileType] : 0;
    const max = nextTileType ? preset.generation[nextTileType] : 1;

    return { min, max };
  };

  const formatTileTypeName = (tileType: TileType) => {
    return tileType
      .replace(/_/g, " ")
      .toLowerCase()
      .replace(/\b\w/g, (letter) => letter.toUpperCase());
  };

  return (
    <div className={"p-4 rounded-lg border-2 border-gray-500"}>
      {/* Preset Name and controls */}
      <div className="mb-4 gap-2 flex items-center justify-between">
        {/* Use a fake button as a spacer to allow the text to be centered properly */}
        <GameFakeIconButton sizeFallback={30} invisible={true} />
        {/* eslint-disable-next-line no-restricted-syntax */}
        <input
          type="text"
          ref={inputRef}
          placeholder="Preset name here..."
          value={preset.name}
          onChange={(e) => onUpdateName(e.target.value)}
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
          onPointerDown={onReset}
          icon={<FaUndo size={30} />}
          ariaLabel="Reset Preset"
          title="Reset Preset"
        />
      </div>

      {/* Octaves Slider */}
      <div className="mb-4">
        <label>Octaves: {preset.octaves}</label>
        {/* Make clickable area larger */}
        <div className="pt-2 pb-4">
          <input
            type="range"
            min="1"
            max="4"
            step="1"
            value={preset.octaves}
            onChange={(e) => onUpdateOctaves(parseInt(e.target.value))}
            className="w-full"
          />
        </div>
      </div>

      {/* Generation Threshold Sliders */}
      <div className="flex flex-col gap-4">
        {orderedTileTypes.map((tileType) => {
          const { min, max } = getSliderConstraints(tileType);
          const value = preset.generation[tileType];

          return (
            <div key={tileType} className="flex flex-col">
              <label>
                {formatTileTypeName(tileType)}: {value.toFixed(2)}
              </label>
              {/* Make clickable area larger */}
              <div className="pt-2 pb-4">
                <input
                  type="range"
                  min={min}
                  max={max}
                  step="0.01"
                  value={value}
                  onChange={(e) =>
                    onUpdateThreshold(tileType, parseFloat(e.target.value))
                  }
                  className="w-full"
                  // Disable if no valid range, or if this is the last
                  // tile type since it has no next tile to constrain against.
                  disabled={min >= max || tileType === TILE_TYPES.SNOW}
                  title={
                    tileType === TILE_TYPES.SNOW
                      ? "Snow threshold is fixed at 1.0 as the final tile type"
                      : undefined
                  }
                />
              </div>
              <div className="flex justify-between text-xs text-gray-500">
                <span>{min.toFixed(2)}</span>
                <span>{max.toFixed(2)}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default GenerationPresetBox;
