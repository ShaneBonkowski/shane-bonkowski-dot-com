"use client";

import React, { useState, useEffect, useRef } from "react";
import { FaCog } from "react-icons/fa";
import GameIconButton from "@/src/components/GameIconButton";
import GameUiWindow from "@/src/components/GameUiWindow";
import { dispatchMenuEvent } from "@/src/events/game-events";
import LootContainer from "@/src/games/cowpoke/LootContainer";
import { CHARACTER_TYPES } from "@/src/games/cowpoke/character";

// FIXME:
// - Make sure all styles match what I use
// - Make sure all events are being used and all ones we listen for exist..
// - Need to decrease level up points on spend
// - Update loot to store the img link?? Or just have generic icon for hat and imgs. Then can just look over at player to see it equip

const SettingsContainer: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isButtonVisible, setIsButtonVisible] = useState(true);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [upgradePoints, setUpgradePoints] = useState(0);
  const [equippedHatId, setEquippedHatId] = useState(0);
  const [equippedGunId, setEquippedGunId] = useState(0);
  const [ownedHatIds, setOwnedHatIds] = useState<number[]>([]);
  const [ownedGunIds, setOwnedGunIds] = useState<number[]>([]);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

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
      dispatchMenuEvent("Settings", "close");
    }, 150);
  };

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

  return (
    <>
      <GameIconButton
        onPointerDown={openWindow}
        icon={<FaCog size={30} />}
        ariaLabel="Cowpoke Settings"
        className={`fixed bottom-5 left-5 ${isButtonVisible ? "" : "hidden"}`}
        darkModeLight={true}
        whiteBackground={true}
      />

      <GameUiWindow isVisible={isVisible} onClose={closeWindow}>
        <div className="flex flex-col items-center">
          {/* Title */}
          <h1 className="text-center text-white">Cowpoke Gear & Upgrades</h1>

          {/* Currently Equipped Section */}
          <div id="equipped-items">
            <h2 className="text-center text-white">Currently Equipped</h2>
            <div className="flex flex-row justify-center gap-6">
              <div className="flex flex-col items-center">
                <h3 className="text-center text-white">Hat</h3>
                <LootContainer
                  lootId={equippedHatId}
                  lootType="hat"
                  isEquipped={true}
                  onClick={() => {}} // No-op for equipped items
                />
              </div>
              <div className="flex flex-col items-center">
                <h3 className="text-center text-white">Gun</h3>
                <LootContainer
                  lootId={equippedGunId}
                  lootType="gun"
                  isEquipped={true}
                  onClick={() => {}} // No-op for equipped items
                />
              </div>
            </div>

            {/* Owned Guns Section */}
            <div id="owned-guns">
              <h2 className="text-center text-white">Owned Guns</h2>
              <div className="flex flex-row flex-wrap justify-center gap-3">
                {ownedGunIds.map((gunId) => (
                  <LootContainer
                    key={`gun-${gunId}`}
                    lootId={gunId}
                    lootType="gun"
                    isEquipped={gunId === equippedGunId}
                    onClick={() => handleEquipGun(gunId)}
                  />
                ))}
              </div>
            </div>

            {/* Owned Hats Section */}
            <div id="owned-hats">
              <h2 className="text-center text-white">Owned Hats</h2>
              <div className="flex flex-row flex-wrap justify-center gap-3">
                {ownedHatIds.map((hatId) => (
                  <LootContainer
                    key={`hat-${hatId}`}
                    lootId={hatId}
                    lootType="hat"
                    isEquipped={hatId === equippedHatId}
                    onClick={() => handleEquipHat(hatId)}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Upgrades Section (Placeholder) */}
          <h2 className="text-center text-white">Permanent Upgrades</h2>
          <div className="flex flex-row gap-8 mx-auto">
            <p className="text-center text-white">
              <b>Current Level:</b> {currentLevel}
            </p>
            <p className="text-center text-white">
              <b>Upgrade Points Available:</b> {upgradePoints}
            </p>
          </div>
          <p className="text-center text-white">
            Coming Soon - Spend upgrade points here!
          </p>
        </div>
      </GameUiWindow>
    </>
  );
};

export default SettingsContainer;
