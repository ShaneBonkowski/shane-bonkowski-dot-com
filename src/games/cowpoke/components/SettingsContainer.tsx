"use client";

import React, { useState, useEffect, useRef } from "react";
import { FaCog, FaHeart } from "react-icons/fa";
import { GiCrossedSwords, GiRock, GiSprint } from "react-icons/gi";
import GameIconButton from "@/src/components/GameIconButton";
import GameUiWindow from "@/src/components/GameUiWindow";
import { dispatchMenuEvent } from "@/src/events/game-events";
import LootContainer from "@/src/games/cowpoke/components/LootContainer";
import { UseGameData } from "@/src/games/cowpoke/components/UseGameData";
import { isMobileDevice } from "@/src/utils/heuristics";

const UpgradeButton = ({
  type,
  icon,
  level,
  upgradePoints,
  borderColor,
  textColor,
  onPointerDown,
}: {
  type: "Health" | "Damage" | "Combat" | "Element";
  icon: React.ReactNode;
  level: number;
  upgradePoints: number;
  borderColor: string;
  textColor: string;
  onPointerDown: () => void;
}) => (
  <button
    onPointerDown={onPointerDown}
    disabled={upgradePoints <= 0}
    className={`
        min-w-32 min-h-20 border-2 bg-black bg-opacity-50 
        ${
          upgradePoints > 0
            ? `${borderColor} hover:bg-opacity-40 cursor-pointer`
            : "border-gray-400 cursor-not-allowed opacity-60"
        }
        flex flex-col items-center justify-center p-2 text-white text-sm
      `}
    title={`Increase Permanent ${type} Level ${level}${
      upgradePoints > 0 ? " - Click to upgrade!" : " - Need upgrade points"
    }`}
  >
    <div className="text-lg mb-1">{icon}</div>
    <div>Level {level}</div>
    <div
      className={`text-xs ${upgradePoints > 0 ? textColor : "text-gray-400"}`}
    >
      {`+1 ${type}`}
    </div>
  </button>
);

