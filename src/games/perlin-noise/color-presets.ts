import { TILE_TYPES, TileType } from "@/src/games/perlin-noise/tile-utils";

export type ColorMap = Record<TileType, number>;

export interface ColorPreset {
  name: string;
  colors: ColorMap;
}

export const DEFAULT_COLOR_PRESETS: ColorPreset[] = [
  {
    name: "Classic",
    colors: {
      [TILE_TYPES.DEEP_WATER]: 0x386d9b,
      [TILE_TYPES.SHALLOW_WATER]: 0x5ec1c7,
      [TILE_TYPES.BEACH]: 0xf1d3a8,
      [TILE_TYPES.SOIL]: 0xa87656,
      [TILE_TYPES.GRASS]: 0x6fb560,
      [TILE_TYPES.FOREST]: 0x44702d,
      [TILE_TYPES.MOUNTAIN]: 0x394a50,
      [TILE_TYPES.SNOW]: 0xf1f6f0,
    },
  },
  {
    name: "Murky Green",
    colors: {
      [TILE_TYPES.DEEP_WATER]: 0x6e934f,
      [TILE_TYPES.SHALLOW_WATER]: 0xa2b669,
      [TILE_TYPES.BEACH]: 0xbbc13c,
      [TILE_TYPES.SOIL]: 0x7f7a28,
      [TILE_TYPES.GRASS]: 0x949e2c,
      [TILE_TYPES.FOREST]: 0x304f10,
      [TILE_TYPES.MOUNTAIN]: 0x1d3500,
      [TILE_TYPES.SNOW]: 0xd3da83,
    },
  },
  {
    name: "Ectoplasm",
    colors: {
      [TILE_TYPES.DEEP_WATER]: 0x56bf70,
      [TILE_TYPES.SHALLOW_WATER]: 0x8cff96,
      [TILE_TYPES.BEACH]: 0xacaab2,
      [TILE_TYPES.SOIL]: 0x8f7fb0,
      [TILE_TYPES.GRASS]: 0x745380,
      [TILE_TYPES.FOREST]: 0x3b3366,
      [TILE_TYPES.MOUNTAIN]: 0x1a181a,
      [TILE_TYPES.SNOW]: 0xfff3f2,
    },
  },
  {
    name: "Extra Saturated",
    colors: {
      [TILE_TYPES.DEEP_WATER]: 0x3859b3,
      [TILE_TYPES.SHALLOW_WATER]: 0x36c5f4,
      [TILE_TYPES.BEACH]: 0xdab163,
      [TILE_TYPES.SOIL]: 0xa26d3f,
      [TILE_TYPES.GRASS]: 0x5ab552,
      [TILE_TYPES.FOREST]: 0x26854c,
      [TILE_TYPES.MOUNTAIN]: 0x4d3533,
      [TILE_TYPES.SNOW]: 0xffffff,
    },
  },
  {
    name: "Golden Brown",
    colors: {
      [TILE_TYPES.DEEP_WATER]: 0xac6b26,
      [TILE_TYPES.SHALLOW_WATER]: 0xf6cd26,
      [TILE_TYPES.BEACH]: 0xbb7f57,
      [TILE_TYPES.SOIL]: 0x563226,
      [TILE_TYPES.GRASS]: 0x331c17,
      [TILE_TYPES.FOREST]: 0x393939,
      [TILE_TYPES.MOUNTAIN]: 0x202020,
      [TILE_TYPES.SNOW]: 0x725956,
    },
  },
];
