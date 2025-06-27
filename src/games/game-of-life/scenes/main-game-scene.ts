import { Generic2DGameScene } from "@/src/utils/game-scene-2d";
import {
  dispatchCloseLoadingScreenEvent,
  dispatchGameStartedEvent,
} from "@/src/events/game-events";
import {
  instantiateTiles,
  tileGridAttrs,
  tileGridWidthComputer,
  tileGridHeightComputer,
  tileGridWidthPhone,
  tileGridHeightPhone,
  tileAndBackgroundColors,
  tileStates,
  gameOfLifeTypes,
  cgolTileShapes,
  gameOfLifeShape,
  tilespaceSet,
  LivingTilespaceSet,
} from "@/src/games/game-of-life/tile-utils";
import { SeededRandom } from "@/src/utils/seedable-random";
import { GestureManager } from "@/src/utils/gesture-manager";
import { Tile } from "@/src/games/game-of-life/tile";
import {
  settingsStore,
  Settings,
} from "@/src/games/game-of-life/settings-store";
import {
  gameDataStore,
  GameData,
} from "@/src/games/game-of-life/game-data-store";
import { resizeCanvasToParent } from "@/src/utils/phaser-canvas";

export let tiles: Tile[][] = [];

const unseededRandom = new SeededRandom();

export class MainGameScene extends Generic2DGameScene {
  public paused: boolean = false;
  private resizeObserver: ResizeObserver | null = null;
  public uiMenuOpen: boolean = false;
  public discoModeUpdateInterval: number = 0;
  public renderUpdateInterval: number = 0;
  public lastRenderUpdateTime: number = 0;
  public lastGameStateUpdateTime: number = 0;
  public gameOfLifeType: string = "";
  public discoModeLastUpdateTime: number = 0;
  public autoPlayModeLastUpdateTime: number = 0;
  public livingTilespaceSet: LivingTilespaceSet = new LivingTilespaceSet();
  public gestureManager: GestureManager = new GestureManager();
  private currentBackgroundColor: string | null = null;
  private lastManualWindowResizeTime: number = 0;
  private windowResizeInterval: number = 2000;
  public screenInfo = { width: 0, height: 0, isPortrait: false };
  private requestSetComputerLayout: boolean = false;
  private requestSetPhoneLayout: boolean = false;

  // Settings
  public updateInterval: number = 0;
  public underpopulation: number = 0;
  public overpopulation: number = 0;
  public reproduction: number = 0;
  public colorTheme: number = 0;
  public autoPause: boolean = true;
  public infiniteEdges: boolean = true;
  public diagonalNeighbors: boolean = true;

  // Game data
  public population: number = 0;
  public generation: number = 0;
  public autoPlayMode: boolean = false;
  public discoMode: boolean = false;

  // eslint-disable-next-line no-restricted-syntax
  constructor() {
    // Call the parent Generic2DGameScene's constructor with
    // this scene name supplied as the name of the scene.
    super("MainGameScene");

    // Return early during SSR/static generation (need to call super first)
    if (typeof window === "undefined") return;

    // Constructor logic for this scene
    this.discoModeUpdateInterval = 1500; // ms
    this.renderUpdateInterval = 66; // 33ms ~= 15hz
    this.lastRenderUpdateTime = 0;
    this.lastGameStateUpdateTime = 0;

    this.gameOfLifeType = gameOfLifeTypes.CONWAY;
    this.discoModeLastUpdateTime = 0;
    this.autoPlayModeLastUpdateTime = 0;

    this.livingTilespaceSet = new LivingTilespaceSet();
    this.updatePopulation(0);
    this.updateGeneration(0);

    this.gestureManager = new GestureManager();

    // Initial screen info
    this.updateScreenInfo();
  }

  preload() {
    super.preload();

    // Preload logic for this scene
    this.load.image("Tile Blank", "/webps/games/game-of-life-tile-blank.webp");
  }

  create() {
    super.create();

    this.setupSyncedSettings();
    this.setupSyncedGameData();

    // (setting tile layout creates the tiles)
    if (this.screenInfo.width <= 600 || this.screenInfo.isPortrait) {
      this.setTileLayoutForPhone();
    } else {
      this.setLayoutForComputer();
    }

    // After everything is loaded in, begin the game
    this.gameStarted = true;

    dispatchCloseLoadingScreenEvent("Game of Life");
    dispatchGameStartedEvent("Game of Life");
  }

