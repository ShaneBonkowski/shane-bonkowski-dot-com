import { Tile } from "@/src/games/game-of-life/tile";
import { MainGameScene } from "@/src/games/game-of-life/scenes/main-game-scene";

export const tileStates = {
  ON: 1,
  OFF: 0,
};

export const gameOfLifeTypes = {
  CONWAY: "Conway's Game of Life",
};

export const tileGridWidthPhone = 40;
export const tileGridHeightPhone = 80;
export const tileGridWidthComputer = 100;
export const tileGridHeightComputer = 50;

export const tileAndBackgroundColors = [
  // Each sub-array contains [ON color, OFF color, background color]
  [0xffffff, 0x808080, 0x000000], // White on gray, black background
  [0x000000, 0xa9a9a9, 0xd3d3d3], // Black on dark gray, light gray background
  [0x52b788, 0x2d6a4f, 0x081c15], // Green on dark green, darker green background
  [0x70e000, 0x758e4f, 0x000000], // Bright green on light green, dark background
  [0xffffff, 0x2e8b57, 0x155d27], // White on sea green, dark green background
  [0x7161ef, 0xff69b4, 0xffc0cb], // Purple on hot pink, pink background
  [0xff00ff, 0x8b008b, 0x0a2472], // Magenta on dark magenta, navy background
  [0x00ffff, 0x008b8b, 0x0d00a4], // Cyan on dark cyan, dark blue background
];

// Random shapes following classic Conway's Game of Life rules.
// shapeTileSpace counts from top left to bottom right so that the shape
// visually on the screen looks like how it does here in the code!
export const cgolTileShapes = {
  // ------Still lifes:------
  block: {
    shapeTileSpace: [
      [1, 1],
      [1, 1],
    ],
  },
  beeHive: {
    shapeTileSpace: [
      [0, 1, 1, 0],
      [1, 0, 0, 1],
      [0, 1, 1, 0],
    ],
  },
  loaf: {
    shapeTileSpace: [
      [0, 1, 1, 0],
      [1, 0, 0, 1],
      [0, 1, 0, 1],
      [0, 0, 1, 0],
    ],
  },
  boat: {
    shapeTileSpace: [
      [1, 1, 0],
      [1, 0, 1],
      [0, 1, 0],
    ],
  },
  tub: {
    shapeTileSpace: [
      [0, 1, 0],
      [1, 0, 1],
      [0, 1, 0],
    ],
  },

  // ------Ocsillators:------
  blinker: {
    shapeTileSpace: [[1, 1, 1]],
  },
  toad: {
    shapeTileSpace: [
      [0, 1, 1, 1],
      [1, 1, 1, 0],
    ],
  },
  beacon: {
    shapeTileSpace: [
      [1, 1, 0, 0],
      [1, 1, 0, 0],
      [0, 0, 1, 1],
      [0, 0, 1, 1],
    ],
  },

  // ------Spaceships:------
  glider: {
    shapeTileSpace: [
      [0, 1, 0],
      [0, 0, 1],
      [1, 1, 1],
    ],
  },
  // Lightweight spaceship (LWSS)
  LWSS: {
    shapeTileSpace: [
      [0, 1, 1, 1, 1],
      [1, 0, 0, 0, 1],
      [0, 0, 0, 0, 1],
      [1, 0, 0, 1, 0],
    ],
  },

  // ------Something Serious:------
  acorn: {
    shapeTileSpace: [
      [0, 1, 0, 0, 0, 0, 0],
      [0, 0, 0, 1, 0, 0, 0],
      [1, 1, 0, 0, 1, 1, 1],
    ],
  },
};

export function instantiateTiles(
  scene: MainGameScene,
  w: number,
  h: number
): Tile[][] {
  let tiles: Tile[][] = [];

  if (w > 0 && h > 0) {
    tiles = createTilegrid(scene, w, h);
  } else {
    console.log(`Not spawning in tiles, tile grid width and/or height is <= 0`);
  }

  return tiles;
}

function createTilegrid(scene: MainGameScene, w: number, h: number): Tile[][] {
  const tiles: Tile[][] = [];

  for (let i = 0; i < w; i++) {
    tiles[i] = []; // Initialize an array for the current row
    for (let j = 0; j < h; j++) {
      const tile = new Tile(scene, i, j);
      tiles[i][j] = tile;
    }
  }

  return tiles;
}

export class gameOfLifeShape {
  public name: keyof typeof cgolTileShapes = "block";
  public shapeTileSpace: number[][] = [];

  // eslint-disable-next-line no-restricted-syntax
  constructor(shapeName: keyof typeof cgolTileShapes) {
    // Return early during SSR/static generation
    if (typeof window === "undefined") return;

    this.name = shapeName;
    this.shapeTileSpace = cgolTileShapes[shapeName].shapeTileSpace;
  }

  getWidth(): number {
    // Because of the way the shapes are drawn, it is the length of
    // the second layer of the array that is the width.
    // See cgolTileShapes for details.
    return this.shapeTileSpace[0].length;
  }

  getHeight(): number {
    // Because of the way the shapes are drawn, it is the length of
    // the first layer of the array that is the height.
    // See cgolTileShapes for details.
    return this.shapeTileSpace.length;
  }

  getStateAtCoords(shapeSpaceX: number, shapeSpaceY: number): number {
    // Because we want the shape coords to visually in the code look as they do
    // visually on the screen, x and y are flipped. So, we can handle getting
    // the state at an x or y coord here.
    return this.shapeTileSpace[shapeSpaceY][shapeSpaceX];
  }

  iterateOverTileSpace(
    callback: (arg0: gameOfLifeShape, arg1: number, arg2: number) => void
  ) {
    // Generalize how to iterate over the tilespace, to enforce that it
    // is always traversed top left to bottom right
    for (let shapeX = 0; shapeX < this.getWidth(); shapeX++) {
      // Going from top left to bottom right, so y--
      for (let shapeY = this.getHeight() - 1; shapeY >= 0; shapeY--) {
        callback(this, shapeX, shapeY);
      }
    }
  }
}

export class tilespaceSet {
  public tilespace: Set<string> = new Set();

  // eslint-disable-next-line no-restricted-syntax
  constructor() {
    // Return early during SSR/static generation
    if (typeof window === "undefined") return;

    this.tilespace = new Set();
  }

  clear() {
    this.tilespace = new Set();
  }

  serializeCoords(x: number, y: number): string {
    // Helper function to serialize coordinates for storage
    return JSON.stringify([x, y]);
  }

  deserializeCoords(coord: string): [number, number] {
    // Helper function to deserialize coordinates
    return JSON.parse(coord);
  }

  add(tile: Tile) {
    const coords = this.serializeCoords(
      tile.gridSpaceLoc.x,
      tile.gridSpaceLoc.y
    );
    this.tilespace.add(coords);
  }

  delete(tile: Tile) {
    const coords = this.serializeCoords(
      tile.gridSpaceLoc.x,
      tile.gridSpaceLoc.y
    );
    this.tilespace.delete(coords);
  }

  getTilespaceArray(): [number, number][] {
    return Array.from(this.tilespace).map(this.deserializeCoords);
  }
}

export class LivingTilespaceSet extends tilespaceSet {
  updateLivingTilespace(tile: Tile) {
    if (tile.tileState === tileStates.ON) {
      this.add(tile);
    } else if (tile.tileState === tileStates.OFF) {
      this.delete(tile);
    }
  }
}
