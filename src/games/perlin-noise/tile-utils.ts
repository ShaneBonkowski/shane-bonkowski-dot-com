import { Tile } from "@/src/games/perlin-noise/tile";

export enum tileTypes {
  DEEP_WATER,
  SHALLOW_WATER,
  BEACH,
  SOIL,
  GRASS,
  FOREST,
  MOUNTAIN,
  SNOW,
}

export const tileColorMap: Record<tileTypes, number> = {
  [tileTypes.DEEP_WATER]: 0x386d9b,
  [tileTypes.SHALLOW_WATER]: 0x5ec1c7,
  [tileTypes.BEACH]: 0xf1d3a8,
  [tileTypes.SOIL]: 0xa87656,
  [tileTypes.GRASS]: 0x6fb560,
  [tileTypes.FOREST]: 0x44702d,
  [tileTypes.MOUNTAIN]: 0x394a50,
  [tileTypes.SNOW]: 0xf1f6f0,
};

export const tileGridWidthPhone = 250;
export const tileGridHeightPhone = 500;
export const tileGridWidthComputer = 1000;
export const tileGridHeightComputer = 500;

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