  setupSyncedSettings() {
    // Get snapshot of the game of life settings, then load them in and subscribe to changes.
    const settings = settingsStore.getSnapshot();

    this.setSettingsFromStore(settings);

    settingsStore.subscribe(() => {
      const newSettings = settingsStore.getSnapshot();
      this.handleSettingsChange(newSettings);
    });
  }

  handleSettingsChange = (settings: Settings) => {
    this.setSettingsFromStore(settings);
  };

  setSettingsFromStore(settings: Settings) {
    this.updateInterval = settings.updateInterval;
    this.underpopulation = settings.underpopulation;
    this.overpopulation = settings.overpopulation;
    this.reproduction = settings.reproduction;
    this.colorTheme = settings.colorTheme;
    this.autoPause = settings.autoPause;
    this.infiniteEdges = settings.infiniteEdges;
    this.diagonalNeighbors = settings.diagonalNeighbors;
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
    const incomingAutoPlayMode = this.autoPlayMode;
    const incomingDiscoMode = this.discoMode;

    this.population = gameData.population;
    this.generation = gameData.generation;
    this.paused = gameData.paused;
    this.autoPlayMode = gameData.autoPlayMode;
    this.discoMode = gameData.discoMode;

    // If the game is paused, unpause it if autoplay is turned on (false -> true)
    if (this.paused && !incomingAutoPlayMode && this.autoPlayMode) {
      gameDataStore.setPaused(false);
    }
    // If the game is paused, unpause it if disco mode is turned on (false -> true)
    if (this.paused && !incomingDiscoMode && this.discoMode) {
      gameDataStore.setPaused(false);
    }
  }

  updateScreenInfo() {
    this.screenInfo = {
      /* eslint-disable no-restricted-syntax */
      width: window.visualViewport?.width || window.innerWidth,
      height: window.visualViewport?.height || window.innerHeight,
      isPortrait: window.matchMedia("(orientation: portrait)").matches,
      /* eslint-enable no-restricted-syntax */
    };
  }

  update(time: number, delta: number) {
    super.update(time, delta);

    if (this.gameStarted) {
      if (!this.paused) {
        // Perform tile grid updates on tile updateInterval
        if (time - this.lastGameStateUpdateTime >= this.updateInterval) {
          this.lastGameStateUpdateTime = time;

          // Auto mode: automatically place shapes if the criteria fits
          if (this.autoPlayMode) {
            // Every 2 seconds, if the population is below some threshold, place a shape
            if (
              time - this.autoPlayModeLastUpdateTime >= 2000 &&
              this.population < 30
            ) {
              this.autoPlayModeLastUpdateTime = time;
              this.placeRandomShape();
            }
            // Otherwise, in case the population has grown static, place a shape no matter what
            // after 5 seconds
            else if (time - this.autoPlayModeLastUpdateTime >= 5000) {
              this.autoPlayModeLastUpdateTime = time;
              this.placeRandomShape();
            }
          }

          // Disco mode: switch color theme after discoModeUpdateInterval ms
          if (this.discoMode) {
            if (
              time - this.discoModeLastUpdateTime >=
              this.discoModeUpdateInterval
            ) {
              this.discoModeLastUpdateTime = time;
              this.advanceToNextColorTheme();

              // // Play a vignette animation (make it nearly as long as the disco mode interval)
              // vignetteFade(this.discoModeUpdateInterval); // ms
            }
          }

          // Run the iteration last so it can handle things like population count etc.
          this.runGameOfLifeIteration();
        }
      }

      // "render" pass to update all visuals
      if (time - this.lastRenderUpdateTime >= this.renderUpdateInterval) {
        this.lastRenderUpdateTime = time;

        this.renderPass();
      }
    }

    // In order to handle edge cases where the resize observer does not catch
    // a resize (such as when iPhone toolbar changes), we also check for resize
    // every windowResizeInterval milliseconds.
    if (time - this.lastManualWindowResizeTime >= this.windowResizeInterval) {
      this.handleWindowResize();
      this.lastManualWindowResizeTime = time;
    }

    // Perform reset/destroy of tiles if requested... Do it this way so that
    // destruction/restructure can happen at a safe time.
    if (this.requestSetPhoneLayout) {
      this.setTileLayoutForPhone();
      this.requestSetPhoneLayout = false;
    } else if (this.requestSetComputerLayout) {
      this.setLayoutForComputer();
      this.requestSetComputerLayout = false;
    }
  }

