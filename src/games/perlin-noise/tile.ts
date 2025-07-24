import { Vec2 } from "@/src/utils/vector";
import { TileType, TILE_TYPES } from "@/src/games/perlin-noise/tile-utils";

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

  updatePerlinValue(newValue: number) {
    this.perlinValue = newValue;
    this.updateType();
  }

  reset() {
    this.gridSpaceLoc = new Vec2(0, 0);
    this.updatePerlinValue(0);
  }

  updateType() {
    if (this.perlinValue < 0.15) {
      this.tileType = TILE_TYPES.DEEP_WATER;
    } else if (this.perlinValue < 0.35) {
      this.tileType = TILE_TYPES.SHALLOW_WATER;
    } else if (this.perlinValue < 0.45) {
      this.tileType = TILE_TYPES.BEACH;
    } else if (this.perlinValue < 0.55) {
      this.tileType = TILE_TYPES.SOIL;
    } else if (this.perlinValue < 0.65) {
      this.tileType = TILE_TYPES.GRASS;
    } else if (this.perlinValue < 0.75) {
      this.tileType = TILE_TYPES.FOREST;
    } else if (this.perlinValue < 0.88) {
      this.tileType = TILE_TYPES.MOUNTAIN;
    } else {
      this.tileType = TILE_TYPES.SNOW;
    }
  }

  destroy() {
    this.reset();
  }
}
