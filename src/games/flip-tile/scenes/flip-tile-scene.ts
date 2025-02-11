import {
  instantiateTiles,
  TilePatternAttrs,
  sharedTileAttrs,
  difficulty,
  checkIfTileGridSolved,
  tilesToTilespaceMatrix,
  tileGridEventNames,
  scoring,
} from "@/src/games/flip-tile/tile-utils.js";
import { SeededRandom } from "@/src/utils/seedable-random.ts";
import { uiVars } from "./init-ui.js";
import { Generic2DGameScene } from "@/src/utils/game-scene-2d.ts";
import { genericGameEventNames } from "@/src/utils/game-scene-2d.ts";

const unseededRandom = new SeededRandom();

export const intendedNewTileAttrs = {
  tileCount: 9, // initial values
  seed: unseededRandom.getRandomInt(1, 10000), // UNSEEDED getRandomInt func
  qtyStatesBeingUsed: 2, // init
  difficultyLevel: difficulty.EASY,
};

export const tiles = [];

// Export so other scripts can access this
export class MainGameScene extends Generic2DGameScene {
  public canClickTile: boolean;
  public disableClickID: number;
  public score: number;
  public revealedAtLeastOnceThisLevel: boolean;

  constructor() {
    super("MainGameScene");
    this.canClickTile = true; // can the player click a tile?
    this.disableClickID = 0;
    this.score = 0;
    this.revealedAtLeastOnceThisLevel = false;
  }

  preload() {
    // Preload assets if needed
    this.load.image("Tile Blue", "./webps/Flip-Tile-Blue.webp");
    this.load.image("Tile Red", "./webps/Flip-Tile-Red.webp");
    this.load.image("Tile Green", "./webps/Flip-Tile-Green.webp");
  }

  create() {
    this.setUpWindowResizeHandling();

    // Final setup for main game
    this.subscribeToEvents();
    this.disableScroll();

    // Spawn in tiles in a grid as a Promise (so that we can run this async), and then
    // when that promise is fufilled, we can move on to other init logic
    this.newTilePattern(true); // first time calling this
  }

  update(time: number, delta: number) {
    if (this.gameStarted) {
      // Handle the graphic updates
      for (let row = 0; row < tiles.length; row++) {
        for (let col = 0; col < tiles[row].length; col++) {
          let tile = tiles[row][col];
          tile.updateGraphic();
        }
      }
    }
  }

  // Enable / disable click
  tryToDisableClick() {
    if (this.canClickTile == true) {
      this.canClickTile = false;
    }
  }

  tryToEnableClick() {
    // Can only re-enable click if all tile's animations are done playing
    let canEnable = true;
    let finishedSearch = false;

    // Play celebration anim for all tiles
    for (let row = 0; row < tiles.length; row++) {
      for (let col = 0; col < tiles[row].length; col++) {
        let tile = tiles[row][col];

        // Make sure tile exists
        if (tile) {
          // if any tile's anim is playing, you cannot enable clicking
          if (tile.animationPlaying) {
            canEnable = false;
            finishedSearch = true;
            break;
          }
        }
      }

      if (finishedSearch) {
        break;
      }
    }

    if (canEnable) {
      this.canClickTile = true;
    }

    return canEnable;
  }

  resetRevealSolutionToggle() {
    const toggleInput = document.querySelector(".flip-tile-sol-toggle-input");

    if (toggleInput) {
      toggleInput.checked = false;
    }
  }

  resetCurrentTilePattern() {
    // Call a new tile pattern with the same seed in tile-utils
    // so that it resets back to the same tile pattern

    // Make sure no tiles exist to start
    this.destroyAllTiles();

    // Reset tile pattern in a grid as a Promise (so that we can run this async).
    // Do not change these parameters!! hence why they equals themselves
    TilePatternAttrs.tileCount = TilePatternAttrs.tileCount;
    TilePatternAttrs.seed = TilePatternAttrs.seed;
    instantiateTiles(this).then((tilesReturned) => {
      // Push new tiles into tiles array.
      // We destroy tiles before this, so its safe
      // to assume tiles is empty []
      tilesReturned.forEach((tile) => tiles.push(tile));
    });
    console.log("reset");

    this.resetRevealSolutionToggle();
  }

  newTilePattern(firstTimeCalling = false) {
    // Make sure no tiles exist to start
    this.destroyAllTiles();

    // Update to a new tile pattern in a grid as a Promise (so that we can run this async)
    for (let i = 1; i <= uiVars.numCheckboxes; i++) {
      let className = `.flip-tile-toggle-input-${i}`;
      const checkbox = document.querySelector(className);
      if (checkbox.checked) {
        if (i == 1) {
          this.updateIntendedDifficuly(difficulty.EASY);
        } else if (i == 2) {
          this.updateIntendedDifficuly(difficulty.HARD);
        } else if (i == 3) {
          this.updateIntendedDifficuly(difficulty.EXPERT);
        } else {
          this.updateIntendedDifficuly(TilePatternAttrs.difficulty);
        }
      }
    }

    this.updateIntendedSeed();
    this.updateActualTilePatternAttrs();

    instantiateTiles(this).then((tilesReturned) => {
      // Push new tiles into tiles array.
      // We destroy tiles before this, so its safe
      // to assume tiles is empty []
      tilesReturned.forEach((tile) => tiles.push(tile));
    });

    if (firstTimeCalling) {
      // After everything is loaded in, we can begin the game
      this.gameStarted = true;
    }

    // Reset solution revealed info for this level
    this.resetRevealSolutionToggle();
    this.revealedAtLeastOnceThisLevel = false;
  }