  renderPass() {
    // Update tile graphics / color etc.
    for (let row = 0; row < tiles.length; row++) {
      for (let col = 0; col < tiles[row].length; col++) {
        tiles[row][col].renderTileGraphics();
      }
    }

    // Only update the background color if it has changed
    const newBackgroundColor = this.hexToCssColor(
      tileAndBackgroundColors[this.colorTheme][2]
    );

    if (
      this.currentBackgroundColor == null ||
      this.currentBackgroundColor !== newBackgroundColor
    ) {
      document.body.style.backgroundColor = newBackgroundColor;
      this.currentBackgroundColor = newBackgroundColor;
    }
  }

  runGameOfLifeIteration() {
    // Run the life iteration
    const toCheckTileGridSpaceLocs = this.checkForNeighborTiles(
      this.diagonalNeighbors,
      this.infiniteEdges
    );

    if (this.gameOfLifeType == gameOfLifeTypes.CONWAY) {
      this.handleConwayLifeIteration(toCheckTileGridSpaceLocs);
    } else {
      console.error(`Unknown game of life type: ${this.gameOfLifeType}`);
    }

    // Update the generation count
    this.updateGeneration(this.generation + 1);
  }

  updateGeneration(newGenerationVal: number) {
    // Cap to safe values
    if (newGenerationVal > Number.MAX_SAFE_INTEGER - 10) {
      newGenerationVal = 0;
    }

    gameDataStore.setGeneration(newGenerationVal);
  }

  updatePopulation(newPopulationVal: number) {
    // Cap to safe values
    if (newPopulationVal > Number.MAX_SAFE_INTEGER - 10) {
      newPopulationVal = 0;
    }

    // If the population is 0, pause the game if it is not already.
    // ONLY IF NOT IN AUTOPLAY MODE!
    if (newPopulationVal == 0 && !this.autoPlayMode) {
      if (!this.paused) {
        gameDataStore.setPaused(true);
      }
    }

    gameDataStore.setPopulation(newPopulationVal);
  }

  checkForNeighborTiles(
    countCorners: boolean,
    countTorusNeighbors: boolean
  ): [number, number][] {
    // Check all living tiles and their surrounding neighbors to see how many living
    // neighbors they have. This is the optimal way of checking, since vast spans of
    // dead cells will never change state, so we can skip them.
    const livingTileGridSpaceLocs = this.livingTilespaceSet.getTilespaceArray();
    const toCheckTilespaceSet = new tilespaceSet();

    // Add living tiles and their neighbors to the toCheckTilespaceSet
    for (const loc of livingTileGridSpaceLocs) {
      const [x, y] = loc;

      // Add the living tile itself
      toCheckTilespaceSet.add(tiles[x][y]);

      // Add its neighbors
      const neighborTiles = tiles[x][y].getNeighbors(
        tiles,
        countCorners,
        countTorusNeighbors
      );

      for (const neighborTile of neighborTiles) {
        toCheckTilespaceSet.add(neighborTile);
      }
    }

    // Iterate over tiles to check and get their qty living neighbors
    const toCheckTileGridSpaceLocs = toCheckTilespaceSet.getTilespaceArray();
    for (const loc of toCheckTileGridSpaceLocs) {
      const [x, y] = loc;
      tiles[x][y].getQtyLivingNeighbors(
        tiles,
        countCorners,
        countTorusNeighbors
      );
    }

    // Only check these tiles for game of life changes (more efficient)
    return toCheckTileGridSpaceLocs;
  }

  handleConwayLifeIteration(toCheckTileGridSpaceLocs: [number, number][]) {
    for (const loc of toCheckTileGridSpaceLocs) {
      const [x, y] = loc;
      const tile = tiles[x][y];
      tile.handleConwayLifeIteration();
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

    document.addEventListener("uiMenuOpen", this.handleUiMenuOpen);
    document.addEventListener("uiMenuClose", this.handleUiMenuClose);

    document.addEventListener("clickAdvance", this.handleClickAdvance);
    document.addEventListener("resetTiles", this.handleResetTiles);
  }

  /*
   * Note that this function is called in the shutdown() method for GameScene2D,
   * so no need to call it! That is handled automatically.
   */
  unsubscribeFromEvents() {
    super.unsubscribeFromEvents();

    // Unsubscribe from events for this scene
    this.tearDownWindowResizeHandling();

    document.removeEventListener("uiMenuOpen", this.handleUiMenuOpen);
    document.removeEventListener("uiMenuClose", this.handleUiMenuClose);

    document.removeEventListener("clickAdvance", this.handleClickAdvance);
    document.removeEventListener("resetTiles", this.handleResetTiles);
  }

  handleClickAdvance = () => {
    this.clickAdvance();
  };

  handleResetTiles = () => {
    this.resetTiles();

    if (!this.paused) {
      gameDataStore.setPaused(true);
    }
  };

  // Using Arrow Function to bind the context of "this" to the class instance.
  // This is necc. for event handlers.
  handleUiMenuOpen = () => {
    this.uiMenuOpen = true;
    this.gestureManager.blockDrag();
    this.gestureManager.blockZoom();
  };

  // Using Arrow Function to bind the context of "this" to the class instance.
  // This is necc. for event handlers.
  handleUiMenuClose = () => {
    this.uiMenuOpen = false;
    this.gestureManager.unblockDrag();
    this.gestureManager.unblockZoom();
  };

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
    /* eslint-disable no-restricted-syntax */
    window.addEventListener("resize", this.handleWindowResize);
    window.addEventListener("orientationchange", this.handleWindowResize);
    /* eslint-enable no-restricted-syntax */
  }

