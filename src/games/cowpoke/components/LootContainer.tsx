"use client";

import React from "react";
import {
  GUN_LOOT_MAP,
  HAT_LOOT_MAP,
  GIZMOS,
  RARITY,
} from "@/src/games/cowpoke/loot";
import ImageCropper from "@/src/components/ImageCropper";

interface LootContainerProps {
  lootId: number;
  lootType: "hat" | "gun";
  isEquipped: boolean;
  isNew?: boolean;
  onPointerDown: () => void;
}

const LootContainer: React.FC<LootContainerProps> = ({
  lootId,
  lootType,
  isEquipped,
  isNew = false,
  onPointerDown,
}) => {
  const lootMap = lootType === "hat" ? HAT_LOOT_MAP : GUN_LOOT_MAP;
  const lootItem = lootMap[lootId];

  // Get border color based on rarity
  const getBorderColor = (rarity: RARITY) => {
    switch (rarity) {
      case RARITY.COMMON:
        return "border-gray-400";
      case RARITY.RARE:
        return "border-blue-500";
      case RARITY.LEGENDARY:
        return "border-orange-500";
      default:
        return "border-gray-400";
    }
  };

  const borderColorClass = getBorderColor(lootItem.rarity);
  const isClickable = !isEquipped;

  return (
    <div
      className={`
        max-w-48 max-h-48
        relative border-2 ${borderColorClass} bg-black bg-opacity-50
        ${isEquipped ? "" : "hover:bg-opacity-40"} 
        ${isClickable ? "cursor-pointer" : "cursor-not-allowed"}
        flex flex-col items-center justify-center p-2
      `}
      onPointerDown={isClickable ? onPointerDown : undefined}
      title={`${lootItem.name} - ${RARITY[lootItem.rarity]}`}
    >
      {/* Top: Item Art + Stats */}
      <div className={`flex flex-row items-center justify-center gap-2`}>
        {/* Left Panel */}
        <div className={`flex flex-col items-center justify-center`}>
          {/* Item Image: Using ImageCropper to crop the image to the specific region w/ loot */}
          <div className="w-24 h-24 relative overflow-hidden flex items-center justify-center">
            <ImageCropper
              src={lootItem.pathToWebp}
              autoCrop={true}
              padding={5}
              alt={lootItem.name}
              className=""
              draggable={false}
            />
          </div>

          {/* Equipped Indicator */}
          {isEquipped && (
            <div className="absolute top-0 left-0 bg-green-500 text-white text-xs px-1 rounded-br">
              ✓
            </div>
          )}

          {/* New Item Indicator */}
          {isNew && (
            <div className="absolute top-0 right-0 bg-red-500 text-white text-xs px-1 rounded-bl">
              New
            </div>
          )}
        </div>
        {/* Right Panel */}
        <div className={`flex flex-col items-center justify-center`}>
          {/* Stats Overlay */}
          <div className="top-0 right-0 text-right text-white text-xs flex flex-col">
            <span>{`DMG +${lootItem.addDmg}`}</span>
            <span>{`Health +${lootItem.addHealth}`}</span>
            <span>{`Combat +${lootItem.addCombat}`}</span>
            <span>{`Element +${lootItem.addElement}`}</span>
            {lootItem.extraGizmo !== GIZMOS.NONE && (
              <span>{`Gizmo: ${GIZMOS[lootItem.extraGizmo]}`}</span>
            )}
          </div>
        </div>
      </div>
      {/* Bottom: Item Name */}
      <span className="mt-2 text-xs text-center font-medium text-white">
        <b>{lootItem.name}</b>
      </span>
    </div>
  );
};

export default LootContainer;
