import { Generic2DGameScene } from "@/src/utils/game-scene-2d";
import { dispatchGameStartedEvent } from "@/src/events/game-events";
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
import { settings } from "@/src/games/game-of-life/SettingsContainer";
import { resizeCanvasToParent } from "@/src/utils/phaser-canvas";

export let tiles: Tile[][] = [];

const unseededRandom = new SeededRandom();

export class MainGameScene extends Generic2DGameScene {
  private resizeObserver: ResizeObserver | null = null;
  public uiMenuOpen: boolean = false;
  public discoModeUpdateInterval: number;
  public renderUpdateInterval: number;
  public lastRenderUpdateTime: number;
  public lastGameStateUpdateTime: number;
  public gameOfLifeType: string;
  public discoMode: boolean;
  public discoModeLastUpdateTime: number;
  public autoPlayMode: boolean;
  public autoPlayModeLastUpdateTime: number;
  public livingTilespaceSet: LivingTilespaceSet;
  public gestureManager: GestureManager;
  private currentBackgroundColor: string | null = null;
  private lastManualWindowResizeTime: number = 0;
  private windowResizeInterval: number = 2000;

  constructor() {
    // Call the parent Generic2DGameScene's constructor with
    // this scene name supplied as the name of the scene.
    super("MainGameScene");

    // Constructor logic for this scene
    this.discoModeUpdateInterval = 1500; // ms
    this.renderUpdateInterval = 66; // 33ms ~= 15hz
    this.lastRenderUpdateTime = 0;
    this.lastGameStateUpdateTime = 0;

    this.gameOfLifeType = gameOfLifeTypes.CONWAY;
    this.discoMode = false;
    this.discoModeLastUpdateTime = 0;
    this.autoPlayMode = false;
    this.autoPlayModeLastUpdateTime = 0;

    this.livingTilespaceSet = new LivingTilespaceSet();
    this.updatePopulation(0);
    this.updateGeneration(0);

    this.gestureManager = new GestureManager();
  }

  preload() {
    super.preload();

    // Preload logic for this scene
    this.load.image("Tile Blank", "/webps/games/game-of-life-tile-blank.webp");
  }

  create() {
    super.create();

    // (setting tile layout creates the tiles)
    const isPortrait = window.matchMedia("(orientation: portrait)").matches;

    if (
      (window.visualViewport?.width || window.innerWidth) <= 600 ||
      isPortrait
    ) {
      this.setTileLayoutForPhone();
    } else {
      this.setLayoutForComputer();
    }

    // If there is local storage with currentColorThemeIndex, set
    // color theme to that to start!
    if (localStorage.getItem("currentColorThemeIndex")) {
      settings.colorTheme.value = parseInt(
        localStorage.getItem("currentColorThemeIndex") as string
      );
    }

    // Dispatch a custom event saying that color change just occured
    // due to the game class, not the slider.
    document.dispatchEvent(new CustomEvent("changeColorThemeFromMainGame"));

    // After everything is loaded in, begin the game
    this.gameStarted = true;
    this.paused = true; // start off paused

    dispatchGameStartedEvent("Game of Life");

    // DEBUG
    console.log("Game of Life scene created with tiles: ");
    for (let row = 0; row < tiles.length; row++) {
      for (let col = 0; col < tiles[row].length; col++) {
        console.log(tiles[row][col]);
      }
    }
  }

