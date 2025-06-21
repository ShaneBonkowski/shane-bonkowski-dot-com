import { useSyncExternalStore } from "react";
import { gameDataStore } from "@/src/games/cowpoke/game-data-store";

export const UseGameData = () => {
  const gameData = useSyncExternalStore(
    gameDataStore.subscribe.bind(gameDataStore),
    gameDataStore.getSnapshot.bind(gameDataStore),
    gameDataStore.getSnapshot.bind(gameDataStore)
  );

  return {
    ...gameData,
    // Player Actions
    setPlayerName: gameDataStore.setPlayerName.bind(gameDataStore),
    setPlayerLevel: gameDataStore.setPlayerLevel.bind(gameDataStore),
    setPlayerHealth: gameDataStore.setPlayerHealth.bind(gameDataStore),
    setPlayerMaxHealth: gameDataStore.setPlayerMaxHealth.bind(gameDataStore),
    setPlayerXp: gameDataStore.setPlayerXp.bind(gameDataStore),
    setPlayerMaxXp: gameDataStore.setPlayerMaxXp.bind(gameDataStore),
    setPlayerUpgradePoints:
      gameDataStore.setPlayerUpgradePoints.bind(gameDataStore),
    // Enemy Actions
    setEnemyName: gameDataStore.setEnemyName.bind(gameDataStore),
    setEnemyLevel: gameDataStore.setEnemyLevel.bind(gameDataStore),
    setEnemyHealth: gameDataStore.setEnemyHealth.bind(gameDataStore),
    setEnemyMaxHealth: gameDataStore.setEnemyMaxHealth.bind(gameDataStore),
    setEnemyXp: gameDataStore.setEnemyXp.bind(gameDataStore),
    setEnemyMaxXp: gameDataStore.setEnemyMaxXp.bind(gameDataStore),
    setEnemyUpgradePoints:
      gameDataStore.setEnemyUpgradePoints.bind(gameDataStore),
    // Game Actions
    setAutoMode: gameDataStore.setAutoMode.bind(gameDataStore),
    setFastMode: gameDataStore.setFastMode.bind(gameDataStore),
    setSettingsSeenHatIds:
      gameDataStore.setSettingsSeenHatIds.bind(gameDataStore),
    setSettingsSeenGunIds:
      gameDataStore.setSettingsSeenGunIds.bind(gameDataStore),
    resetData: gameDataStore.resetData.bind(gameDataStore),
  };
};
