import { Vec2 } from "@/src/utils/vector";
import { TileType, TILE_TYPES } from "@/src/games/perlin-noise/tile-utils";
import { settingsStore } from "@/src/games/perlin-noise/settings-store";
import { GenerationPreset } from "@/src/games/perlin-noise/generation-presets";

export class Tile {
  public gridSpaceLoc: Vec2 = new Vec2(0, 0);
  public perlinValue: number = 0;
  public tileType: TileType = TILE_TYPES.DEEP_WATER;

  // eslint-disable-next-line no-restricted-syntax
  constructor(gridX: number, gridY: number) {
    // Return early during SSR/static generation
    if (typeof window === "undefined") return;

    this.gridSpaceLoc = new Vec2(gridX, gridY);
  }

  updatePerlinValue(
    newValue: number,
    currentGenerationPreset: GenerationPreset | null = null
  ) {
    this.perlinValue = newValue;
    this.updateType(currentGenerationPreset);
  }

  reset() {
    this.gridSpaceLoc = new Vec2(0, 0);
    this.updatePerlinValue(0);
  }

  updateType(currentGenerationPreset: GenerationPreset | null = null) {
    // Get the current generation preset from the settings store if not provided.
    // Ideally this is provided by the caller to avoid unnecessary store access.
    if (currentGenerationPreset === null) {
      const settings = settingsStore.getSnapshot();
      currentGenerationPreset =
        settings.customGenerationPresets[settings.currentGenerationPresetIndex];
    }

    // Determine the tile type based on the perlin value and the current
    // generation preset.
    if (
      this.perlinValue <
      currentGenerationPreset.generation[TILE_TYPES.DEEP_WATER]
    ) {
      this.tileType = TILE_TYPES.DEEP_WATER;
    } else if (
      this.perlinValue <
      currentGenerationPreset.generation[TILE_TYPES.SHALLOW_WATER]
    ) {
      this.tileType = TILE_TYPES.SHALLOW_WATER;
    } else if (
      this.perlinValue < currentGenerationPreset.generation[TILE_TYPES.BEACH]
    ) {
      this.tileType = TILE_TYPES.BEACH;
    } else if (
      this.perlinValue < currentGenerationPreset.generation[TILE_TYPES.SOIL]
    ) {
      this.tileType = TILE_TYPES.SOIL;
    } else if (
      this.perlinValue < currentGenerationPreset.generation[TILE_TYPES.GRASS]
    ) {
      this.tileType = TILE_TYPES.GRASS;
    } else if (
      this.perlinValue < currentGenerationPreset.generation[TILE_TYPES.FOREST]
    ) {
      this.tileType = TILE_TYPES.FOREST;
    } else if (
      this.perlinValue < currentGenerationPreset.generation[TILE_TYPES.MOUNTAIN]
    ) {
      this.tileType = TILE_TYPES.MOUNTAIN;
    } else {
      this.tileType = TILE_TYPES.SNOW;
    }
  }

  destroy() {
    this.reset();
  }
}
