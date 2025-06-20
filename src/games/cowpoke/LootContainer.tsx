"use client";

import React from "react";
import Image from "next/image";
import { GUN_LOOT_MAP, HAT_LOOT_MAP, RARITY } from "@/src/games/cowpoke/loot";

interface LootContainerProps {
  lootId: number;
  lootType: "hat" | "gun";
  isEquipped: boolean;
  onClick: () => void;
}

const LootContainer: React.FC<LootContainerProps> = ({
  lootId,
  lootType,
  isEquipped,
  onClick,
}) => {
  const lootMap = lootType === "hat" ? HAT_LOOT_MAP : GUN_LOOT_MAP;
  const lootItem = lootMap[lootId];

  if (!lootItem) {
    return (
      <div className="w-24 h-24 border-2 border-gray-400 bg-gray-200 flex items-center justify-center">
        <span className="text-xs text-gray-500">Unknown</span>
      </div>
    );
  }

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
        relative w-24 h-24 border-2 ${borderColorClass} 
        ${isEquipped ? "bg-gray-300 opacity-60" : "bg-white hover:bg-gray-100"} 
        ${isClickable ? "cursor-pointer" : "cursor-not-allowed"}
        flex flex-col items-center justify-center p-2 transition-all duration-200
      `}
      onClick={isClickable ? onClick : undefined}
      title={`${lootItem.name} - ${lootItem.rarity}`}
    >
      {/* Item Image */}
      <div className="w-12 h-12 mb-1 relative">
        <Image
          src={`/webps/games/cowpoke/${lootItem.spriteName}.webp`}
          alt={lootItem.name}
          fill
          className="object-contain"
          draggable={false}
        />
      </div>

      {/* Item Name */}
      <span className="text-xs text-center font-medium text-primary-text-color truncate w-full">
        {lootItem.name}
      </span>

      {/* Stats Overlay */}
      <div className="absolute bottom-0 right-0 bg-black bg-opacity-75 text-white text-xs px-1 rounded-tl">
        {lootType === "gun" && `+${lootItem.addDmg} DMG`}
        {lootType === "hat" && `+${lootItem.addDmg} DMG`}
      </div>

      {/* Equipped Indicator */}
      {isEquipped && (
        <div className="absolute top-0 left-0 bg-green-500 text-white text-xs px-1 rounded-br">
          ✓
        </div>
      )}
    </div>
  );
};

export default LootContainer;
