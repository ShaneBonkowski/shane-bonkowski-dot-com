import React, { useEffect, useState } from "react";
import { CHARACTER_TYPES } from "@/src/games/cowpoke/character";

type CharacterInfoBarProps = {
  characterType: CHARACTER_TYPES.PLAYER | CHARACTER_TYPES.ENEMY;
  name: string;
  level: number;
  health: number;
  maxHealth: number;
  xp: number;
  maxXp: number;
  position?: "top-left" | "top-right";
};

export default function CharacterInfoBar({
  characterType,
  name,
  level,
  health,
  maxHealth,
  xp,
  maxXp,
  position = "top-left",
}: CharacterInfoBarProps) {
  const [currentName, setCurrentName] = useState(name);
  const [currentLevel, setCurrentLevel] = useState(level);
  const [currentHealth, setCurrentHealth] = useState(health);
  const [currentMaxHealth, setCurrentMaxHealth] = useState(maxHealth);
  const [currentXp, setCurrentXp] = useState(xp);
  const [currentMaxXp, setCurrentMaxXp] = useState(maxXp);

  useEffect(() => {
    function handleNameUpdate(e: Event) {
      const custom = e as CustomEvent;
      if (custom.detail?.characterType === characterType) {
        setCurrentName(custom.detail.name);
      }
    }
    function handleLevelUpdate(e: Event) {
      const custom = e as CustomEvent;
      if (custom.detail?.characterType === characterType) {
        setCurrentLevel(custom.detail.level);
      }
    }
    function handleHealthUpdate(e: Event) {
      const custom = e as CustomEvent;
      if (custom.detail?.characterType === characterType) {
        setCurrentHealth(custom.detail.health);
      }
    }
    function handleMaxHealthUpdate(e: Event) {
      const custom = e as CustomEvent;
      if (custom.detail?.characterType === characterType) {
        setCurrentMaxHealth(custom.detail.maxHealth);
      }
    }
    function handleXpUpdate(e: Event) {
      const custom = e as CustomEvent;
      if (custom.detail?.characterType === characterType) {
        setCurrentXp(custom.detail.xp);
      }
    }
    function handleMaxXpUpdate(e: Event) {
      const custom = e as CustomEvent;
      if (custom.detail?.characterType === characterType) {
        setCurrentMaxXp(custom.detail.maxXp);
      }
    }

    document.addEventListener("characterNameUpdate", handleNameUpdate);
    document.addEventListener("characterLevelUpdate", handleLevelUpdate);
    document.addEventListener("characterHealthUpdate", handleHealthUpdate);
    document.addEventListener(
      "characterMaxHealthUpdate",
      handleMaxHealthUpdate
    );
    document.addEventListener("characterXpUpdate", handleXpUpdate);
    document.addEventListener("characterMaxXpUpdate", handleMaxXpUpdate);

    return () => {
      document.removeEventListener("characterNameUpdate", handleNameUpdate);
      document.removeEventListener("characterLevelUpdate", handleLevelUpdate);
      document.removeEventListener("characterHealthUpdate", handleHealthUpdate);
      document.removeEventListener(
        "characterMaxHealthUpdate",
        handleMaxHealthUpdate
      );
      document.removeEventListener("characterXpUpdate", handleXpUpdate);
      document.removeEventListener("characterMaxXpUpdate", handleMaxXpUpdate);
    };
  });

  const healthPercent = Math.max(
    0,
    Math.min(1, currentHealth / currentMaxHealth)
  );
  const xpPercent = Math.max(0, Math.min(1, currentXp / currentMaxXp));

  const positionClasses = position === "top-left" ? "items-start" : "items-end";

  return (
    <div
      className={`relative z-40 p-2 flex flex-col ${positionClasses}`}
      style={{ minWidth: "240px" }}
      id="character-info-bar"
      aria-label="Character Info Bar"
    >
      <span className="mb-1 font-bold text-primary-text-color-light">
        {currentName}: lvl {currentLevel}
      </span>
      <div className="flex flex-row items-center w-full">
        {position === "top-left" && (
          <span className="mr-2 font-semibold text-red-700 min-w-[60px] text-right">
            {currentHealth}/{currentMaxHealth} HP
          </span>
        )}
        <div className="relative w-[20vw] h-5 bg-transparent overflow-hidden">
          {/* Max Health bar (background) */}
          <div
            className="absolute left-0 top-0 h-3 bg-red-900"
            style={{ width: "100%", zIndex: 1 }}
          />
          {/* Current Health bar (foreground) */}
          <div
            className="absolute left-0 top-0 h-3 bg-red-500"
            style={{ width: `${healthPercent * 100}%`, zIndex: 2 }}
          />

          {/* Max XP bar (background) */}
          <div
            className="absolute left-0 bottom-0 h-2 bg-gray-300"
            style={{ width: "100%", zIndex: 3 }}
          />
          {/* Current XP bar (foreground) */}
          <div
            className="absolute left-0 bottom-0 h-2 bg-blue-400"
            style={{ width: `${xpPercent * 100}%`, zIndex: 4 }}
          />
        </div>
        {position === "top-right" && (
          <span className="ml-2 font-semibold text-red-700 min-w-[60px] text-right">
            {currentHealth}/{currentMaxHealth} HP
          </span>
        )}
      </div>
    </div>
  );
}
