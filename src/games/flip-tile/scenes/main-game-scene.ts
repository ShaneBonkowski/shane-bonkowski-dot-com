import { Generic2DGameScene } from "@/src/utils/game-scene-2d";
import {
  dispatchCloseLoadingScreenEvent,
  dispatchGameStartedEvent,
} from "@/src/events/game-events";
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
import { gameDataStore, GameData } from "@/src/games/flip-tile/game-data-store";

export let tiles: Tile[][] = [];

const unseededRandom = new SeededRandom();

export class MainGameScene extends Generic2DGameScene {
  public canClickTile: boolean = true;
  public disableClickID: number = 0;
  public revealedAtLeastOnceThisLevel: boolean = false;
  private solvedTimeoutID: NodeJS.Timeout | null = null;
  public uiMenuOpen: boolean = false;

  public score: number = 0;
  public solutionRevealed: boolean = false;

  // eslint-disable-next-line no-restricted-syntax
  constructor() {
    // Call the parent Generic2DGameScene's constructor with
    // this scene name supplied as the name of the scene.
    super("MainGameScene");

    // Return early during SSR/static generation (need to call super first)
    if (typeof window === "undefined") return;

    // Constructor logic for this scene
    this.canClickTile = true;
    this.disableClickID = 0;
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

    this.setupSyncedGameData();

    // Spawn in tiles in a grid
    this.newTilePattern();

    this.gameStarted = true;
    dispatchCloseLoadingScreenEvent("flip tile");
    dispatchGameStartedEvent("flip tile");
  }

  setupSyncedGameData() {
    // Get snapshot of the game data, then load them in and subscribe to changes.
    const gameData = gameDataStore.getSnapshot();

    this.setGameDataFromStore(gameData);

    gameDataStore.subscribe(() => {
      const newGameData = gameDataStore.getSnapshot();
      this.handleGameDataChange(newGameData);
    });
  }

  handleGameDataChange = (gameData: GameData) => {
    this.setGameDataFromStore(gameData);
  };

  setGameDataFromStore(gameData: GameData) {
    this.score = gameData.score;
    this.solutionRevealed = gameData.solutionRevealed;
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
    // If the solution is revealed, we need to reset it to false
    if (this.solutionRevealed) {
      gameDataStore.setSolutionRevealed(false);
    }
  }

  handleResetTilePattern = () => {
    // Call a new tile pattern with the same seed in tile-utils
    // so that it resets back to the same tile pattern

    // Make sure no tiles exist to start
    this.destroyAllTiles();

    // Do not change these parameters!! hence why they equals themselves
    tilePatternAttrs.tileCount = tilePatternAttrs.tileCount;
    tilePatternAttrs.seed = tilePatternAttrs.seed;
    tiles = instantiateTiles(this);
    console.log("reset");

    this.resetRevealSolutionToggle();
  };

  handleNewTilePattern = () => {
    this.newTilePattern();
  };

  newTilePattern() {
    // Make sure no tiles exist to start
    this.destroyAllTiles();
    this.updateSeed();
    tiles = instantiateTiles(this);

    // Reset solution revealed info for this level
    this.resetRevealSolutionToggle();
    this.revealedAtLeastOnceThisLevel = false;
  }

  handleDifficultyChange = (event: Event) => {
    const customEvent = event as CustomEvent<{ difficulty: string }>;
    if (customEvent.detail.difficulty === "easy") {
      tilePatternAttrs.difficultyLevel = difficulty.EASY;
      tilePatternAttrs.qtyStatesBeingUsed = 2;
      tilePatternAttrs.tileCount = 4;
    } else if (customEvent.detail.difficulty === "hard") {
      tilePatternAttrs.difficultyLevel = difficulty.HARD;
      tilePatternAttrs.qtyStatesBeingUsed = 2;
      tilePatternAttrs.tileCount = 9;
    } else if (customEvent.detail.difficulty === "expert") {
      tilePatternAttrs.difficultyLevel = difficulty.EXPERT;
      tilePatternAttrs.qtyStatesBeingUsed = 3;
      tilePatternAttrs.tileCount = 9;
    } else {
      // Fall back to easy mode if not determined
      console.error(
        `Invalid difficulty level provided of ${customEvent.detail.difficulty}. Defaulting to easy mode.`
      );
      tilePatternAttrs.difficultyLevel = difficulty.EASY;
      tilePatternAttrs.qtyStatesBeingUsed = 2;
      tilePatternAttrs.tileCount = 4;
    }

    // Then show a new tile pattern!
    this.newTilePattern();
  };

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
      if (!this.solutionRevealed && !this.revealedAtLeastOnceThisLevel) {
        let desiredScore = this.score;
        if (tilePatternAttrs.difficultyLevel == difficulty.EASY) {
          desiredScore += scoring.EASY;
        } else if (tilePatternAttrs.difficultyLevel == difficulty.HARD) {
          desiredScore += scoring.HARD;
        } else if (tilePatternAttrs.difficultyLevel == difficulty.EXPERT) {
          desiredScore += scoring.EXPERT;
        } else {
          console.log("ERROR: difficulty not listed");
        }

        // Update the game data store with the new score
        gameDataStore.setScore(desiredScore);
        document.dispatchEvent(new CustomEvent("scoreChange"));
      }

