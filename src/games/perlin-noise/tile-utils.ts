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

export const QUALITY_LEVELS = {
  LOW: "LOW",
  MEDIUM: "MEDIUM",
  HIGH: "HIGH",
} as const;

export type QualityLevel = (typeof QUALITY_LEVELS)[keyof typeof QUALITY_LEVELS];

export const tileGridWidthPhone = {
  [QUALITY_LEVELS.LOW]: 100,
  [QUALITY_LEVELS.MEDIUM]: 150,
  [QUALITY_LEVELS.HIGH]: 300,
};

export const tileGridHeightPhone = {
  [QUALITY_LEVELS.LOW]: 200,
  [QUALITY_LEVELS.MEDIUM]: 300,
  [QUALITY_LEVELS.HIGH]: 600,
};

export const tileGridWidthComputer = {
  [QUALITY_LEVELS.LOW]: 200,
  [QUALITY_LEVELS.MEDIUM]: 300,
  [QUALITY_LEVELS.HIGH]: 600,
};

export const tileGridHeightComputer = {
  [QUALITY_LEVELS.LOW]: 100,
  [QUALITY_LEVELS.MEDIUM]: 150,
  [QUALITY_LEVELS.HIGH]: 300,
};

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
