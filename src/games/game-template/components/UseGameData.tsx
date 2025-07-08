"use client";

import { useSyncExternalStore } from "react";
import { gameDataStore } from "@/src/games/game-template/game-data-store"; // FIXME: Update the import path to your actual game data store

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
  };
};
