"use client";

import React, { useState, useEffect, useRef } from "react";
import { FaCog } from "react-icons/fa";
import GameIconButton from "@/src/components/GameIconButton";
import GameUiWindow from "@/src/components/GameUiWindow";
import { dispatchMenuEvent } from "@/src/events/game-events";
import LootContainer from "@/src/games/cowpoke/LootContainer";
import { CHARACTER_TYPES } from "@/src/games/cowpoke/character";

const UpgradeButton = ({
  type,
  icon,
  level,
  upgradePoints,
  borderColor,
  textColor,
  onPointerDown,
}: {
  type: "Health" | "Damage";
  icon: string;
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
        w-32 h-20 border-2 bg-black bg-opacity-50 
        ${
          upgradePoints > 0
            ? `border-${borderColor} hover:bg-opacity-40 cursor-pointer`
            : "border-gray-500 cursor-not-allowed opacity-60"
        }
        flex flex-col items-center justify-center p-2 text-white text-sm
      `}
    title={`Increase Permanent ${type} Level ${level}${
      upgradePoints > 0 ? " - Click to upgrade!" : " - Need upgrade points"
    }`}
  >
    <div className="font-bold text-lg">{icon}</div>
    <div>Level {level}</div>
    {upgradePoints > 0 && (
      <div className={`text-xs text-${textColor}`}>{`+1 ${type}`}</div>
    )}
  </button>
);

const SettingsContainer: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isButtonVisible, setIsButtonVisible] = useState(true);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [upgradePoints, setUpgradePoints] = useState(0);
  const [equippedHatId, setEquippedHatId] = useState(0);
  const [equippedGunId, setEquippedGunId] = useState(0);
  const [ownedHatIds, setOwnedHatIds] = useState<number[]>([]);
  const [ownedGunIds, setOwnedGunIds] = useState<number[]>([]);
  const [seenHatIds, setSeenHatIds] = useState<number[]>([]);
  const [seenGunIds, setSeenGunIds] = useState<number[]>([]);
  const [permaHealthLevel, setPermaHealthLevel] = useState(0);
  const [permaDamageLevel, setPermaDamageLevel] = useState(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleEquipHat = (hatId: number) => {
    if (hatId !== equippedHatId) {
      setEquippedHatId(hatId);
      // Dispatch event to notify game
      document.dispatchEvent(
        new CustomEvent("equipmentChanged", {
          detail: { type: "hat", id: hatId },
        })
      );
    }
  };

  const handleEquipGun = (gunId: number) => {
    if (gunId !== equippedGunId) {
      setEquippedGunId(gunId);
      // Dispatch event to notify game
      document.dispatchEvent(
        new CustomEvent("equipmentChanged", {
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

    const handleCharacterLevelUpdate = (event: Event) => {
      const customEvent = event as CustomEvent;

      // If player levels up, update the current level and upgrade points
      if (customEvent.detail?.characterType === CHARACTER_TYPES.PLAYER) {
        if (customEvent.detail?.level)
          setCurrentLevel(customEvent.detail.level);
        if (customEvent.detail?.upgradePoints)
          setUpgradePoints(customEvent.detail.upgradePoints);
      }
    };

    const handleUpdateOwnedHats = (event: Event) => {
      const customEvent = event as CustomEvent;
      if (customEvent.detail?.ownedHatIds) {
        setOwnedHatIds(customEvent.detail.ownedHatIds);
      }
    };

    const handleUpdateOwnedGuns = (event: Event) => {
      const customEvent = event as CustomEvent;
      if (customEvent.detail?.ownedGunIds) {
        setOwnedGunIds(customEvent.detail.ownedGunIds);
      }
    };

    const savedSeenHats = localStorage.getItem("cowpoke-seen-hats");
    const savedSeenGuns = localStorage.getItem("cowpoke-seen-guns");
    const savedPermaHealth = localStorage.getItem("cowpoke-perma-health");
    const savedPermaDamage = localStorage.getItem("cowpoke-perma-damage");

    if (savedSeenHats) {
      setSeenHatIds(JSON.parse(savedSeenHats));
    }
    if (savedSeenGuns) {
      setSeenGunIds(JSON.parse(savedSeenGuns));
    }
    if (savedPermaHealth) {
      setPermaHealthLevel(parseInt(savedPermaHealth));
    }
    if (savedPermaDamage) {
      setPermaDamageLevel(parseInt(savedPermaDamage));
    }

    document.addEventListener("uiMenuOpen", handleUiMenuOpen);
    document.addEventListener("uiMenuClose", handleUiMenuClose);
    document.addEventListener(
      "characterLevelUpdate",
      handleCharacterLevelUpdate
    );
    document.addEventListener("updateOwnedHats", handleUpdateOwnedHats);
    document.addEventListener("updateOwnedGuns", handleUpdateOwnedGuns);

    return () => {
      document.removeEventListener("uiMenuOpen", handleUiMenuOpen);
      document.removeEventListener("uiMenuClose", handleUiMenuClose);
      document.removeEventListener(
        "characterLevelUpdate",
        handleCharacterLevelUpdate
      );
      document.removeEventListener("updateOwnedHats", handleUpdateOwnedHats);
      document.removeEventListener("updateOwnedGuns", handleUpdateOwnedGuns);

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, []);

  // Function to update seen loot
  const updateSeenLoot = () => {
    // Create snapshot of current owned items
    const currentSeenHats = [...ownedHatIds];
    const currentSeenGuns = [...ownedGunIds];

    // Update state
    setSeenHatIds(currentSeenHats);
    setSeenGunIds(currentSeenGuns);

    // Persist to localStorage
    localStorage.setItem("cowpoke-seen-hats", JSON.stringify(currentSeenHats));
    localStorage.setItem("cowpoke-seen-guns", JSON.stringify(currentSeenGuns));
  };

  // Helper functions to check if loot is new
  const isHatNew = (hatId: number) => !seenHatIds.includes(hatId);
  const isGunNew = (gunId: number) => !seenGunIds.includes(gunId);

  const openWindow = () => {
    // Add a small delay before revealing.
    // This is a hack b/c phones sometimes double click.
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true);
      dispatchMenuEvent("Settings", "open");
    }, 150);
  };

  const closeWindow = () => {
    // Add a small delay before hiding the box.
    // This is a hack b/c phones sometimes double click and
    // click on the box behind the button.
    timeoutRef.current = setTimeout(() => {
      setIsVisible(false);
      updateSeenLoot(); // Update seen loot before closing
      dispatchMenuEvent("Settings", "close");
    }, 150);
  };

  const getNewItemsCount = () => {
    const newHats = ownedHatIds.filter(
      (hatId) => !seenHatIds.includes(hatId)
    ).length;
    const newGuns = ownedGunIds.filter(
      (gunId) => !seenGunIds.includes(gunId)
    ).length;
    return newHats + newGuns;
  };

  const getTotalNotificationCount = () => {
    return upgradePoints + getNewItemsCount();
  };

  const handlePermaHealthUpgrade = () => {
    if (upgradePoints > 0) {
      const newLevel = permaHealthLevel + 1;
      const newUpgradePoints = upgradePoints - 1;

      // Update local state
      setPermaHealthLevel(newLevel);
      setUpgradePoints(newUpgradePoints);

      // Persist to localStorage
      localStorage.setItem("cowpoke-perma-health", newLevel.toString());

      // Notify game
      document.dispatchEvent(
        new CustomEvent("permanentUpgrade", {
          detail: {
            type: "health",
            level: newLevel,
            upgradePointsRemaining: newUpgradePoints,
          },
        })
      );
    }
  };

  const handlePermaDamageUpgrade = () => {
    if (upgradePoints > 0) {
      const newLevel = permaDamageLevel + 1;
      const newUpgradePoints = upgradePoints - 1;

      // Update local state
      setPermaDamageLevel(newLevel);
      setUpgradePoints(newUpgradePoints);

      // Persist to localStorage
      localStorage.setItem("cowpoke-perma-damage", newLevel.toString());

      // Notify game
      document.dispatchEvent(
        new CustomEvent("permanentUpgrade", {
          detail: {
            type: "damage",
            level: newLevel,
            upgradePointsRemaining: newUpgradePoints,
          },
        })
      );
    }
  };

  return (
    <>
      <div className="z-20 fixed bottom-5 left-5 flex flex-row items-center gap-2">
        <GameIconButton
          onPointerDown={openWindow}
          icon={<FaCog size={30} />}
          ariaLabel="Cowpoke Settings"
          className={`${isButtonVisible ? "" : "hidden"}`}
          darkModeLight={true}
          whiteBackground={true}
        />

        {/* Notification count */}
        {getTotalNotificationCount() > 0 && isButtonVisible && (
          <div className="bg-green-500 text-white text-sm font-bold px-2 py-1 rounded-full">
            +{getTotalNotificationCount()}
          </div>
        )}
      </div>

      <GameUiWindow isVisible={isVisible} onClose={closeWindow}>
        <div className="flex flex-col items-center">
          {/* Title */}
          <h1 className="text-center">Cowpoke Gear & Upgrades</h1>

          <div className="flex flex-row gap-8 mx-auto">
            <p className="text-center">
              <b>Current Level:</b> {currentLevel}
            </p>
            <p className="text-center">
              <b>Upgrade Points Available:</b> {upgradePoints}
            </p>
          </div>

          {/* Upgrades Section */}
          <h2 className="text-center">Permanent Upgrades</h2>
          <div className="flex flex-row gap-6 justify-center">
            <UpgradeButton
              type="Health"
              icon="❤️"
              level={permaHealthLevel}
              upgradePoints={upgradePoints}
              borderColor="green-500"
              textColor="green-400"
              onPointerDown={handlePermaHealthUpgrade}
            />

            <UpgradeButton
              type="Damage"
              icon="⚔️"
              level={permaDamageLevel}
              upgradePoints={upgradePoints}
              borderColor="red-500"
              textColor="red-400"
              onPointerDown={handlePermaDamageUpgrade}
            />
          </div>

          {upgradePoints === 0 && (
            <p className="text-center">Level up to earn upgrade points!</p>
          )}

          {/* Currently Equipped Section */}
          <div id="equipped-items">
            <h2 className="text-center">Currently Equipped</h2>
            <div className="flex flex-row justify-center gap-6">
              <div className="flex flex-col items-center">
                <h3 className="text-center">Hat</h3>
                <LootContainer
                  lootId={equippedHatId}
                  lootType="hat"
                  isEquipped={true}
                  isNew={isHatNew(equippedHatId)}
                  onPointerDown={() => {}} // No-op for equipped items
                />
              </div>
              <div className="flex flex-col items-center">
                <h3 className="text-center">Gun</h3>
                <LootContainer
                  lootId={equippedGunId}
                  lootType="gun"
                  isEquipped={true}
                  isNew={isGunNew(equippedGunId)}
                  onPointerDown={() => {}} // No-op for equipped items
                />
              </div>
            </div>

            {/* Owned Guns Section */}
            <div id="owned-guns">
              <h2 className="text-center">Owned Guns</h2>
              <div className="flex flex-row flex-wrap justify-center gap-3">
                {ownedGunIds.map((gunId) => (
                  <LootContainer
                    key={`gun-${gunId}`}
                    lootId={gunId}
                    lootType="gun"
                    isEquipped={gunId === equippedGunId}
                    isNew={isGunNew(gunId)}
                    onPointerDown={() => handleEquipGun(gunId)}
                  />
                ))}
              </div>
            </div>

            {/* Owned Hats Section */}
            <div id="owned-hats">
              <h2 className="text-center">Owned Hats</h2>
              <div className="flex flex-row flex-wrap justify-center gap-3">
                {ownedHatIds.map((hatId) => (
                  <LootContainer
                    key={`hat-${hatId}`}
                    lootId={hatId}
                    lootType="hat"
                    isEquipped={hatId === equippedHatId}
                    isNew={isHatNew(hatId)}
                    onPointerDown={() => handleEquipHat(hatId)}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </GameUiWindow>
    </>
  );
};

export default SettingsContainer;
