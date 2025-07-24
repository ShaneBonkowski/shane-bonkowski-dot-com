import { Generic2DGameScene } from "@/src/utils/game-scene-2d";
import {
  dispatchCloseLoadingScreenEvent,
  dispatchGameStartedEvent,
} from "@/src/events/game-events";
import { Tile } from "@/src/games/perlin-noise/tile";
import { TileGridTexture } from "@/src/games/perlin-noise/tile-grid-texture";
import {
  instantiateTiles,
  tileGridWidthComputer,
  tileGridHeightComputer,
  tileGridWidthPhone,
  tileGridHeightPhone,
  tileColorMap,
} from "@/src/games/perlin-noise/tile-utils";
import { SeededRandom, randomType } from "@/src/utils/seedable-random";
import { Vec3 } from "@/src/utils/vector";
import { createNoise3D } from "simplex-noise";
import {
  settingsStore,
  Settings,
} from "@/src/games/perlin-noise/settings-store";

export class MainGameScene extends Generic2DGameScene {
  public tiles: Tile[][] = [];
  public tileGridWidth: number = 0;
  public tileGridHeight: number = 0;
  public tileGridTexture: TileGridTexture | null = null;
  private requestSetComputerLayout: boolean = false;
  private requestSetPhoneLayout: boolean = false;
  public random: SeededRandom = new SeededRandom(randomType.UNSEEDED_RANDOM);

  private noise3D = createNoise3D();
  public perlinCoordinates: Vec3 = new Vec3(0, 0, 0);
  public perlinZoom: number = 0;
  private zoomScale: number = 0.0005;
  private walkSpeed: number = 0;
  private speedScale: number = 0.0005;
  private zSliceScale: number = 0.01; // Scale for the z-slice value
  private lastWalkDirection: Vec3 = new Vec3(1, 0, 0); // right
  public autoPlay: boolean = true;

  // eslint-disable-next-line no-restricted-syntax
  constructor() {
    // Call the parent Generic2DGameScene's constructor with
    // this scene name supplied as the name of the scene.
    super("MainGameScene");

    // Return early during SSR/static generation (need to call super first)
    if (typeof window === "undefined") return;

    // Constructor logic for this scene
    // ...
  }

  preload() {
    super.preload();

    // Do preload logic for this scene
    // ...
  }

  create() {
    super.create();

    this.setupSyncedSettings();

    // (setting tile layout creates the tiles)
    if (this.screenInfo.width <= 600 || this.screenInfo.isPortrait) {
      this.setTileLayoutForPhone();
    } else {
      this.setLayoutForComputer();
    }

    this.gameStarted = true;
    dispatchCloseLoadingScreenEvent("Perlin Noise");
    dispatchGameStartedEvent("Perlin Noise");
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
    this.autoPlay = settings.autoPlay;

    // Update derived values based on settings
    this.walkSpeed = settings.walkSpeedSliderValue * this.speedScale;
    this.perlinCoordinates.z = settings.zSliceSliderValue * this.zSliceScale;
    this.perlinZoom = settings.zoomSliderValue * this.zoomScale;
  }

