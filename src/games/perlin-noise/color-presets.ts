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
    name: "Desert",
    colors: {
      [TILE_TYPES.DEEP_WATER]: 0x2a4d69,
      [TILE_TYPES.SHALLOW_WATER]: 0x4b86b4,
      [TILE_TYPES.BEACH]: 0xf2c94c,
      [TILE_TYPES.SOIL]: 0xd9b48c,
      [TILE_TYPES.GRASS]: 0x8fbc8f,
      [TILE_TYPES.FOREST]: 0x556b2f,
      [TILE_TYPES.MOUNTAIN]: 0x8b4513,
      [TILE_TYPES.SNOW]: 0xffffff,
    },
  },
  {
    name: "Autumn",
    colors: {
      [TILE_TYPES.DEEP_WATER]: 0x2c3e50,
      [TILE_TYPES.SHALLOW_WATER]: 0x34495e,
      [TILE_TYPES.BEACH]: 0xe67e22,
      [TILE_TYPES.SOIL]: 0xd35400,
      [TILE_TYPES.GRASS]: 0x27ae60,
      [TILE_TYPES.FOREST]: 0x16a085,
      [TILE_TYPES.MOUNTAIN]: 0x8e44ad,
      [TILE_TYPES.SNOW]: 0xecf0f1,
    },
  },
  {
    name: "Winter",
    colors: {
      [TILE_TYPES.DEEP_WATER]: 0x1f3a3d,
      [TILE_TYPES.SHALLOW_WATER]: 0x2ecc71,
      [TILE_TYPES.BEACH]: 0xf39c12,
      [TILE_TYPES.SOIL]: 0xe67e22,
      [TILE_TYPES.GRASS]: 0x27ae60,
      [TILE_TYPES.FOREST]: 0x16a085,
      [TILE_TYPES.MOUNTAIN]: 0x8e44ad,
      [TILE_TYPES.SNOW]: 0xecf0f1,
    },
  },
  {
    name: "Night",
    colors: {
      [TILE_TYPES.DEEP_WATER]: 0x000033,
      [TILE_TYPES.SHALLOW_WATER]: 0x003366,
      [TILE_TYPES.BEACH]: 0x333333,
      [TILE_TYPES.SOIL]: 0x666666,
      [TILE_TYPES.GRASS]: 0x004d00,
      [TILE_TYPES.FOREST]: 0x003300,
      [TILE_TYPES.MOUNTAIN]: 0x333333,
      [TILE_TYPES.SNOW]: 0xffffff,
    },
  },
];