  update(time: number, delta: number) {
    super.update(time, delta);

    if (this.gameStarted) {
      if (this.paused == false) {
        // Perform tile grid updates on tile updateInterval
        if (
          time - this.lastGameStateUpdateTime >=
          settings.updateInterval.value
        ) {
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

              // Dispatch a custom event saying that disco mode just caused
              // a color change.
              document.dispatchEvent(
                new CustomEvent("changeColorThemeFromMainGame")
              );

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
      tileAndBackgroundColors[settings.colorTheme.value][2]
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
      settings.diagonalNeighbors.value,
      settings.infiniteEdges.value
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

    // Only fire an event if the generation value actually changed
    if (newGenerationVal != this.generation) {
      document.dispatchEvent(
        new CustomEvent("genChange", {
          detail: { message: newGenerationVal.toString() },
        })
      );
    }

    this.generation = newGenerationVal;
  }

  updatePopulation(newPopulationVal: number) {
    // Cap to safe values
    if (newPopulationVal > Number.MAX_SAFE_INTEGER - 10) {
      newPopulationVal = 0;
    }

    // Only fire an event if the population value actually changed
    if (newPopulationVal != this.population) {
      document.dispatchEvent(
        new CustomEvent("popChange", {
          detail: { message: newPopulationVal.toString() },
        })
      );
    }

    this.population = newPopulationVal;

    // If the population is 0, pause the game if it is not already.
    // ONLY IF NOT IN AUTOPLAY MODE!
    if (this.population == 0 && !this.autoPlayMode) {
      if (!this.paused) {
        this.togglePause();
        document.dispatchEvent(new CustomEvent("manualPause"));
      }
    }
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

    document.addEventListener("togglePause", this.handleTogglePause);
    document.addEventListener("toggleDisco", this.handleToggleDisco);
    document.addEventListener("toggleAutomatic", this.handleToggleAutomatic);
    document.addEventListener("clickAdvance", this.handleClickAdvance);
    document.addEventListener("resetTiles", this.handleResetTiles);
    document.addEventListener(
      "changeColorThemeFromSettings",
      this.handleUpdateColorThemeFromSettings
    );
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

    document.removeEventListener("togglePause", this.handleTogglePause);
    document.removeEventListener("toggleDisco", this.handleToggleDisco);
    document.removeEventListener("toggleAutomatic", this.handleToggleAutomatic);
    document.removeEventListener("clickAdvance", this.handleClickAdvance);
    document.removeEventListener("resetTiles", this.handleResetTiles);
    document.removeEventListener(
      "changeColorThemeFromSettings",
      this.handleUpdateColorThemeFromSettings
    );
  }

  handleTogglePause = () => {
    this.togglePause();
  };

  handleToggleDisco = () => {
    this.toggleDisco();
  };

  handleToggleAutomatic = () => {
    this.toggleAutoPlay();
  };

  handleClickAdvance = () => {
    this.clickAdvance();
  };

  handleResetTiles = () => {
    this.resetTiles();

    if (!this.paused) {
      this.togglePause();
      document.dispatchEvent(new CustomEvent("manualPause"));
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

  // Using Arrow Function to bind the context of "this" to the class instance.
  // This is necc. for event handlers.
  handleWindowResize = () => {
    // Ensure the scene is fully initialized before handling resize
    if (!this.isInitialized) {
      console.warn("handleWindowResize called before scene initialization.");
      return;
    }

    // Update canvas size to match the parent.
    // This is needed to be done manually since Phaser.AUTO does not
    // take into account some nuances of screen size on safari/iOS.
    resizeCanvasToParent(this.game);

    // This is a workaround for the iOS bug where address bar or "enable diction"
    // window appearing causes scroll that gets stuck.
    if (window.scrollX !== 0 || window.scrollY !== 0) {
      window.scrollTo(0, 0);
    }

    // If it switches from landscape to portrait (aka phone) or vice versa,
    // update the layout of the tile grid.
    const isPortrait = window.matchMedia("(orientation: portrait)").matches;

    if (
      (window.visualViewport?.width || window.innerWidth) <= 600 ||
      isPortrait
    ) {
      // Only update layout if it changed!
      if (
        tileGridAttrs.tileGridWidth != tileGridWidthPhone ||
        tileGridAttrs.tileGridHeight != tileGridHeightPhone
      ) {
        this.setTileLayoutForPhone();
      }
    } else {
      // Only update layout if it changed!
      if (
        tileGridAttrs.tileGridWidth != tileGridWidthComputer ||
        tileGridAttrs.tileGridHeight != tileGridHeightComputer
      ) {
        this.setLayoutForComputer();
      }
    }
  };

  setTileLayoutForPhone() {
    // Update layout for phone
    tileGridAttrs.tileGridWidth = tileGridWidthPhone;
    tileGridAttrs.tileGridHeight = tileGridHeightPhone;

    // init or re-init all tiles
    this.destroyTiles();
    tiles = instantiateTiles(this);
  }

  setLayoutForComputer() {
    // Update layout for computer
    tileGridAttrs.tileGridWidth = tileGridWidthComputer;
    tileGridAttrs.tileGridHeight = tileGridHeightComputer;

    // init or re-init all tiles
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

  togglePause() {
    this.paused = !this.paused;
  }

  clickAdvance() {
    if (this.paused) {
      this.runGameOfLifeIteration();
    } else {
      // Manually pause on advance if playing already
      this.togglePause();
      document.dispatchEvent(new CustomEvent("manualPause"));
    }
  }

  placeRandomShape() {
    // Get a random shape
    const cgolTileShapeKeys = Object.keys(cgolTileShapes) as Array<
      keyof typeof cgolTileShapes
    >;
    const randomShapeIndex = unseededRandom.getRandomInt(
      0,
      cgolTileShapeKeys.length - 1
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

  toggleAutoPlay() {
    this.autoPlayMode = !this.autoPlayMode;

    // If the game is paused, unpause it if autoplay is turned on
    if (this.paused && this.autoPlayMode) {
      this.togglePause();
      document.dispatchEvent(new CustomEvent("manualUnpause"));
    }
  }

  toggleDisco() {
    this.discoMode = !this.discoMode;
  }

  hexToCssColor(hex: number): string {
    return `#${hex.toString(16).padStart(6, "0")}`;
  }

  handleUpdateColorThemeFromSettings = () => {
    this.updateColorThemeCookie();
  };

  advanceToNextColorTheme() {
    settings.colorTheme.value++;
    if (settings.colorTheme.value > tileAndBackgroundColors.length - 1) {
      settings.colorTheme.value = 0;
    }
    this.updateColorThemeCookie();
  }

  decreaseToPreviousColorTheme() {
    settings.colorTheme.value--;
    if (settings.colorTheme.value < 0) {
      settings.colorTheme.value = tileAndBackgroundColors.length - 1;
    }
    this.updateColorThemeCookie();
  }

  updateColorThemeCookie() {
    // Write color theme to localStorage so that the color theme persists on
    // page reload etc.
    localStorage.setItem(
      "currentColorThemeIndex",
      settings.colorTheme.value.toString()
    );
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
    this.destroyTiles();
    this.gestureManager.destroy();
  }
}
