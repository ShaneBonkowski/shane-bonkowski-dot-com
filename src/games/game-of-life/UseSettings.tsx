import { useSyncExternalStore } from "react";
import { settingsStore } from "@/src/games/game-of-life/settings-store";

export const UseSettings = () => {
  const settings = useSyncExternalStore(
    settingsStore.subscribe.bind(settingsStore),
    settingsStore.getSnapshot.bind(settingsStore),
    settingsStore.getSnapshot.bind(settingsStore)
  );

  return {
    ...settings,
    // Actions
    setUpdateInterval: settingsStore.setUpdateInterval.bind(settingsStore),
    setUnderpopulation: settingsStore.setUnderpopulation.bind(settingsStore),
    setOverpopulation: settingsStore.setOverpopulation.bind(settingsStore),
    setReproduction: settingsStore.setReproduction.bind(settingsStore),
    setColorTheme: settingsStore.setColorTheme.bind(settingsStore),
    setAutoPause: settingsStore.setAutoPause.bind(settingsStore),
    setInfiniteEdges: settingsStore.setInfiniteEdges.bind(settingsStore),
    setDiagonalNeighbors:
      settingsStore.setDiagonalNeighbors.bind(settingsStore),
    resetData: settingsStore.resetData.bind(settingsStore),
  };
};
