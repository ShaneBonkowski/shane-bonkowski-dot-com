"use client";

import { useSyncExternalStore } from "react";
import { settingsStore } from "@/src/games/better-boids/settings-store";

export const UseSettings = () => {
  const settings = useSyncExternalStore(
    settingsStore.subscribe.bind(settingsStore),
    settingsStore.getSnapshot.bind(settingsStore),
    settingsStore.getSnapshot.bind(settingsStore)
  );

  return {
    ...settings,
    // Actions
    setAlignmentFactor: settingsStore.setAlignmentFactor.bind(settingsStore),
    setCohesionFactor: settingsStore.setCohesionFactor.bind(settingsStore),
    setSeparationFactor: settingsStore.setSeparationFactor.bind(settingsStore),
    setSpeed: settingsStore.setSpeed.bind(settingsStore),
    setFlockSearchRadius:
      settingsStore.setFlockSearchRadius.bind(settingsStore),
    setLeaderStrength:
      settingsStore.setLeaderStrength.bind(settingsStore),
    setCollisionsEnabled:
      settingsStore.setCollisionsEnabled.bind(settingsStore),
    setShowHitboxes: settingsStore.setShowHitboxes.bind(settingsStore),
    setGoodBoidCount: settingsStore.setGoodBoidCount.bind(settingsStore),
    setBadBoidCount: settingsStore.setBadBoidCount.bind(settingsStore),
    setObstacleCount: settingsStore.setObstacleCount.bind(settingsStore),
    resetData: settingsStore.resetData.bind(settingsStore),
  };
};
