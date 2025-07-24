import { SyncedStore } from "@/src/utils/synced-store";
import {
  ColorPreset,
  DEFAULT_COLOR_PRESETS,
} from "@/src/games/perlin-noise/color-presets";
import {
  GenerationPreset,
  DEFAULT_GENERATION_PRESETS,
} from "@/src/games/perlin-noise/generation-presets";
import { TILE_TYPES } from "@/src/games/perlin-noise/tile-utils";
import {
  QualityLevel,
  QUALITY_LEVELS,
} from "@/src/games/perlin-noise/tile-utils";

export interface Settings {
  autoPlay: boolean;
  zSliceSliderValue: number;
  walkSpeedSliderValue: number;
  zoomSliderValue: number;
  customColorPresets: ColorPreset[];
  currentColorPresetIndex: number;
  customGenerationPresets: GenerationPreset[];
  currentGenerationPresetIndex: number;
  qualityLevel: QualityLevel;
}

class SettingsStore extends SyncedStore<Settings> {
  private defaultData: Settings = {
    autoPlay: true,
    zSliceSliderValue: 50,
    walkSpeedSliderValue: 50,
    zoomSliderValue: -25,
    // Set default to deep copies of default presets
    customColorPresets: DEFAULT_COLOR_PRESETS.map((preset) => ({
      ...preset,
      colors: { ...preset.colors },
    })),
    currentColorPresetIndex: 0,
    // Set default to deep copies of default presets
    customGenerationPresets: DEFAULT_GENERATION_PRESETS.map((preset) => ({
      ...preset,
      generation: { ...preset.generation },
    })),
    currentGenerationPresetIndex: 0,
    qualityLevel: QUALITY_LEVELS.MEDIUM,
  };

  private data: Settings = { ...this.defaultData };

  // eslint-disable-next-line no-restricted-syntax
  constructor() {
    super();

    // Return early during SSR/static generation (need to call super first)
    if (typeof window === "undefined") return;

    this.loadFromLocalStorage();
  }

  private loadFromLocalStorage() {
    const savedCurrentColorPresetIndex = this.getLocalStorage(
      "perlinNoiseCurrentColorPresetIndex",
      this.defaultData.currentColorPresetIndex
    );
    const savedCustomColorPreset1 = this.getLocalStorage(
      "perlinNoiseCustomColorPreset1",
      // Set default to a deep copy
      {
        ...DEFAULT_COLOR_PRESETS[0],
        colors: { ...DEFAULT_COLOR_PRESETS[0].colors },
      }
    );
    const savedCustomColorPreset2 = this.getLocalStorage(
      "perlinNoiseCustomColorPreset2",
      // Set default to a deep copy
      {
        ...DEFAULT_COLOR_PRESETS[1],
        colors: { ...DEFAULT_COLOR_PRESETS[1].colors },
      }
    );
    const savedCustomColorPreset3 = this.getLocalStorage(
      "perlinNoiseCustomColorPreset3",
      // Set default to a deep copy
      {
        ...DEFAULT_COLOR_PRESETS[2],
        colors: { ...DEFAULT_COLOR_PRESETS[2].colors },
      }
    );
    const savedCustomColorPreset4 = this.getLocalStorage(
      "perlinNoiseCustomColorPreset4",
      // Set default to a deep copy
      {
        ...DEFAULT_COLOR_PRESETS[3],
        colors: { ...DEFAULT_COLOR_PRESETS[3].colors },
      }
    );
    const savedCustomColorPreset5 = this.getLocalStorage(
      "perlinNoiseCustomColorPreset5",
      // Set default to a deep copy
      {
        ...DEFAULT_COLOR_PRESETS[4],
        colors: { ...DEFAULT_COLOR_PRESETS[4].colors },
      }
    );
    const savedCurrentGenerationPresetIndex = this.getLocalStorage(
      "perlinNoiseCurrentGenerationPresetIndex",
      this.defaultData.currentGenerationPresetIndex
    );
    const savedCustomGenerationPreset1 = this.getLocalStorage(
      "perlinNoiseCustomGenerationPreset1",
      // Set default to a deep copy
      {
        ...DEFAULT_GENERATION_PRESETS[0],
        generation: { ...DEFAULT_GENERATION_PRESETS[0].generation },
      }
    );
    const savedCustomGenerationPreset2 = this.getLocalStorage(
      "perlinNoiseCustomGenerationPreset2",
      // Set default to a deep copy
      {
        ...DEFAULT_GENERATION_PRESETS[1],
        generation: { ...DEFAULT_GENERATION_PRESETS[1].generation },
      }
    );
    const savedCustomGenerationPreset3 = this.getLocalStorage(
      "perlinNoiseCustomGenerationPreset3",
      // Set default to a deep copy
      {
        ...DEFAULT_GENERATION_PRESETS[2],
        generation: { ...DEFAULT_GENERATION_PRESETS[2].generation },
      }
    );
    const savedCustomGenerationPreset4 = this.getLocalStorage(
      "perlinNoiseCustomGenerationPreset4",
      // Set default to a deep copy
      {
        ...DEFAULT_GENERATION_PRESETS[3],
        generation: { ...DEFAULT_GENERATION_PRESETS[3].generation },
      }
    );
    const savedCustomGenerationPreset5 = this.getLocalStorage(
      "perlinNoiseCustomGenerationPreset5",
      // Set default to a deep copy
      {
        ...DEFAULT_GENERATION_PRESETS[4],
        generation: { ...DEFAULT_GENERATION_PRESETS[4].generation },
      }
    );
    const savedQualityLevel = this.getLocalStorage(
      "perlinNoiseQualityLevel",
      this.defaultData.qualityLevel
    );

    this.setLocalStorageFields(
      savedCurrentColorPresetIndex,
      savedCustomColorPreset1,
      savedCustomColorPreset2,
      savedCustomColorPreset3,
      savedCustomColorPreset4,
      savedCustomColorPreset5,
      savedCurrentGenerationPresetIndex,
      savedCustomGenerationPreset1,
      savedCustomGenerationPreset2,
      savedCustomGenerationPreset3,
      savedCustomGenerationPreset4,
      savedCustomGenerationPreset5,
      savedQualityLevel
    );
  }

