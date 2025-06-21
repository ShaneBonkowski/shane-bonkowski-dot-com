import { useSyncExternalStore } from "react";
import { gameDataStore } from "@/src/games/flip-tile/game-data-store";

export const UseGameData = () => {
  const gameData = useSyncExternalStore(
    gameDataStore.subscribe.bind(gameDataStore),
    gameDataStore.getSnapshot.bind(gameDataStore),
    gameDataStore.getSnapshot.bind(gameDataStore)
  );

  return {
    ...gameData,
    // Actions
    setScore: gameDataStore.setScore.bind(gameDataStore),
    resetData: gameDataStore.resetData.bind(gameDataStore),
  };
};
