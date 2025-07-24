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
    name: "Red Moon",
    colors: {
      [TILE_TYPES.DEEP_WATER]: 0xa8141d,
      [TILE_TYPES.SHALLOW_WATER]: 0xd3181c,
      [TILE_TYPES.BEACH]: 0x7d0f1f,
      [TILE_TYPES.SOIL]: 0x520b20,
      [TILE_TYPES.GRASS]: 0x3c0921,
      [TILE_TYPES.FOREST]: 0x270721,
      [TILE_TYPES.MOUNTAIN]: 0x1d0518,
      [TILE_TYPES.SNOW]: 0xff252b,
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
