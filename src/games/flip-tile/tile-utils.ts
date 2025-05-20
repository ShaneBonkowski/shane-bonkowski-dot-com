import { Tile } from "@/src/games/flip-tile/tile";
import { Matrix } from "@/src/utils/matrix";
import { SeededRandom } from "@/src/utils/seedable-random";

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

export const tilePatternAttrs = {
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

var seededRandom = null; // init

export function instantiateTiles(scene) {
  // Allows for async behavior
  return new Promise((resolve, reject) => {
    seededRandom = new SeededRandom(tilePatternAttrs.seed);

    let tiles = []; // 2D array

    // Spawn in tiles in a grid.. tileCount can only be a square
    if (Math.sqrt(tilePatternAttrs.tileCount) % 1 === 0) {
      // gridSize is the number of tiles per row and column in the grid (side length of the box the tiles make)
      const gridSize = Math.sqrt(tilePatternAttrs.tileCount);

      // Try to find a solvable config of tiles
      tiles = findSolvableTileGrid(gridSize, scene);

      // Resolve the Promise with the array of tiles
      resolve(tiles);
    } else {
      console.log(
        `Not spawning in tiles, tileCount of ${tilePatternAttrs.tileCount} is not an odd square as desired`
      );
      // Resolve the Promise with the array of EMPTY tiles
      resolve(tiles);
    }
  });
}

export function tilesToTilespaceMatrix(tiles) {
  let tileSpace = [];
  for (let row = 0; row < tiles.length; row++) {
    tileSpace[row] = [];
    for (let col = 0; col < tiles[row].length; col++) {
      tileSpace[row][col] = tiles[row][col].tileState;
    }
  }

  return new Matrix(tileSpace);
}

function tileSpaceMatrixToTiles(tileSpaceMatrix, gridSize, scene) {
  let tiles = []; // 2D array

  for (let i = 0; i < tileSpaceMatrix.rows; i++) {
    tiles[i] = []; // Initialize an array for the current row
    for (let j = 0; j < tileSpaceMatrix.cols; j++) {
      // Place tile and add it to list 2D
      let tileState = tileSpaceMatrix.mat[i][j];
      let tile = new Tile(scene, i, j, gridSize, tileState);
      tiles[i][j] = tile; // store in 2D array
    }
  }

  return tiles;
}

function findSolvableTileGrid(gridSize, scene) {
  // We can figure out what series of inputs are required in order to solve a given tileSpace using this function:
  // b = Ax + p
  // b: finalConfiguration
  // A: matrix
  // x: strategy
  // p: initialConfiguration

  // Thus, we can solve for strategy by doing:
  // A^-1 * (b - p) = x

  // E.g. given a tileSpace of:
  // 1 0
  // 0 1

  // We do matrix math to solve for flattenedStrategyMatrix to figure out which tiles we need to flip

  // The following should hold true:
  // toggleMatrix * flattenedStrategyMatrix + flattenedTileSpaceMatrix = flattenedsolvedMatrix
  //  1, 1, 1, 0              1                 0                          1
  //  1, 1, 0, 1  *           0             +   1                      =   1
  //  1, 0, 1, 1              0                 1                          1
  //  0, 1, 1, 1              1                 0                          1

  // So our goal is to solve for flattenedStrategyMatrix.
  let solveableTileConfigFound = false;
  let tileSpaceMatrix = null;
  let strategyMatrix = null;
  while (!solveableTileConfigFound) {
    tileSpaceMatrix = createRandomTileSpaceMatrix(gridSize);
    strategyMatrix = solveTileSpaceMatrix(tileSpaceMatrix, gridSize);

    solveableTileConfigFound = isTileConfigSolvableAndInterestingEnough(
      tileSpaceMatrix,
      strategyMatrix
    );
  }

  // Create tiles
  let tiles = tileSpaceMatrixToTiles(tileSpaceMatrix, gridSize, scene);

  // Update the text of the tiles with the strategyMatrix
  updateAllTilesText(tiles, gridSize, strategyMatrix);

  return tiles;
}

export function updateAllTilesText(tiles, gridSize, strategyMatrix = null) {
  // Solve for strategyMatrix if not provided
  if (strategyMatrix == null) {
    strategyMatrix = solveTileSpaceMatrix(
      tilesToTilespaceMatrix(tiles),
      gridSize
    );
  }

  // update text
  for (let row = 0; row < tiles.length; row++) {
    for (let col = 0; col < tiles[row].length; col++) {
      let tile = tiles[row][col];

      // Make sure tile exists first
      if (tile) {
        tile.updateTextContent(strategyMatrix.mat[row][col]);
      }
    }
  }
}

function solveTileSpaceMatrix(tileSpaceMatrix, gridSize) {
  // Convert tileSpaceMatrix to desired format
  //tileSpaceMatrix.printHowItAppearsInFlipTile();
  let flattenedTileSpaceMatrix = tileSpaceMatrix.flatten();

  // Find solved and inverted toggle matrix for this size
  let flattenedsolvedMatrix = createSolvedMatrix(gridSize).flatten();
  let toggleMatrix = createToggleMatrix(
    gridSize,
    tilePatternAttrs.qtyStatesBeingUsed
  );
  //toggleMatrix.printHowItAppearsInFlipTile();
  //toggleMatrix.printInArrayFormat();

  let matModInverseToggleMatrix = new Matrix([[]]); // toggleMatrix.modInverse(2); // 2 possible choices for tiles, 0 or 1
  if (tilePatternAttrs.qtyStatesBeingUsed == 2) {
    if (gridSize == 2) {
      matModInverseToggleMatrix = new Matrix(
        inverseToggleMatrixLookupMod2.TWO_BY_TWO
      );
    } else if (gridSize == 3) {
      matModInverseToggleMatrix = new Matrix(
        inverseToggleMatrixLookupMod2.THREE_BY_THREE
      );
    } else {
      console.error(
        `No inverseToggleMatrixLookupMod2 exists for gridSize of ${gridSize}`
      );
    }
  } else {
    if (gridSize == 3) {
      matModInverseToggleMatrix = new Matrix(
        inverseToggleMatrixLookupMod3.THREE_BY_THREE
      );
    } else {
      console.error(
        `No inverseToggleMatrixLookupMod2 exists for gridSize of ${gridSize}`
      );
    }
  }

  // Compute the strategyMatrix
  let finalMinusInitial = flattenedsolvedMatrix.matModSubtract(
    flattenedTileSpaceMatrix,
    tilePatternAttrs.qtyStatesBeingUsed
  );
  let flattenedStrategyMatrix = matModInverseToggleMatrix.modMultiply(
    finalMinusInitial,
    tilePatternAttrs.qtyStatesBeingUsed
  );
  let strategyMatrix = flattenedStrategyMatrix.unflatten(gridSize);
  //strategyMatrix.printHowItAppearsInFlipTile();

  return strategyMatrix;
}

function isTileConfigSolvableAndInterestingEnough(
  tileSpaceMatrix,
  strategyMatrix
) {
  let interestingEnough = true;

  // Make sure it is not already solved
  let solved = checkIfTileGridSolved(tileSpaceMatrix);

  if (solved) {
    interestingEnough = false;
    console.log("Not Interesting Enough Puzle Found, trying again");
  }

  return interestingEnough;
}

export function checkIfTileGridSolved(tileSpaceMatrix) {
  let solved = true;
  let endSearch = false;
  let firstVal = 0;
  for (let i = 0; i < tileSpaceMatrix.rows; i++) {
    for (let j = 0; j < tileSpaceMatrix.cols; j++) {
      // store the first value
      if (i == 0 && j == 0) {
        firstVal = tileSpaceMatrix.mat[i][j];
      }

      // Need to all be equal to be solved
      if (firstVal != tileSpaceMatrix.mat[i][j]) {
        solved = false;
        endSearch = true;
        break;
      }
    }

    if (endSearch) {
      break;
    }
  }

  return solved;
}

function createRandomTileSpaceMatrix(gridSize) {
  let tileSpace = []; // 2D array
  for (let row = 0; row < gridSize; row++) {
    tileSpace[row] = [];
    for (let col = 0; col < gridSize; col++) {
      let randVal = seededRandom.getRandomFloat(0, 1);
      let tileState = tileStates.BLUE;

      if (tilePatternAttrs.qtyStatesBeingUsed == 2) {
        if (randVal <= 0.5) {
          tileState = tileStates.RED;
        } else {
          tileState = tileStates.BLUE;
        }
      } else {
        if (randVal <= 0.33) {
          tileState = tileStates.RED;
        } else if (randVal <= 0.66) {
          tileState = tileStates.BLUE;
        } else {
          tileState = tileStates.GREEN;
        }
      }

      tileSpace[row][col] = tileState;
    }
  }

  return new Matrix(tileSpace);
}

function createSolvedMatrix(gridSize) {
  // all 1's is a solved matrix (could be all 0's too, just picking 1 for simplicity)
  let solvedMatrix = [];

  for (let row = 0; row < gridSize; row++) {
    solvedMatrix[row] = [];
    for (let col = 0; col < gridSize; col++) {
      solvedMatrix[row][col] = 1;
    }
  }

  return new Matrix(solvedMatrix);
}

function createToggleMatrix(gridSize, modulo) {
  // Start off tile array as all zeros
  let tileArray2D = [];

  for (let row = 0; row < gridSize; row++) {
    tileArray2D[row] = [];
    for (let col = 0; col < gridSize; col++) {
      tileArray2D[row][col] = 0;
    }
  }

  // Simulate all possible outcomes of toggling each portion of the array.
  // E.g. if we touch top left of the array (the first possible tile),
  // what is the resulting state? Flatten this and make that the first row of the ToggleMatrix
  // Then do the second tile, and third and so on
  // This matrix defines how changes to a tile affect another tile.
  let toggleMatrixArray = [];

  for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
      // Copy the initial tile array
      let currentTileArray = JSON.parse(JSON.stringify(tileArray2D));

      // Toggle the current tile
      currentTileArray[row][col] = (currentTileArray[row][col] + 1) % modulo;

      // Toggle all neighboring tiles
      // Toggle top neighbor
      if (row - 1 >= 0) {
        currentTileArray[row - 1][col] =
          (currentTileArray[row - 1][col] + 1) % modulo;
      }
      // Toggle down neighbor
      if (row + 1 < gridSize) {
        currentTileArray[row + 1][col] =
          (currentTileArray[row + 1][col] + 1) % modulo;
      }
      // Toggle left neighbor
      if (col - 1 >= 0) {
        currentTileArray[row][col - 1] =
          (currentTileArray[row][col - 1] + 1) % modulo;
      }
      // Toggle right neighbor
      if (col + 1 < gridSize) {
        currentTileArray[row][col + 1] =
          (currentTileArray[row][col + 1] + 1) % modulo;
      }

      // Flatten the current tile array
      let flattenedArray = currentTileArray.flat();

      // Add the flattened array to the toggle matrix array
      toggleMatrixArray.push(flattenedArray);
    }
  }

  return new Matrix(toggleMatrixArray);
}
