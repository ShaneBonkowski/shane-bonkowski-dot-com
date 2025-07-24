import { TILE_TYPES, TileType } from "@/src/games/perlin-noise/tile-utils";

export type GenerationMap = Record<TileType, number>;

export interface GenerationPreset {
  name: string;
  generation: GenerationMap;
  octaves: number;
}

export const DEFAULT_GENERATION_PRESETS: GenerationPreset[] = [
  {
    name: "Classic",
    generation: {
      [TILE_TYPES.DEEP_WATER]: 0.15,
      [TILE_TYPES.SHALLOW_WATER]: 0.35,
      [TILE_TYPES.BEACH]: 0.45,
      [TILE_TYPES.SOIL]: 0.55,
      [TILE_TYPES.GRASS]: 0.65,
      [TILE_TYPES.FOREST]: 0.75,
      [TILE_TYPES.MOUNTAIN]: 0.88,
      [TILE_TYPES.SNOW]: 1.0, // MUST be 1.0 since it is the last tile type
    },
    octaves: 1,
  },
  {
    name: "Oceanic",
    generation: {
      [TILE_TYPES.DEEP_WATER]: 0.35,
      [TILE_TYPES.SHALLOW_WATER]: 0.65,
      [TILE_TYPES.BEACH]: 1.0,
      [TILE_TYPES.SOIL]: 1.0,
      [TILE_TYPES.GRASS]: 1.0,
      [TILE_TYPES.FOREST]: 1.0,
      [TILE_TYPES.MOUNTAIN]: 1.0,
      [TILE_TYPES.SNOW]: 1.0, // MUST be 1.0 since it is the last tile type
    },
    octaves: 2,
  },
  {
    name: "Mountainous",
    generation: {
      [TILE_TYPES.DEEP_WATER]: 0.1,
      [TILE_TYPES.SHALLOW_WATER]: 0.3,
      [TILE_TYPES.BEACH]: 0.5,
      [TILE_TYPES.SOIL]: 0.7,
      [TILE_TYPES.GRASS]: 0.7,
      [TILE_TYPES.FOREST]: 0.7,
      [TILE_TYPES.MOUNTAIN]: 1.0,
      [TILE_TYPES.SNOW]: 1.0, // MUST be 1.0 since it is the last tile type
    },
    octaves: 4,
  },
  {
    name: "Desert",
    generation: {
      [TILE_TYPES.DEEP_WATER]: 0.2,
      [TILE_TYPES.SHALLOW_WATER]: 0.4,
      [TILE_TYPES.BEACH]: 1.0,
      [TILE_TYPES.SOIL]: 1.0,
      [TILE_TYPES.GRASS]: 1.0,
      [TILE_TYPES.FOREST]: 1.0,
      [TILE_TYPES.MOUNTAIN]: 1.0,
      [TILE_TYPES.SNOW]: 1.0, // MUST be 1.0 since it is the last tile type
    },
    octaves: 2,
  },
  {
    name: "The Plains",
    generation: {
      [TILE_TYPES.DEEP_WATER]: 0.0,
      [TILE_TYPES.SHALLOW_WATER]: 0.2,
      [TILE_TYPES.BEACH]: 0.25,
      [TILE_TYPES.SOIL]: 0.3,
      [TILE_TYPES.GRASS]: 0.85,
      [TILE_TYPES.FOREST]: 1.0,
      [TILE_TYPES.MOUNTAIN]: 1.0,
      [TILE_TYPES.SNOW]: 1.0, // MUST be 1.0 since it is the last tile type
    },
    octaves: 2,
  },
];
