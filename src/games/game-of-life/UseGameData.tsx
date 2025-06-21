import { useSyncExternalStore } from "react";
import { gameDataStore } from "@/src/games/game-of-life/game-data-store";

export const UseGameData = () => {
  const gameData = useSyncExternalStore(
    gameDataStore.subscribe.bind(gameDataStore),
    gameDataStore.getSnapshot.bind(gameDataStore),
    gameDataStore.getSnapshot.bind(gameDataStore)
  );

  return {
    ...gameData,
    // Actions
    setScore: gameDataStore.setPopulation.bind(gameDataStore),
    setGeneration: gameDataStore.setGeneration.bind(gameDataStore),
    setDiscoMode: gameDataStore.setDiscoMode.bind(gameDataStore),
    resetData: gameDataStore.resetData.bind(gameDataStore),
  };
};