const SettingsContainer: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isButtonVisible, setIsButtonVisible] = useState(true);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const {
    playerUpgradePoints,
    playerEquippedHatId,
    playerEquippedGunId,
    playerOwnedHatIds,
    playerOwnedGunIds,
    permaHealthLevel,
    permaDamageLevel,
    permaCombatLevel,
    permaElementLevel,
    settingsSeenHatIds,
    settingsSeenGunIds,
    autoMode,
    setSettingsSeenHatIds,
    setSettingsSeenGunIds,
    setAutoMode,
  } = UseGameData();

  const handleEquipHat = (hatId: number) => {
    if (hatId !== playerEquippedHatId) {
      // Dispatch event to notify game
      document.dispatchEvent(
        new CustomEvent("playerEquipmentChanged", {
          detail: { type: "hat", id: hatId },
        })
      );
    }
  };

  const handleEquipGun = (gunId: number) => {
    if (gunId !== playerEquippedGunId) {
      // Dispatch event to notify game
      document.dispatchEvent(
        new CustomEvent("playerEquipmentChanged", {
          detail: { type: "gun", id: gunId },
        })
      );
    }
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

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, []);

  // Function to update seen loot
  const updateSeenLoot = () => {
    // Create snapshot of current owned items
    const currentSeenHats = [...playerOwnedHatIds];
    const currentSeenGuns = [...playerOwnedGunIds];

    // Update state
    setSettingsSeenHatIds(currentSeenHats);
    setSettingsSeenGunIds(currentSeenGuns);
  };

  // Helper functions to check if loot is new
  const isHatNew = (hatId: number) => !settingsSeenHatIds.includes(hatId);
  const isGunNew = (gunId: number) => !settingsSeenGunIds.includes(gunId);

  const openWindow = () => {
    // Turn off auto mode since ui menu being open can break some things in
    // auto mode
    if (autoMode) {
      setAutoMode(false);
    }

    // Add a small delay before revealing.
    // This is a hack b/c phones sometimes double click.
    timeoutRef.current = setTimeout(
      () => {
        setIsVisible(true);
        dispatchMenuEvent("Settings", "open");
      },
      isMobileDevice() ? 220 : 150
    );
  };

  const closeWindow = () => {
    // Add a small delay before hiding the box.
    // This is a hack b/c phones sometimes double click and
    // click on the box behind the button.
    timeoutRef.current = setTimeout(
      () => {
        setIsVisible(false);
        updateSeenLoot(); // Update seen loot before closing
        dispatchMenuEvent("Settings", "close");
      },
      isMobileDevice() ? 220 : 150
    );
  };

  const getNewItemsCount = () => {
    const newHats = playerOwnedHatIds.filter(
      (hatId) => !settingsSeenHatIds.includes(hatId)
    ).length;
    const newGuns = playerOwnedGunIds.filter(
      (gunId) => !settingsSeenGunIds.includes(gunId)
    ).length;
    return newHats + newGuns;
  };

  const getTotalNotificationCount = () => {
    return playerUpgradePoints + getNewItemsCount();
  };

  const handlePermaHealthUpgrade = () => {
    if (playerUpgradePoints > 0) {
      // Notify game
      document.dispatchEvent(
        new CustomEvent("permanentUpgrade", {
          detail: {
            type: "health",
          },
        })
      );
    }
  };

  const handlePermaDamageUpgrade = () => {
    if (playerUpgradePoints > 0) {
      // Notify game
      document.dispatchEvent(
        new CustomEvent("permanentUpgrade", {
          detail: {
            type: "damage",
          },
        })
      );
    }
  };

  const handlePermaCombatUpgrade = () => {
    if (playerUpgradePoints > 0) {
      // Notify game
      document.dispatchEvent(
        new CustomEvent("permanentUpgrade", {
          detail: {
            type: "combat",
          },
        })
      );
    }
  };

  const handlePermaElementUpgrade = () => {
    if (playerUpgradePoints > 0) {
      // Notify game
      document.dispatchEvent(
        new CustomEvent("permanentUpgrade", {
          detail: {
            type: "element",
          },
        })
      );
    }
  };

  return (
    <>
      <div className="z-20 fixed bottom-3 left-3 flex flex-row items-center gap-2">
        <GameIconButton
          onPointerDown={openWindow}
          icon={<FaCog size={30} />}
          ariaLabel="Settings"
          className={`${isButtonVisible ? "" : "hidden"}`}
          darkModeLight={true}
          whiteBackground={true}
          title="Settings"
        />

        {/* Notification count */}
        {getTotalNotificationCount() > 0 && isButtonVisible && (
          <div className="bg-green-500 text-white text-sm font-bold px-2 py-1 rounded-full pointer-events-none">
            +{getTotalNotificationCount()}
          </div>
        )}
      </div>

      <GameUiWindow isVisible={isVisible} onClose={closeWindow}>
        <div className="flex flex-col items-center gap-6 mb-6">
          {/* Title */}
          <h1 className="text-center">Gear & Upgrades</h1>

          {/* Upgrades Section */}
          <div>
            <h2 className="text-center">Permanent Upgrades</h2>
            {playerUpgradePoints > 0 ? (
              <p className="text-center">
                Upgrade Points Available: {playerUpgradePoints}
              </p>
            ) : (
              <p className="text-center">Level up to earn upgrade points!</p>
            )}
            <div className="flex flex-row gap-4 justify-center">
              <UpgradeButton
                type="Health"
                icon={<FaHeart size={30} />}
                level={permaHealthLevel}
                upgradePoints={playerUpgradePoints}
                borderColor="border-green-500"
                textColor="text-green-400"
                onPointerDown={handlePermaHealthUpgrade}
              />

              <UpgradeButton
                type="Damage"
                icon={<GiCrossedSwords size={30} />}
                level={permaDamageLevel}
                upgradePoints={playerUpgradePoints}
                borderColor="border-red-500"
                textColor="text-red-400"
                onPointerDown={handlePermaDamageUpgrade}
              />

              <UpgradeButton
                type="Element"
                icon={<GiRock size={30} />}
                level={permaElementLevel}
                upgradePoints={playerUpgradePoints}
                borderColor="border-purple-500"
                textColor="text-purple-400"
                onPointerDown={handlePermaElementUpgrade}
              />

              <UpgradeButton
                type="Combat"
                icon={<GiSprint size={30} />}
                level={permaCombatLevel}
                upgradePoints={playerUpgradePoints}
                borderColor="border-blue-500"
                textColor="text-blue-400"
                onPointerDown={handlePermaCombatUpgrade}
              />
            </div>
          </div>

          {/* Owned Guns Section */}
          <div id="owned-guns">
            <h2 className="text-center">Guns</h2>
            <div className="flex flex-row flex-wrap justify-center gap-3">
              {playerOwnedGunIds.map((gunId) => (
                <LootContainer
                  key={`gun-${gunId}`}
                  lootId={gunId}
                  lootType="gun"
                  isEquipped={gunId === playerEquippedGunId}
                  isNew={isGunNew(gunId)}
                  onPointerDown={() => handleEquipGun(gunId)}
                />
              ))}
            </div>
          </div>

          {/* Owned Hats Section */}
          <div id="owned-hats">
            <h2 className="text-center">Hats</h2>
            <div className="flex flex-row flex-wrap justify-center gap-3">
              {playerOwnedHatIds.map((hatId) => (
                <LootContainer
                  key={`hat-${hatId}`}
                  lootId={hatId}
                  lootType="hat"
                  isEquipped={hatId === playerEquippedHatId}
                  isNew={isHatNew(hatId)}
                  onPointerDown={() => handleEquipHat(hatId)}
                />
              ))}
            </div>
          </div>
        </div>
      </GameUiWindow>
    </>
  );
};

export default SettingsContainer;
