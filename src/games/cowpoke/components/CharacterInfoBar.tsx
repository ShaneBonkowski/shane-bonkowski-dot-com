import React from "react";
import { CHARACTER_TYPES } from "@/src/games/cowpoke/character";
import { UseGameData } from "@/src/games/cowpoke/components/UseGameData";

type CharacterInfoBarProps = {
  characterType: CHARACTER_TYPES.PLAYER | CHARACTER_TYPES.ENEMY;
  position?: "top-left" | "top-right";
};

export default function CharacterInfoBar({
  characterType,
  position = "top-left",
}: CharacterInfoBarProps) {
  const {
    playerName,
    playerLevel,
    playerHealth,
    playerMaxHealth,
    playerXp,
    playerMaxXp,
    enemyName,
    enemyLevel,
    enemyHealth,
    enemyMaxHealth,
    enemyXp,
    enemyMaxXp,
  } = UseGameData();

  const isPlayer = characterType === CHARACTER_TYPES.PLAYER;
  const name = isPlayer ? playerName : enemyName;
  const level = isPlayer ? playerLevel : enemyLevel;
  const health = isPlayer ? playerHealth : enemyHealth;
  const maxHealth = isPlayer ? playerMaxHealth : enemyMaxHealth;
  const xp = isPlayer ? playerXp : enemyXp;
  const maxXp = isPlayer ? playerMaxXp : enemyMaxXp;

  const healthPercent = Math.max(0, Math.min(1, health / maxHealth));
  const xpPercent = Math.max(0, Math.min(1, xp / maxXp));

  const positionClasses = position === "top-left" ? "items-start" : "items-end";

  return (
    <div
      className={`relative w-full z-20 p-2 flex flex-col ${positionClasses}`}
      style={{ minWidth: "240px" }}
      id="character-info-bar"
      aria-label="Character Info Bar"
    >
      <span className="mb-1 font-bold text-primary-text-color-light">
        {name}: lvl {level}
      </span>
      <div className="flex flex-row items-center w-full">
        {position === "top-left" && (
          <span className="mr-2 font-semibold text-red-700 min-w-[60px] text-right">
            {health}/{maxHealth} HP
          </span>
        )}
        <div className="relative h-5 bg-transparent overflow-hidden flex-1">
          {/* Max Health bar (background) */}
          <div
            className="absolute left-0 top-0 h-3 bg-red-900 w-full"
            style={{ zIndex: 1 }}
          />
          {/* Current Health bar (foreground) */}
          <div
            className="absolute left-0 top-0 h-3 bg-red-500"
            style={{ width: `${healthPercent * 100}%`, zIndex: 2 }}
          />
          {/* Max XP bar (background) */}
          <div
            className="absolute left-0 bottom-0 h-2 bg-gray-300 w-full"
            style={{ zIndex: 3 }}
          />
          {/* Current XP bar (foreground) */}
          <div
            className="absolute left-0 bottom-0 h-2 bg-blue-400"
            style={{ width: `${xpPercent * 100}%`, zIndex: 4 }}
          />
        </div>
        {position === "top-right" && (
          <span className="ml-2 font-semibold text-red-700 min-w-[60px] text-right">
            {health}/{maxHealth} HP
          </span>
        )}
      </div>
    </div>
  );
}
