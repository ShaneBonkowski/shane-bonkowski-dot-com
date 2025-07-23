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
  [tileTypes.DEEP_WATER]: 0x386d9b,
  [tileTypes.SHALLOW_WATER]: 0x5ec1c7,
  [tileTypes.BEACH]: 0xf1d3a8,
  [tileTypes.SOIL]: 0xa87656,
  [tileTypes.GRASS]: 0x6fb560,
  [tileTypes.FOREST]: 0x44702d,
  [tileTypes.MOUNTAIN]: 0x394a50,
  [tileTypes.SNOW]: 0xf1f6f0,
};

export const tileGridWidthPhone = 120;
export const tileGridHeightPhone = 240;
export const tileGridWidthComputer = 400;
export const tileGridHeightComputer = 200;

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