      // After x seconds, reveal the next puzzle
      this.solvedTimeoutID = setTimeout(() => {
        this.newTilePattern();
        this.solvedTimeoutID = null; // Reset the timeout ID after execution
      }, sharedTileAttrs.solvedTimer * 1.1 * 1000); // slightly longer than tile celebration anim
    }
  }

  handleToggleSolution = (event: Event) => {
    const customEvent = event as CustomEvent<{ state: string }>;
    if (customEvent.detail.state === "on") {
      gameDataStore.setSolutionRevealed(true);
      this.revealedAtLeastOnceThisLevel = true;

      // Show the solution for all tiles
      for (let row = 0; row < tiles.length; row++) {
        for (let col = 0; col < tiles[row].length; col++) {
          const tile = tiles[row][col];

          if (tile) {
            tile.showText();
          }
        }
      }
    } else {
      gameDataStore.setSolutionRevealed(false);

      // Hide the solution for all tiles
      for (let row = 0; row < tiles.length; row++) {
        for (let col = 0; col < tiles[row].length; col++) {
          const tile = tiles[row][col];

          if (tile) {
            tile.hideText();
          }
        }
      }
    }
  };

  /*
   * Note that this function is called in the create() method for GameScene2D,
   * so no need to call it! That is handled automatically.
   */
  subscribeToEvents() {
    super.subscribeToEvents();

    // Subscribe to events for this scene
    document.addEventListener("newTilePattern", this.handleNewTilePattern);
    document.addEventListener("resetTilePattern", this.handleResetTilePattern);
    document.addEventListener("difficultyChange", this.handleDifficultyChange);
    document.addEventListener("toggleSolution", this.handleToggleSolution);
    document.addEventListener("uiMenuOpen", this.handleUiMenuOpen);
    document.addEventListener("uiMenuClose", this.handleUiMenuClose);
  }

  /*
   * Note that this function is called in the shutdown() method for GameScene2D,
   * so no need to call it! That is handled automatically.
   */
  unsubscribeFromEvents() {
    super.unsubscribeFromEvents();

    // Unsubscribe from events for this scene
    document.removeEventListener("newTilePattern", this.handleNewTilePattern);
    document.removeEventListener(
      "resetTilePattern",
      this.handleResetTilePattern
    );
    document.removeEventListener(
      "difficultyChange",
      this.handleDifficultyChange
    );
    document.removeEventListener("toggleSolution", this.handleToggleSolution);
    document.removeEventListener("uiMenuOpen", this.handleUiMenuOpen);
    document.removeEventListener("uiMenuClose", this.handleUiMenuClose);
  }

  handleUiMenuOpen = () => {
    this.uiMenuOpen = true;
  };

  handleUiMenuClose = () => {
    this.uiMenuOpen = false;
  };

  // Override the parent class's handleWindowResizeHook to add custom logic.
  // This will get called automatically by the parent class's handleWindowResize()
  // method.
  handleWindowResizeHook() {
    // Handle resizing of game objs
    if (
      !this.lastKnownWindowSize ||
      this.lastKnownWindowSize.x == null ||
      this.lastKnownWindowSize.y == null
    ) {
      console.warn(
        "lastKnownWindowSize is not properly initialized. Skipping resize handling."
      );
      return;
    } else {
      // If the window size has not changed, do nothing
      if (
        this.lastKnownWindowSize.x === this.screenInfo.width &&
        this.lastKnownWindowSize.y === this.screenInfo.height
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
  }

  /*
   * Note that this function is called by GameScene2D during shutdown,
   * so no need to call it! That is handled automatically.
   */
  shutdown() {
    super.shutdown();

    // reset the store
    gameDataStore.resetData();

    // Clear the solved timeout if it exists
    if (this.solvedTimeoutID) {
      clearTimeout(this.solvedTimeoutID);
      this.solvedTimeoutID = null;
    }

    // Shutdown logic for this scene
    for (let row = 0; row < tiles.length; row++) {
      for (let col = 0; col < tiles[row].length; col++) {
        const tile = tiles[row][col];

        if (tile) {
          tile.destroy();
        }
      }
    }
    tiles.length = 0; // Clear the tiles array
  }
}
