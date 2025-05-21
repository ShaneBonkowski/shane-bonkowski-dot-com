import { Generic2DGameScene } from "@/src/utils/game-scene-2d";
import { Vec2 } from "@/src/utils/vector";
import { dispatchGameStartedEvent } from "@/src/events/game-events";
import { Tile } from "@/src/games/flip-tile/tile";
import { SeededRandom } from "@/src/utils/seedable-random";
import {
  difficulty,
  scoring,
  tilePatternAttrs,
  instantiateTiles,
  checkIfTileGridSolved,
  tilesToTilespaceMatrix,
  sharedTileAttrs,
} from "@/src/games/flip-tile/tile-utils";

export const tiles: Tile[][] = [];

const unseededRandom = new SeededRandom();

export class MainGameScene extends Generic2DGameScene {
  private resizeObserver: ResizeObserver | null = null;
  public lastKnownWindowSize: Vec2 | null = null;
  public canClickTile: boolean;
  public disableClickID: number;
  public score: number;
  public revealedAtLeastOnceThisLevel: boolean;

  constructor() {
    // Call the parent Generic2DGameScene's constructor with
    // this scene name supplied as the name of the scene.
    super("MainGameScene");

    // Constructor logic for this scene
    this.canClickTile = true;
    this.disableClickID = 0;
    this.score = 0;
    this.revealedAtLeastOnceThisLevel = false;
  }

  preload() {
    super.preload();

    // Preload logic for this scene
    this.load.image("Tile Blue", "/webps/games/flip-tile-blue.webp");
    this.load.image("Tile Red", "/webps/games/flip-tile-red.webp");
    this.load.image("Tile Green", "/webps/games/flip-tile-green.webp");
  }

  create() {
    super.create();

    const screenWidth = window.visualViewport?.width || window.innerWidth;
    const screenHeight = window.visualViewport?.height || window.innerHeight;
    this.lastKnownWindowSize = new Vec2(screenWidth, screenHeight);

    // Spawn in tiles in a grid
    this.newTilePattern();

    this.gameStarted = true;
    dispatchGameStartedEvent("flip tile");
  }