  tearDownWindowResizeHandling() {
    if (this.resizeObserver != null) {
      this.resizeObserver.disconnect();
      this.resizeObserver = null;
    }
    /* eslint-disable no-restricted-syntax */
    window.removeEventListener("resize", this.handleWindowResize);
    window.removeEventListener("orientationchange", this.handleWindowResize);
    /* eslint-enable no-restricted-syntax */
  }

  // Using Arrow Function to bind the context of "this" to the class instance.
  // This is necc. for event handlers.
  handleWindowResize = () => {
    // Ensure the scene is fully initialized before handling resize
    if (!this.isInitialized) {
      console.warn("handleWindowResize called before scene initialization.");
      return;
    }

    // Get up to date screen info
    this.updateScreenInfo();

    // Update canvas size to match the parent.
    // This is needed to be done manually since Phaser.AUTO does not
    // take into account some nuances of screen size on safari/iOS.
    resizeCanvasToParent(this.game);

    // This is a workaround for the iOS bug where address bar or "enable diction"
    // window appearing causes scroll that gets stuck.

    /* eslint-disable no-restricted-syntax */
    if (window.scrollX !== 0 || window.scrollY !== 0) {
      window.scrollTo(0, 0);
    }
    /* eslint-enable no-restricted-syntax */

    // If it switches from landscape to portrait (aka phone) or vice versa,
    // update the layout of the tile grid.
    if (this.screenInfo.width <= 600 || this.screenInfo.isPortrait) {
      // Only update layout if it changed!
      if (
        tileGridAttrs.tileGridWidth != tileGridWidthPhone ||
        tileGridAttrs.tileGridHeight != tileGridHeightPhone
      ) {
        // See update loop for why we request this instead of doing it now
        this.requestSetPhoneLayout = true;
      }
    } else {
      // Only update layout if it changed!
      if (
        tileGridAttrs.tileGridWidth != tileGridWidthComputer ||
        tileGridAttrs.tileGridHeight != tileGridHeightComputer
      ) {
        // See update loop for why we request this instead of doing it now
        this.requestSetComputerLayout = true;
      }
    }
  };

  setTileLayoutForPhone() {
    // Update layout for phone
    tileGridAttrs.tileGridWidth = tileGridWidthPhone;
    tileGridAttrs.tileGridHeight = tileGridHeightPhone;

    // Set different zoom / drag rates on phone
    this.gestureManager.setDragRate(0.9);
    this.gestureManager.setZoomRate(0.07);

    // init or re-init all tiles
    this.livingTilespaceSet.clear();
    this.destroyTiles();
    tiles = instantiateTiles(this);
  }

  setLayoutForComputer() {
    // Update layout for computer
    tileGridAttrs.tileGridWidth = tileGridWidthComputer;
    tileGridAttrs.tileGridHeight = tileGridHeightComputer;

    // Set different zoom / drag rates on phone
    this.gestureManager.setDragRate(0.85);
    this.gestureManager.setZoomRate(0.065);

    // init or re-init all tiles
    this.livingTilespaceSet.clear();
    this.destroyTiles();
    tiles = instantiateTiles(this);
  }

  resetTiles() {
    // reset zoom and drag to 0
    this.gestureManager.resetDrag();
    this.gestureManager.resetZoom();

    for (let row = 0; row < tiles.length; row++) {
      for (let col = 0; col < tiles[row].length; col++) {
        tiles[row][col].resetTile();
      }
    }

    // Fresh reset on generation and population as well
    this.livingTilespaceSet.clear();
    this.updatePopulation(0);
    this.updateGeneration(0);
  }

