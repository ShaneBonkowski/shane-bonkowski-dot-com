import { SyncedStore } from "@/src/utils/synced-store";
import {
  ColorPreset,
  DEFAULT_COLOR_PRESETS,
} from "@/src/games/perlin-noise/color-presets";

export interface Settings {
  autoPlay: boolean;
  zSliceSliderValue: number;
  walkSpeedSliderValue: number;
  zoomSliderValue: number;
  customColorPresets: ColorPreset[];
  currentColorPresetIndex: number;
}

class SettingsStore extends SyncedStore<Settings> {
  private defaultData: Settings = {
    autoPlay: true,
    zSliceSliderValue: 50,
    walkSpeedSliderValue: 50,
    zoomSliderValue: -25,
    customColorPresets: DEFAULT_COLOR_PRESETS,
    currentColorPresetIndex: 0,
  };

  private data: Settings = { ...this.defaultData };

  // eslint-disable-next-line no-restricted-syntax
  constructor() {
    super();

    // Return early during SSR/static generation (need to call super first)
    if (typeof window === "undefined") return;
  }

  protected getData(): Settings {
    return { ...this.data };
  }

  public setAutoPlay(value: boolean): boolean {
    this.data.autoPlay = value;
    this.notify();

    return value;
  }

  public setZSliceSliderValue(value: number): number {
    this.data.zSliceSliderValue = value;
    this.notify();

    return value;
  }

  public setWalkSpeedSliderValue(value: number): number {
    this.data.walkSpeedSliderValue = value;
    this.notify();

    return value;
  }

  public setZoomSliderValue(value: number): number {
    this.data.zoomSliderValue = value;
    this.notify();

    return value;
  }

  setCustomColorPreset(index: number, value: ColorPreset): ColorPreset {
    if (!this.data.customColorPresets) {
      this.data.customColorPresets = [...DEFAULT_COLOR_PRESETS];
    }

    // Ensure the index is within bounds
    if (index < 0 || index >= this.data.customColorPresets.length) {
      throw new Error("Index out of bounds for custom color presets");
    }

    this.data.customColorPresets[index] = value;
    this.notify();

    return value;
  }

  setCurrentColorPresetIndex(value: number): number {
    this.data.currentColorPresetIndex = value;
    this.notify();

    return value;
  }

  public resetData() {
    // Reset to base defaults
    this.data = { ...this.defaultData };

    this.notify();
  }
}

// Export singleton instance
export const settingsStore = new SettingsStore();