  update(time: number, delta: number) {
    super.update(time, delta);

    if (this.gameStarted) {
      // Handle the graphic updates
      for (let row = 0; row < tiles.length; row++) {
        for (let col = 0; col < tiles[row].length; col++) {
          const tile = tiles[row][col];
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

  tryToEnableClick(): boolean {
    // Can only re-enable click if all tile's animations are done playing
    let canEnable = true;
    let finishedSearch = false;

    // Play celebration anim for all tiles
    for (let row = 0; row < tiles.length; row++) {
      for (let col = 0; col < tiles[row].length; col++) {
        const tile = tiles[row][col];

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
    const toggleInput = document.querySelector(
      ".flip-tile-sol-toggle-input"
    ) as HTMLInputElement;

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
    tilePatternAttrs.tileCount = tilePatternAttrs.tileCount;
    tilePatternAttrs.seed = tilePatternAttrs.seed;
    instantiateTiles(this).then((tilesReturned) => {
      // Push new tiles into tiles array.
      // We destroy tiles before this, so its safe
      // to assume tiles is empty []
      tilesReturned.forEach((tile) => tiles.push(tile));
    });
    console.log("reset");

    this.resetRevealSolutionToggle();
  }

  newTilePattern() {
    // Make sure no tiles exist to start
    this.destroyAllTiles();

    // Update to a new tile pattern in a grid as a Promise (so that we can run this async)
    for (let i = 1; i <= 3; i++) {
      const className = `.flip-tile-toggle-input-${i}`;
      const checkbox = document.querySelector(className) as HTMLInputElement;

      if (checkbox) {
        if (checkbox.checked) {
          if (i == 1) {
            this.updateDifficuly(difficulty.EASY);
          } else if (i == 2) {
            this.updateDifficuly(difficulty.HARD);
          } else if (i == 3) {
            this.updateDifficuly(difficulty.EXPERT);
          } else {
            this.updateDifficuly(tilePatternAttrs.difficultyLevel);
          }
        }
      }
    }

    this.updateSeed();

    instantiateTiles(this).then((tilesReturned) => {
      // Push new tiles into tiles array.
      // We destroy tiles before this, so its safe
      // to assume tiles is empty []
      tilesReturned.forEach((tile) => tiles.push(tile));
    });

    // Reset solution revealed info for this level
    this.resetRevealSolutionToggle();
    this.revealedAtLeastOnceThisLevel = false;
  }

  updateDifficuly(difficultyLevel = difficulty.HARD) {
    tilePatternAttrs.difficultyLevel = difficultyLevel;

    // Assign qty states etc based on difficulty
    if (difficultyLevel == difficulty.EASY) {
      tilePatternAttrs.qtyStatesBeingUsed = 2;
      tilePatternAttrs.tileCount = 4;
    } else if (difficultyLevel == difficulty.HARD) {
      tilePatternAttrs.qtyStatesBeingUsed = 2;
      tilePatternAttrs.tileCount = 9;
    } else {
      tilePatternAttrs.qtyStatesBeingUsed = 3;
      tilePatternAttrs.tileCount = 9;
    }
  }

  updateSeed(seedProvided = unseededRandom.getRandomInt(1, 100000)) {
    tilePatternAttrs.seed = seedProvided;
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
    const solved = checkIfTileGridSolved(tilesToTilespaceMatrix(tiles));

    if (solved) {
      // Play celebration anim for all tiles
      for (let row = 0; row < tiles.length; row++) {
        for (let col = 0; col < tiles[row].length; col++) {
          const tile = tiles[row][col];

          if (tile) {
            tile.celebrateTileAnim();
          }
        }
      }

      // Update score..
      // Only give score if solution is not revealed
      const toggleInput = document.querySelector(
        ".flip-tile-sol-toggle-input"
      ) as HTMLInputElement;

      if (
        toggleInput &&
        !toggleInput.checked &&
        !this.revealedAtLeastOnceThisLevel
      ) {
        if (tilePatternAttrs.difficultyLevel == difficulty.EASY) {
          this.score += scoring.EASY;
        } else if (tilePatternAttrs.difficultyLevel == difficulty.HARD) {
          this.score += scoring.HARD;
        } else if (tilePatternAttrs.difficultyLevel == difficulty.EXPERT) {
          this.score += scoring.EXPERT;
        } else {
          console.log("ERROR: difficulty not listed");
        }

        document.dispatchEvent(
          new CustomEvent("scoreChange", { detail: { score: this.score } })
        );
      }

      // After x seconds, reveal the next puzzle
      setTimeout(() => {
        this.newTilePattern();
      }, sharedTileAttrs.solvedTimer * 1.1 * 1000); // slightly longer than tile celebration anim
    }
  }

  /*
   * Note that this function is called in the create() method for GameScene2D,
   * so no need to call it! That is handled automatically.
   */
  subscribeToEvents() {
    super.subscribeToEvents();

    // Subscribe to events for this scene
    this.setUpWindowResizeHandling();

    document.addEventListener("tilegridChange", this.newTilePattern);
    document.addEventListener("tilegridReset", this.resetCurrentTilePattern);
  }

  /*
   * Note that this function is called in the shutdown() method for GameScene2D,
   * so no need to call it! That is handled automatically.
   */
  unsubscribeFromEvents() {
    super.unsubscribeFromEvents();

    // Unsubscribe from events for this scene
    this.tearDownWindowResizeHandling();

    document.removeEventListener("tilegridChange", this.newTilePattern);
    document.removeEventListener("tilegridReset", this.resetCurrentTilePattern);
  }

  setUpWindowResizeHandling() {
    // Observe window resizing so we can adjust the position
    // and size accordingly!

    // Observe window resizing with ResizeObserver since it is good for snappy changes
    this.resizeObserver = new ResizeObserver(() => {
      this.handleWindowResize();
    });
    this.resizeObserver.observe(document.documentElement);

    // Also checking for resize or orientation change to try to handle edge cases
    // that ResizeObserver misses!
    window.addEventListener("resize", this.handleWindowResize);
    window.addEventListener("orientationchange", this.handleWindowResize);
  }

  tearDownWindowResizeHandling() {
    if (this.resizeObserver != null) {
      this.resizeObserver.disconnect();
      this.resizeObserver = null;
    }
    window.removeEventListener("resize", this.handleWindowResize);
    window.removeEventListener("orientationchange", this.handleWindowResize);
  }

  handleWindowResize() {
    // Ensure the scene is fully initialized before handling resize
    if (!this.isInitialized) {
      console.warn("handleWindowResize called before scene initialization.");
      return;
    }

    // Get the new screen dimensions
    const screenWidth = window.visualViewport?.width || window.innerWidth;
    const screenHeight = window.visualViewport?.height || window.innerHeight;

    // Handle resizing of game objs
    if (
      !this.lastKnownWindowSize ||
      this.lastKnownWindowSize.x == null ||
      this.lastKnownWindowSize.y == null
    ) {
      console.warn(
        "lastKnownWindowSize is not properly initialized. Skipping resize handling."
      );
    } else {
      if (
        this.lastKnownWindowSize.x === screenWidth &&
        this.lastKnownWindowSize.y === screenHeight
      ) {
        return;
      }

      // Handle tiles for window resize
      for (let row = 0; row < tiles.length; row++) {
        for (let col = 0; col < tiles[row].length; col++) {
          const tile = tiles[row][col];

          if (tile) {
            tile.handleWindowResize();
          }
        }
      }
    }

    // Update lastKnownWindowSize to current screen dimensions
    this.lastKnownWindowSize = new Vec2(screenWidth, screenHeight);
  }

  /*
   * Note that this function is called by GameScene2D during shutdown,
   * so no need to call it! That is handled automatically.
   */
  shutdown() {
    super.shutdown();

    // Shutdown logic for this scene
    for (let row = 0; row < tiles.length; row++) {
      for (let col = 0; col < tiles[row].length; col++) {
        const tile = tiles[row][col];

        if (tile) {
          tile.destroy();
        }
      }
    }
  }
}