  update(time: number, delta: number) {
    super.update(time, delta);

    if (this.gameStarted) {
      if (this.autoPlay) {
        // Continue walking in the last direction if in auto mode
        this.walk(this.lastWalkDirection);
      }

      // Update the perlin noise value of tiles based on perlin coordinates and scale
      for (let row = 0; row < this.tiles.length; row++) {
        for (let col = 0; col < this.tiles[row].length; col++) {
          const newPerlinValue =
            (this.noise3D(
              this.perlinCoordinates.x + row * this.perlinZoom,
              this.perlinCoordinates.y + col * this.perlinZoom,
              this.perlinCoordinates.z
            ) +
              1) *
            0.5; // Normalize from [-1,1] to [0,1]
          this.tiles[row][col].updatePerlinValue(newPerlinValue);
        }
      }

      // Finally, graphics update
      this.renderPass();
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
    for (let row = 0; row < this.tiles.length; row++) {
      for (let col = 0; col < this.tiles[row].length; col++) {
        this.tileGridTexture!.setPixelHex(
          row,
          col,
          tileColorMap[this.tiles[row][col].tileType]
        );
      }
    }

    // Refresh texture and update graphic (scale etc.)
    this.tileGridTexture!.refresh();
    this.tileGridTexture!.updateGraphic();
  }

  /*
   * Note that this function is called in the create() method for GameScene2D,
   * so no need to call it! That is handled automatically.
   */
  subscribeToEvents() {
    super.subscribeToEvents();

    // Subscribe to events for this scene
    document.addEventListener("perlinWalkUp", this.handleWalkUp);
    document.addEventListener("perlinWalkDown", this.handleWalkDown);
    document.addEventListener("perlinWalkLeft", this.handleWalkLeft);
    document.addEventListener("perlinWalkRight", this.handleWalkRight);
  }

  /*
   * Note that this function is called in the shutdown() method for GameScene2D,
   * so no need to call it! That is handled automatically.
   */
  unsubscribeFromEvents() {
    super.unsubscribeFromEvents();

    // Unsubscribe from events for this scene
    document.removeEventListener("perlinWalkUp", this.handleWalkUp);
    document.removeEventListener("perlinWalkDown", this.handleWalkDown);
    document.removeEventListener("perlinWalkLeft", this.handleWalkLeft);
    document.removeEventListener("perlinWalkRight", this.handleWalkRight);
  }

  handleWalkUp = () => {
    this.walk(new Vec3(0, 1, 0));
  };

  handleWalkDown = () => {
    this.walk(new Vec3(0, -1, 0));
  };

  handleWalkLeft = () => {
    this.walk(new Vec3(-1, 0, 0));
  };

  handleWalkRight = () => {
    this.walk(new Vec3(1, 0, 0));
  };

  walk = (walkDirection: Vec3) => {
    const scaledDirection = Vec3.scale(walkDirection, this.walkSpeed);
    this.perlinCoordinates = Vec3.add(this.perlinCoordinates, scaledDirection);
    this.lastWalkDirection = walkDirection;
  };

  // Override the parent class's handleWindowResizeHook to add custom logic.
  // This will get called automatically by the parent class's handleWindowResize()
  // method.
  handleWindowResizeHook() {
    // Handle resizing of game objs etc.
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
      // Do not update if screen size has not changed
      if (
        this.lastKnownWindowSize.x === this.screenInfo.width &&
        this.lastKnownWindowSize.y === this.screenInfo.height
      ) {
        return;
      }

      // Update bkg pos etc. We want to retain the general location of the obj,
      // so we try to position it the same screen % it was before on the new screen.
      let newX: number | null = null;
      let newY: number | null = null;

      if (this.tileGridTexture) {
        newX =
          (this.tileGridTexture.physicsBody2D!.position.x /
            this.lastKnownWindowSize.x) *
          this.screenInfo.width;
        newY =
          (this.tileGridTexture.physicsBody2D!.position.y /
            this.lastKnownWindowSize.y) *
          this.screenInfo.height;

        this.tileGridTexture.handleWindowResize(newX, newY);
      }

      // If it switches from landscape to portrait (aka phone) or vice versa,
      // update the layout of the tile grid.
      if (this.screenInfo.width <= 600 || this.screenInfo.isPortrait) {
        // Only update layout if it changed!
        if (
          this.tileGridWidth != tileGridWidthPhone ||
          this.tileGridHeight != tileGridHeightPhone
        ) {
          // See update loop for why we request this instead of doing it now
          this.requestSetPhoneLayout = true;
        }
      } else {
        // Only update layout if it changed!
        if (
          this.tileGridWidth != tileGridWidthComputer ||
          this.tileGridHeight != tileGridHeightComputer
        ) {
          // See update loop for why we request this instead of doing it now
          this.requestSetComputerLayout = true;
        }
      }
    }
  }

  setTileLayoutForPhone() {
    // init or re-init all tiles
    this.destroyTiles();

    this.tileGridWidth = tileGridWidthPhone;
    this.tileGridHeight = tileGridHeightPhone;

    this.tiles = instantiateTiles(this.tileGridWidth, this.tileGridHeight);

    // init or re-init the tile grid texture
    this.destroyTileGridTexture();
    this.tileGridTexture = new TileGridTexture(
      this,
      this.tileGridWidth,
      this.tileGridHeight
    );
  }

  setLayoutForComputer() {
    // init or re-init all tiles
    this.destroyTiles();

    this.tileGridWidth = tileGridWidthComputer;
    this.tileGridHeight = tileGridHeightComputer;

    this.tiles = instantiateTiles(this.tileGridWidth, this.tileGridHeight);

    // init or re-init the tile grid texture
    this.destroyTileGridTexture();
    this.tileGridTexture = new TileGridTexture(
      this,
      this.tileGridWidth,
      this.tileGridHeight
    );
  }

  destroyTiles() {
    // Clear the existing tiles
    for (let row = 0; row < this.tiles.length; row++) {
      for (let col = 0; col < this.tiles[row].length; col++) {
        this.tiles[row][col].destroy();
      }
    }
    this.tiles.length = 0; // Clear the tiles array
  }

  destroyTileGridTexture() {
    if (this.tileGridTexture) {
      this.tileGridTexture.destroy();
      this.tileGridTexture = null;
    }
  }

  /*
   * Note that this function is called by GameScene2D during shutdown,
   * so no need to call it! That is handled automatically.
   */
  shutdown() {
    super.shutdown();

    // Shutdown logic for this scene
    settingsStore.resetData();
    this.destroyTiles();
    this.destroyTileGridTexture();
  }
}
