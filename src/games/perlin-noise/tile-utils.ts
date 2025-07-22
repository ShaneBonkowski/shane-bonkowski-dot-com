import { Tile } from "@/src/games/perlin-noise/tile";
import { MainGameScene } from "@/src/games/perlin-noise/scenes/main-game-scene";
import { Vec2 } from "@/src/utils/vector";

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
  [tileTypes.DEEP_WATER]: 0x0000ff,
  [tileTypes.SHALLOW_WATER]: 0x00ffff,
  [tileTypes.BEACH]: 0xd2b48c,
  [tileTypes.SOIL]: 0x8b4513,
  [tileTypes.GRASS]: 0x00ff00,
  [tileTypes.FOREST]: 0x228b22,
  [tileTypes.MOUNTAIN]: 0x808080,
  [tileTypes.SNOW]: 0xffffff,
};

export const tileGridWidthPhone = 40;
export const tileGridHeightPhone = 80;
export const tileGridWidthComputer = 100;
export const tileGridHeightComputer = 50;

export const tileGridSize: Vec2 = new Vec2(
  tileGridWidthComputer,
  tileGridHeightComputer
);

export function instantiateTiles(scene: MainGameScene): Tile[][] {
  let tiles: Tile[][] = [];

  if (tileGridSize.x > 0 && tileGridSize.y > 0) {
    tiles = createTilegrid(scene);
  } else {
    console.log(`Not spawning in tiles, tile grid width and/or height is <= 0`);
  }

  return tiles;
}

function createTilegrid(scene: MainGameScene): Tile[][] {
  const tiles: Tile[][] = [];

  for (let i = 0; i < tileGridSize.x; i++) {
    tiles[i] = []; // Initialize an array for the current row
    for (let j = 0; j < tileGridSize.y; j++) {
      const tile = new Tile(scene, i, j);
      tiles[i][j] = tile;
    }
  }

  return tiles;
}
