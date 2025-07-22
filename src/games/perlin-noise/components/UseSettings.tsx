"use client";

import { useSyncExternalStore } from "react";
import { settingsStore } from "@/src/games/perlin-noise/settings-store";

export const UseSettings = () => {
  const settings = useSyncExternalStore(
    settingsStore.subscribe.bind(settingsStore),
    settingsStore.getSnapshot.bind(settingsStore),
    settingsStore.getSnapshot.bind(settingsStore)
  );

  return {
    ...settings,
    // Actions
    setAutoPlay: settingsStore.setAutoPlay.bind(settingsStore),
  };
};