  updateIntendedDifficuly(difficultyLevel = difficulty.HARD) {
    intendedNewTileAttrs.difficultyLevel = difficultyLevel;

    // Assign qty states etc based on difficulty
    if (difficultyLevel == difficulty.EASY) {
      intendedNewTileAttrs.qtyStatesBeingUsed = 2;
      intendedNewTileAttrs.tileCount = 4;
    } else if (difficultyLevel == difficulty.HARD) {
      intendedNewTileAttrs.qtyStatesBeingUsed = 2;
      intendedNewTileAttrs.tileCount = 9;
    } else {
      intendedNewTileAttrs.qtyStatesBeingUsed = 3;
      intendedNewTileAttrs.tileCount = 9;
    }
  }

  updateIntendedSeed(seedProvided = unseededRandom.getRandomInt(1, 100000)) {
    intendedNewTileAttrs.seed = seedProvided;
  }

  updateActualTilePatternAttrs() {
    // Set actual to the intended values
    TilePatternAttrs.qtyStatesBeingUsed =
      intendedNewTileAttrs.qtyStatesBeingUsed;
    TilePatternAttrs.tileCount = intendedNewTileAttrs.tileCount;
    TilePatternAttrs.seed = intendedNewTileAttrs.seed;
    TilePatternAttrs.difficultyLevel = intendedNewTileAttrs.difficultyLevel;
  }

  destroyAllTiles() {
    // Clear the existing tiles
    for (let row = 0; row < tiles.length; row++) {
      for (let col = 0; col < tiles[row].length; col++) {
        tiles[row][col].destroy();
      }
    }
    tiles.length = 0; // Clear the tiles array
  }

  nextPuzzleIfSolved() {
    let solved = checkIfTileGridSolved(tilesToTilespaceMatrix(tiles));

    if (solved) {
      // Play celebration anim for all tiles
      for (let row = 0; row < tiles.length; row++) {
        for (let col = 0; col < tiles[row].length; col++) {
          let tile = tiles[row][col];

          // Make sure tile exists
          if (tile) {
            tile.celebrateTileAnim();
          }
        }
      }

      // Update score..
      // Only give score if solution is not revealed
      const toggleInput = document.querySelector(".flip-tile-sol-toggle-input");

      if (
        toggleInput &&
        !toggleInput.checked &&
        !this.revealedAtLeastOnceThisLevel
      ) {
        document.dispatchEvent(new Event(tileGridEventNames.onScoreChange));
        if (TilePatternAttrs.difficultyLevel == difficulty.EASY) {
          this.score += scoring.EASY;
        } else if (TilePatternAttrs.difficultyLevel == difficulty.HARD) {
          this.score += scoring.HARD;
        } else if (TilePatternAttrs.difficultyLevel == difficulty.EXPERT) {
          this.score += scoring.EXPERT;
        } else {
          console.log("ERROR: difficulty not listed");
        }
      }

      // After x seconds, reveal the next puzzle
      setTimeout(
        function () {
          this.newTilePattern();
        }.bind(this),
        sharedTileAttrs.solvedTimer * 1.1 * 1000 // slightly longer than tile celebration anim
      );
    }
  }

  subscribeToEvents() {
    // Event listener for ui menu open / closed
    document.addEventListener(
      genericGameEventNames.uiMenuOpen,
      function (event) {
        if (this.uiMenuOpen == false) {
          this.uiMenuOpen = true;
        }
      }.bind(this)
    ); // Bind 'this' to refer to the class instance
    document.addEventListener(
      genericGameEventNames.uiMenuClosed,
      function (event) {
        if (this.uiMenuOpen == true) {
          this.uiMenuOpen = false;
        }
      }.bind(this)
    ); // Bind 'this' to refer to the class instance

    // When we ask to change the tile grid, spawn a new tile pattern
    document.addEventListener(
      tileGridEventNames.onTilegridChange,
      function (event) {
        this.newTilePattern();
      }.bind(this)
    );

    // When we ask to change the tile grid, spawn a new tile pattern
    document.addEventListener(
      tileGridEventNames.onTilegridReset,
      function (event) {
        this.resetCurrentTilePattern();
      }.bind(this)
    );
  }

  setUpWindowResizeHandling() {
    // Observe window resizing with ResizeObserver since it
    // is good for snappy changes
    const resizeObserver = new ResizeObserver((entries) => {
      this.handleWindowResize();
    });
    resizeObserver.observe(document.documentElement);

    // Also checking for resize or orientation change to try
    // to handle edge cases that ResizeObserver misses!
    window.addEventListener("resize", this.handleWindowResize.bind(this));
    window.addEventListener(
      "orientationchange",
      this.handleWindowResize.bind(this)
    );
  }

  // Function to handle window resize event
  handleWindowResize() {
    // Handle tiles for window resize
    for (let row = 0; row < tiles.length; row++) {
      for (let col = 0; col < tiles[row].length; col++) {
        let tile = tiles[row][col];

        // Make sure tile exists
        if (tile) {
          tile.handleWindowResize();
        }
      }
    }
  }
}
