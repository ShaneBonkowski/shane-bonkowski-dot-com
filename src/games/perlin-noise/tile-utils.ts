import { Tile } from "@/src/games/perlin-noise/tile";

export const TILE_TYPES = {
  DEEP_WATER: "DEEP_WATER",
  SHALLOW_WATER: "SHALLOW_WATER",
  BEACH: "BEACH",
  SOIL: "SOIL",
  GRASS: "GRASS",
  FOREST: "FOREST",
  MOUNTAIN: "MOUNTAIN",
  SNOW: "SNOW",
} as const;

export type TileType = (typeof TILE_TYPES)[keyof typeof TILE_TYPES];

export const tileGridWidthPhone = 200;
export const tileGridHeightPhone = 400;
export const tileGridWidthComputer = 500;
export const tileGridHeightComputer = 250;

export function instantiateTiles(w: number, h: number): Tile[][] {
  let tiles: Tile[][] = [];

  if (w > 0 && h > 0) {
    tiles = createTilegrid(w, h);
  } else {
    console.log(`Not spawning in tiles, tile grid width and/or height is <= 0`);
  }

  return tiles;
}

function createTilegrid(w: number, h: number): Tile[][] {
  const tiles: Tile[][] = [];

  for (let i = 0; i < w; i++) {
    tiles[i] = []; // Initialize an array for the current row
    for (let j = 0; j < h; j++) {
      const tile = new Tile(i, j);
      tiles[i][j] = tile;
    }
  }

  return tiles;
}
