import { Generic2DGameScene } from "@/src/utils/game-scene-2d";
import {
  dispatchCloseLoadingScreenEvent,
  dispatchGameStartedEvent,
} from "@/src/events/game-events";
import { Tile } from "@/src/games/perlin-noise/tile";
import {
  instantiateTiles,
  tileGridSize,
  tileGridWidthComputer,
  tileGridHeightComputer,
  tileGridWidthPhone,
  tileGridHeightPhone,
} from "@/src/games/perlin-noise/tile-utils";
import { SeededRandom, randomType } from "@/src/utils/seedable-random";
import { Vec3 } from "@/src/utils/vector";
import { createNoise3D } from "simplex-noise";
import {
  settingsStore,
  Settings,
} from "@/src/games/perlin-noise/settings-store";

export class MainGameScene extends Generic2DGameScene {
  private tiles: Tile[][] = [];
  private requestSetComputerLayout: boolean = false;
  private requestSetPhoneLayout: boolean = false;
  public random: SeededRandom = new SeededRandom(randomType.UNSEEDED_RANDOM);

  private noise3D = createNoise3D();
  public perlinCoordinates: Vec3 = new Vec3(0, 0, 0);
  public perlinZoom: number = 0.1;

  public autoPlay: boolean = true;
  private lastWalkDirection: Vec3 = new Vec3(1, 0, 0); // right
  private zoomScale: number = 0.005;

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

    // Preload logic for this scene
    this.load.image("Tile Blank", "/webps/games/game-of-life-tile-blank.webp");
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
        this.tiles[row][col].renderGraphics();
      }
    }
  }

  /*
   * Note that this function is called in the create() method for GameScene2D,
   * so no need to call it! That is handled automatically.
   */
  subscribeToEvents() {
    super.subscribeToEvents();

    // Subscribe to events for this scene
    document.addEventListener("perlinZoomIn", this.handleZoomIn);
    document.addEventListener("perlinZoomOut", this.handleZoomOut);
    document.addEventListener(
      "perlinWalkUp",
      this.walk.bind(this, new Vec3(0, 1, 0))
    );
    document.addEventListener(
      "perlinWalkDown",
      this.walk.bind(this, new Vec3(0, -1, 0))
    );
    document.addEventListener(
      "perlinWalkLeft",
      this.walk.bind(this, new Vec3(-1, 0, 0))
    );
    document.addEventListener(
      "perlinWalkRight",
      this.walk.bind(this, new Vec3(1, 0, 0))
    );
  }

  /*
   * Note that this function is called in the shutdown() method for GameScene2D,
   * so no need to call it! That is handled automatically.
   */
  unsubscribeFromEvents() {
    super.unsubscribeFromEvents();

    // Unsubscribe from events for this scene
    document.removeEventListener("perlinZoomIn", this.handleZoomIn);
    document.removeEventListener("perlinZoomOut", this.handleZoomOut);
  }

  handleZoomIn = () => {
    this.perlinZoom += 1 * this.zoomScale;
  };

  handleZoomOut = () => {
    this.perlinZoom -= 1 * this.zoomScale;

    // Prevent zooming out too far
    if (this.perlinZoom < 0.01) {
      this.perlinZoom = 0.01;
    }
  };

  walk = (walkDirection: Vec3) => {
    const speed = this.perlinZoom; // if speed = zoom, then it will not flicker
    const scaledDirection = Vec3.scale(walkDirection, speed);
    this.perlinCoordinates = Vec3.add(this.perlinCoordinates, scaledDirection);
    this.lastWalkDirection = walkDirection;
  };

  // Override the parent class's handleWindowResizeHook to add custom logic.
  // This will get called automatically by the parent class's handleWindowResize()
  // method.
  handleWindowResizeHook() {
    // If it switches from landscape to portrait (aka phone) or vice versa,
    // update the layout of the tile grid.
    if (this.screenInfo.width <= 600 || this.screenInfo.isPortrait) {
      // Only update layout if it changed!
      if (
        tileGridSize.x != tileGridWidthPhone ||
        tileGridSize.y != tileGridHeightPhone
      ) {
        // See update loop for why we request this instead of doing it now
        this.requestSetPhoneLayout = true;
      }
    } else {
      // Only update layout if it changed!
      if (
        tileGridSize.x != tileGridWidthComputer ||
        tileGridSize.y != tileGridHeightComputer
      ) {
        // See update loop for why we request this instead of doing it now
        this.requestSetComputerLayout = true;
      }
    }
  }

  setTileLayoutForPhone() {
    // Update layout for phone
    tileGridSize.x = tileGridWidthPhone;
    tileGridSize.y = tileGridHeightPhone;

    // init or re-init all tiles
    this.destroyTiles();
    this.tiles = instantiateTiles(this);
  }

  setLayoutForComputer() {
    // Update layout for computer
    tileGridSize.x = tileGridWidthComputer;
    tileGridSize.y = tileGridHeightComputer;

    // init or re-init all tiles
    this.destroyTiles();
    this.tiles = instantiateTiles(this);
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

  /*
   * Note that this function is called by GameScene2D during shutdown,
   * so no need to call it! That is handled automatically.
   */
  shutdown() {
    super.shutdown();

    // Shutdown logic for this scene
    settingsStore.resetData();
    this.destroyTiles();
  }
}
