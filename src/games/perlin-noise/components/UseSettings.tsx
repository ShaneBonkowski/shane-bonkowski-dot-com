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
    setZSliceSliderValue:
      settingsStore.setZSliceSliderValue.bind(settingsStore),
    setWalkSpeedSliderValue:
      settingsStore.setWalkSpeedSliderValue.bind(settingsStore),
    setZoomSliderValue: settingsStore.setZoomSliderValue.bind(settingsStore),
    setCustomColorPreset:
      settingsStore.setCustomColorPreset.bind(settingsStore),
    setCurrentColorPresetIndex:
      settingsStore.setCurrentColorPresetIndex.bind(settingsStore),
    setCustomGenerationPreset:
      settingsStore.setCustomGenerationPreset.bind(settingsStore),
    setCurrentGenerationPresetIndex:
      settingsStore.setCurrentGenerationPresetIndex.bind(settingsStore),
  };
};
