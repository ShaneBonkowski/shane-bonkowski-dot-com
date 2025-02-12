import { SeededRandom } from "@/src/utils/seedable-random.ts";

const unseededRandom = new SeededRandom();

export const tileStates = {
  RED: 0,
  BLUE: 1,
  GREEN: 2,
};

export const difficulty = {
  EASY: 0,
  HARD: 1,
  EXPERT: 2,
};

export const scoring = {
  EASY: 50,
  HARD: 500,
  EXPERT: 1000,
};

export const TilePatternAttrs = {
  tileCount: 9, // initial values
  seed: unseededRandom.getRandomInt(1, 10000), // UNSEEDED getRandomInt func.
  qtyStatesBeingUsed: 2, // init
  difficultyLevel: difficulty.EASY,
};

export const tileGridEventNames = {
  onTilegridChange: "onTilegridChange",
  onTilegridReset: "onTilegridReset",
  onScoreChange: "onScoreChange",
  onTileSpin: "onTileSpin",
};

export const sharedTileAttrs = {
  clickTimer: 0.5, // click tile anim timer
  solvedTimer: 0.7, // how long solution animation takes, and how long to wait before revealing next puzzle in that case
  tileSpacingFactor: 1.25, // Scale for how much space between tiles
};

// Pre-computed using \Python-Utils\mat-inv-mod.py, calling `python .\mat-inv-mod.py` from terminal
export const inverseToggleMatrixLookupMod2 = {
  TWO_BY_TWO: [
    [1, 1, 1, 0],
    [1, 1, 0, 1],
    [1, 0, 1, 1],
    [0, 1, 1, 1],
  ],
  THREE_BY_THREE: [
    [1, 0, 1, 0, 0, 1, 1, 1, 0],
    [0, 0, 0, 0, 1, 0, 1, 1, 1],
    [1, 0, 1, 1, 0, 0, 0, 1, 1],
    [0, 0, 1, 0, 1, 1, 0, 0, 1],
    [0, 1, 0, 1, 1, 1, 0, 1, 0],
    [1, 0, 0, 1, 1, 0, 1, 0, 0],
    [1, 1, 0, 0, 0, 1, 1, 0, 1],
    [1, 1, 1, 0, 1, 0, 0, 0, 0],
    [0, 1, 1, 1, 0, 0, 1, 0, 1],
  ],
};

export const inverseToggleMatrixLookupMod3 = {
  THREE_BY_THREE: [
    [2, 1, 2, 1, 1, 0, 2, 0, 0],
    [1, 1, 1, 1, 1, 1, 0, 2, 0],
    [2, 1, 2, 0, 1, 1, 0, 0, 2],
    [1, 1, 0, 1, 1, 2, 1, 1, 0],
    [1, 1, 1, 1, 0, 1, 1, 1, 1],
    [0, 1, 1, 2, 1, 1, 0, 1, 1],
    [2, 0, 0, 1, 1, 0, 2, 1, 2],
    [0, 2, 0, 1, 1, 1, 1, 1, 1],
    [0, 0, 2, 0, 1, 1, 2, 1, 2],
  ],
};