  private setLocalStorageFields(
    currentColorPresetIndex: number,
    customColorPreset1: ColorPreset,
    customColorPreset2: ColorPreset,
    customColorPreset3: ColorPreset,
    customColorPreset4: ColorPreset,
    customColorPreset5: ColorPreset,
    currentGenerationPresetIndex: number,
    customGenerationPreset1: GenerationPreset,
    customGenerationPreset2: GenerationPreset,
    customGenerationPreset3: GenerationPreset,
    customGenerationPreset4: GenerationPreset,
    customGenerationPreset5: GenerationPreset,
    qualityLevel: QualityLevel
  ) {
    this.setCurrentColorPresetIndex(currentColorPresetIndex);
    this.setCustomColorPreset(0, customColorPreset1);
    this.setCustomColorPreset(1, customColorPreset2);
    this.setCustomColorPreset(2, customColorPreset3);
    this.setCustomColorPreset(3, customColorPreset4);
    this.setCustomColorPreset(4, customColorPreset5);
    this.setCurrentGenerationPresetIndex(currentGenerationPresetIndex);
    this.setCustomGenerationPreset(0, customGenerationPreset1);
    this.setCustomGenerationPreset(1, customGenerationPreset2);
    this.setCustomGenerationPreset(2, customGenerationPreset3);
    this.setCustomGenerationPreset(3, customGenerationPreset4);
    this.setCustomGenerationPreset(4, customGenerationPreset5);
    this.setQualityLevel(qualityLevel);
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
    // Ensure the index is within bounds
    if (index < 0 || index >= this.data.customColorPresets.length) {
      throw new Error("Index out of bounds for custom color presets");
    }

    this.data.customColorPresets[index] = value;
    this.setLocalStorage(`perlinNoiseCustomColorPreset${index + 1}`, value);
    this.notify();

    return value;
  }

  setCurrentColorPresetIndex(value: number): number {
    this.data.currentColorPresetIndex = value;
    this.setLocalStorage("perlinNoiseCurrentColorPresetIndex", value);
    this.notify();

    return value;
  }

  setCustomGenerationPreset(
    index: number,
    value: GenerationPreset
  ): GenerationPreset {
    // Ensure the index is within bounds
    if (index < 0 || index >= this.data.customGenerationPresets.length) {
      throw new Error("Index out of bounds for custom generation presets");
    }

    // Enforce that the SNOW preset is always == 1 since it is the last tile type
    if (value.generation[TILE_TYPES.SNOW] !== 1) {
      console.warn(
        "SNOW value must be set to 1 since it is the last tile type. Overriding to 1."
      );
      value.generation[TILE_TYPES.SNOW] = 1;
    }

    this.data.customGenerationPresets[index] = value;
    this.setLocalStorage(
      `perlinNoiseCustomGenerationPreset${index + 1}`,
      value
    );
    this.notify();

    return value;
  }

  setCurrentGenerationPresetIndex(value: number): number {
    this.data.currentGenerationPresetIndex = value;
    this.setLocalStorage("perlinNoiseCurrentGenerationPresetIndex", value);
    this.notify();

    return value;
  }

  setQualityLevel(value: QualityLevel): QualityLevel {
    this.data.qualityLevel = value;
    this.setLocalStorage("perlinNoiseQualityLevel", value);
    this.notify();

    return value;
  }

  public resetData() {
    // Reset session data but preserve persistent data
    this.data = {
      ...this.defaultData,
      customColorPresets: [
        this.data.customColorPresets[0],
        this.data.customColorPresets[1],
        this.data.customColorPresets[2],
        this.data.customColorPresets[3],
        this.data.customColorPresets[4],
      ],
      currentColorPresetIndex: this.data.currentColorPresetIndex,
      customGenerationPresets: [
        this.data.customGenerationPresets[0],
        this.data.customGenerationPresets[1],
        this.data.customGenerationPresets[2],
        this.data.customGenerationPresets[3],
        this.data.customGenerationPresets[4],
      ],
      currentGenerationPresetIndex: this.data.currentGenerationPresetIndex,
      qualityLevel: this.data.qualityLevel,
    };

    this.notify();
  }

  public resetPermanentData() {
    // Reset data
    this.data = {
      ...this.defaultData,
    };

    // Reset all data that writes to localStorage
    this.setLocalStorageFields(
      this.defaultData.currentColorPresetIndex,
      this.defaultData.customColorPresets[0],
      this.defaultData.customColorPresets[1],
      this.defaultData.customColorPresets[2],
      this.defaultData.customColorPresets[3],
      this.defaultData.customColorPresets[4],
      this.defaultData.currentGenerationPresetIndex,
      this.defaultData.customGenerationPresets[0],
      this.defaultData.customGenerationPresets[1],
      this.defaultData.customGenerationPresets[2],
      this.defaultData.customGenerationPresets[3],
      this.defaultData.customGenerationPresets[4],
      this.defaultData.qualityLevel
    );

    this.notify();
  }
}

// Export singleton instance
export const settingsStore = new SettingsStore();