  clickAdvance() {
    if (this.paused) {
      this.runGameOfLifeIteration();
    } else {
      // Manually pause on advance if playing already
      gameDataStore.setPaused(true);
    }
  }

  placeRandomShape() {
    // Get a random shape
    const cgolTileShapeKeys = Object.keys(cgolTileShapes) as Array<
      keyof typeof cgolTileShapes
    >;
    const randomShapeIndex = unseededRandom.getRandomInt(
      0,
      cgolTileShapeKeys.length
    );
    const randomShape = new gameOfLifeShape(
      cgolTileShapeKeys[randomShapeIndex]
    );

    // console.log(cgolTileShapeKeys[randomShapeIndex]);
    // console.log(randomShape.shapeTileSpace);

    // Random shape has a shapeTileSpace indicating which tiles to turn on/off,
    // starting from the top left. Need to find a random location on the real tileGridSpace
    // that can fit the shape!
    const tileSpaceWidth = tiles.length;
    const tileSpaceHeight = tiles[0].length;

    const shapeWidth = randomShape.getWidth();
    const shapeHeight = randomShape.getHeight();

    // Pick a random x coordinate between 0 and tileSpaceWidth - shapeWidth, so that the shape
    // can always fit. Do similar for the y coordinate, but bound the lower bound since y counts downward.
    // This logic works because we draw the tile from top left to bottom right.
    const upperBoundX = tileSpaceWidth - shapeWidth;
    if (upperBoundX <= 0) {
      console.error("Shape is larger than the tile grid! Not placing shape.");
      return;
    }
    const randomX = unseededRandom.getRandomInt(0, upperBoundX);

    const lowerBoundY = shapeHeight;
    if (lowerBoundY >= tileSpaceHeight) {
      console.error("Shape is larger than the tile grid! Not placing shape.");
      return;
    }
    const randomY = unseededRandom.getRandomInt(
      lowerBoundY - 1,
      tileSpaceHeight
    );

    // Spawn in the shape from the randomX and randomY location!
    randomShape.iterateOverTileSpace((shape, shapeX, shapeY) => {
      const tileSpawnLocX = randomX + shapeX;
      const tileSpawnLocY = randomY - shapeY; // minus since it goes top left to bottom right

      if (tileSpawnLocX >= tileSpaceWidth || tileSpawnLocY >= tileSpaceHeight) {
        // Skip this iteration
        console.error(
          "Shape placement out of bounds. Cannot place at",
          tileSpawnLocX,
          tileSpawnLocY
        );
        console.log("Debug info about the shape:");
        console.log("Top left coordinate x, y: ", randomX, randomY);
        console.log("Shape width, height", shapeWidth, shapeHeight);
        console.log(
          "Tile Gridspace Width, height",
          tileSpaceWidth,
          tileSpaceHeight
        );
        return;
      }

      // Only add to the grid, dont remove anything!
      const tile = tiles[tileSpawnLocX][tileSpawnLocY];
      if (
        tile.tileState == tileStates.OFF &&
        shape.getStateAtCoords(shapeX, shapeY) == tileStates.ON
      ) {
        tile.changeState(tileStates.ON);
      }
    });
  }

  hexToCssColor(hex: number): string {
    return `#${hex.toString(16).padStart(6, "0")}`;
  }

  advanceToNextColorTheme() {
    let desiredColorTheme = this.colorTheme + 1;
    if (desiredColorTheme > tileAndBackgroundColors.length - 1) {
      desiredColorTheme = 0;
    }

    settingsStore.setColorTheme(desiredColorTheme);
  }

  decreaseToPreviousColorTheme() {
    let desiredColorTheme = this.colorTheme - 1;
    if (desiredColorTheme < 0) {
      desiredColorTheme = tileAndBackgroundColors.length - 1;
    }

    settingsStore.setColorTheme(desiredColorTheme);
  }

  destroyTiles() {
    // Clear the existing tiles
    for (let row = 0; row < tiles.length; row++) {
      for (let col = 0; col < tiles[row].length; col++) {
        tiles[row][col].destroy();
      }
    }
    tiles.length = 0; // Clear the tiles array
  }

  /*
   * Note that this function is called by GameScene2D during shutdown,
   * so no need to call it! That is handled automatically.
   */
  shutdown() {
    super.shutdown();

    // Shutdown logic for this scene
    settingsStore.resetData();
    gameDataStore.resetData();
    this.destroyTiles();
    this.gestureManager.destroy();
  }
}
