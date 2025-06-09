import { Generic2DGameScene } from "@/src/utils/game-scene-2d";
import { Vec2 } from "@/src/utils/vector";
import { dispatchGameStartedEvent } from "@/src/events/game-events";
import { resizeCanvasToParent } from "@/src/utils/phaser-canvas";
import { Decoration, DECOR_TYPES } from "@/src/games/cowpoke/decoration";
import { Physics } from "@/src/utils/physics";
import { SeededRandom, randomType } from "@/src/utils/seedable-random";
import { Character, CHARACTER_TYPES } from "@/src/games/cowpoke/character";

// Bkg art was drawn at 1920x1080, so we use that as the reference size.
// This is used to scale the background decorations to fit the screen.
// Note that this is not the same as the game canvas size, which is set to
// 100% width and height of the parent element.
export const REFERENCE_BKG_SIZE: Vec2 = new Vec2(1920, 1080);

export class MainGameScene extends Generic2DGameScene {
  private decorations: Decoration[] = [];
  private player: Character | null = null;
  private enemy: Character | null = null;
  public gameRound: number = 0;

  public random: SeededRandom = new SeededRandom(randomType.UNSEEDED_RANDOM);

  private resizeObserver: ResizeObserver | null = null;
  public lastKnownWindowSize: Vec2 | null = null;
  private lastManualWindowResizeTime: number = 0;
  private windowResizeInterval: number = 250;

  public uiMenuOpen: boolean = false;
  public moving: boolean = false;

  constructor() {
    // Call the parent Generic2DGameScene's constructor with
    // this scene name supplied as the name of the scene.
    super("MainGameScene");

    // Constructor logic for this scene
    // ...

    // Last thing we do is set the lastKnownWindowSize to the current screen size
    const screenWidth = window.visualViewport?.width || window.innerWidth;
    const screenHeight = window.visualViewport?.height || window.innerHeight;
    this.lastKnownWindowSize = new Vec2(screenWidth, screenHeight);
  }

  preload() {
    super.preload();

    // Backgrounds
    this.load.image("bkg-back", "/webps/games/cowpoke-bkg-back.webp");
    this.load.image("bkg-mid-1", "/webps/games/cowpoke-bkg-mid-1.webp");
    this.load.image("bkg-mid-2", "/webps/games/cowpoke-bkg-mid-2.webp");
    this.load.image("bkg-floor", "/webps/games/cowpoke-bkg-floor.webp");

    // Front decor
    this.load.image(
      "bkg-front-cactus-1",
      "/webps/games/cowpoke-bkg-front-cactus-1.webp"
    );
    this.load.image(
      "bkg-front-cactus-2",
      "/webps/games/cowpoke-bkg-front-cactus-2.webp"
    );
    this.load.image(
      "bkg-front-cactus-3",
      "/webps/games/cowpoke-bkg-front-cactus-3.webp"
    );
    this.load.image(
      "bkg-front-cactus-4",
      "/webps/games/cowpoke-bkg-front-cactus-4.webp"
    );
    this.load.image(
      "bkg-front-cactus-5",
      "/webps/games/cowpoke-bkg-front-cactus-5.webp"
    );
    this.load.image(
      "bkg-front-cactus-6",
      "/webps/games/cowpoke-bkg-front-cactus-6.webp"
    );
    this.load.image(
      "bkg-front-rock-1",
      "/webps/games/cowpoke-bkg-front-rock-1.webp"
    );
    this.load.image(
      "bkg-front-rock-2",
      "/webps/games/cowpoke-bkg-front-rock-2.webp"
    );

    // Guns
    this.load.image(
      "gun-handcannon",
      "/webps/games/cowpoke-gun-handcannon.webp"
    );
    this.load.image("gun-revolver", "/webps/games/cowpoke-gun-revolver.webp");

    // Hats
    this.load.image("hat-bandito", "/webps/games/cowpoke-hat-bandito.webp");
    this.load.image("hat-sherif", "/webps/games/cowpoke-hat-sherif.webp");

    // Bodies
    this.load.image("body-default", "/webps/games/cowpoke-body-default.webp");

    // Heads
    this.load.image(
      "head-bandito-1",
      "/webps/games/cowpoke-head-bandito-1.webp"
    );
    this.load.image(
      "head-bandito-2",
      "/webps/games/cowpoke-head-bandito-2.webp"
    );
    this.load.image(
      "head-bandito-3",
      "/webps/games/cowpoke-head-bandito-3.webp"
    );
    this.load.image(
      "head-bandito-4",
      "/webps/games/cowpoke-head-bandito-4.webp"
    );
    this.load.image(
      "head-chill-guy",
      "/webps/games/cowpoke-head-chill-guy.webp"
    );

    // Extras
    this.load.image("rarity-star-1", "/webps/games/cowpoke-rarity-star-1.webp");
    this.load.image("rarity-star-2", "/webps/games/cowpoke-rarity-star-2.webp");
    this.load.image("rarity-star-3", "/webps/games/cowpoke-rarity-star-3.webp");
    this.load.image("shield", "/webps/games/cowpoke-shield.webp");
  }

  create() {
    super.create();

    const screenWidth = window.visualViewport?.width || window.innerWidth;
    const screenHeight = window.visualViewport?.height || window.innerHeight;

    // Create the background decorations
    this.initializeBackgroundDecorations(screenWidth, screenHeight);
    this.handleWindowResize();

    this.gameStarted = true;
    this.gameRound = 1;
    dispatchGameStartedEvent("Cowpoke");
  }

  initializeBackgroundDecorations(screenWidth: number, screenHeight: number) {
    // Back bkg
    this.decorations.push(
      new Decoration(
        this,
        screenWidth / 2,
        screenHeight,
        DECOR_TYPES.BACK,
        "bkg-back"
      )
    );

    // Need 2 mid backgrounds. One on the pg and one offscreen shifted by screen width.
    // This is so there is a buffer to allow for parallax scrolling.
    this.decorations.push(
      new Decoration(
        this,
        screenWidth / 2,
        screenHeight,
        DECOR_TYPES.MID,
        "bkg-mid-1"
      )
    );
    this.decorations.push(
      new Decoration(
        this,
        screenWidth / 2 + screenWidth,
        screenHeight,
        DECOR_TYPES.MID,
        "bkg-mid-2"
      )
    );

    // Floor bkg
    this.decorations.push(
      new Decoration(
        this,
        screenWidth / 2,
        screenHeight,
        DECOR_TYPES.FLOOR,
        "bkg-floor"
      )
    );

    // Add some front decorations at random x positions on the screen to start.
    // Must be sufficiently spaced out so they do not overlap.
    const propSpawnOptionsPercentViewportWidth = [
      [0.08, 0.14, 0.2], // e.g. prop 1 can be located at x% of viewport width from one of these choices
      [0.3, 0.4, 0.55, 0.6],
      [0.75, 0.8, 0.85],
    ];
    for (let i = 0; i < propSpawnOptionsPercentViewportWidth.length; i++) {
      const spawnPercents = propSpawnOptionsPercentViewportWidth[i];
      const chosenPercent =
        spawnPercents[this.random.getRandomInt(0, spawnPercents.length - 1)];
      const xPosition = screenWidth * chosenPercent;

      this.decorations.push(
        new Decoration(
          this,
          xPosition,
          screenHeight,
          DECOR_TYPES.FRONT,
          // Start with a random cactus decoration. Other props will get added in as the
          // game progresses.
          "bkg-front-cactus-" + this.random.getRandomInt(1, 7).toString(10)
        )
      );
    }

    // Create the player character
    this.player = new Character(
      this,
      screenWidth,
      screenHeight,
      CHARACTER_TYPES.PLAYER
    );

    // Create the enemy character
    this.enemy = new Character(
      this,
      screenWidth,
      screenHeight,
      CHARACTER_TYPES.ENEMY
    );
  }

  update(time: number, delta: number) {
    super.update(time, delta);

    if (this.gameStarted) {
      // Physics update at a slower rate
      if (
        time - Physics.lastPhysicsUpdateTime >=
        Physics.physicsUpdateInterval
      ) {
        Physics.performPhysicsUpdate(time);

        // If the player is moving, need to move decor to make it look like
        // the player is moving.
        for (const decoration of this.decorations) {
          decoration.handlePhysics(this.moving);
        }
      }

      // Handle time-based player and enemy animations
      this.player!.handleAnims();
      this.enemy!.handleAnims();

      // Graphics update will occur every frame
      for (const decoration of this.decorations) {
        decoration.updateGraphic();
      }
      this.player!.updateGraphic();
      this.enemy!.updateGraphic();
    }

    // In order to handle edge cases where the resize observer does not catch
    // a resize (such as when iPhone toolbar changes), we also check for resize
    // every windowResizeInterval milliseconds.
    if (time - this.lastManualWindowResizeTime >= this.windowResizeInterval) {
      this.handleWindowResize();
      this.lastManualWindowResizeTime = time;
    }
  }

  handlePlayerDeath() {
    this.player!.handleDeath();

    document.dispatchEvent(
      new CustomEvent("cowpokePlayerDefeated", {
        detail: { gameRound: this.gameRound },
      })
    );
  }

  handleEnemyDeath() {
    this.gameRound++;
    this.enemy!.handleDeath();

    document.dispatchEvent(
      new CustomEvent("cowpokeEnemyDefeated", {
        detail: { gameRound: this.gameRound },
      })
    );
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
  }

  // Using Arrow Function to bind the context of "this" to the class instance.
  // This is necc. for event handlers.
  handleUiMenuOpen = () => {
    this.uiMenuOpen = true;
  };

  // Using Arrow Function to bind the context of "this" to the class instance.
  // This is necc. for event handlers.
  handleUiMenuClose = () => {
    this.uiMenuOpen = false;
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
      this.lastKnownWindowSize = new Vec2(screenWidth, screenHeight);
      return;
    } else {
      if (
        this.lastKnownWindowSize.x === screenWidth &&
        this.lastKnownWindowSize.y === screenHeight
      ) {
        return;
      }

      // Update positions of all objs based on new screen dimensions. We want to
      // retain the general location of the obj, so we try to position it the
      // same screen % it was before on the new screen.
      let newX: number | null = null;
      let newY: number | null = null;

      for (const decoration of this.decorations) {
        newX =
          (decoration.physicsBody2D!.position.x / this.lastKnownWindowSize.x) *
          screenWidth;
        newY =
          (decoration.physicsBody2D!.position.y / this.lastKnownWindowSize.y) *
          screenHeight;

        decoration.handleWindowResize(newX, newY);
      }

      newX =
        (this.player!.physicsBody2D!.position.x / this.lastKnownWindowSize.x) *
        screenWidth;
      newY =
        (this.player!.physicsBody2D!.position.y / this.lastKnownWindowSize.y) *
        screenHeight;

      this.player!.handleWindowResize(newX, newY);

      newX =
        (this.enemy!.physicsBody2D!.position.x / this.lastKnownWindowSize.x) *
        screenWidth;
      newY =
        (this.enemy!.physicsBody2D!.position.y / this.lastKnownWindowSize.y) *
        screenHeight;

      this.enemy!.handleWindowResize(newX, newY);
    }

    // Update lastKnownWindowSize to current screen dimensions
    this.lastKnownWindowSize = new Vec2(screenWidth, screenHeight);
  };

  /*
   * Note that this function is called by GameScene2D during shutdown,
   * so no need to call it! That is handled automatically.
   */
  shutdown() {
    super.shutdown();

    // Shutdown logic for this scene
    for (const decoration of this.decorations) {
      decoration.destroy();
    }
    this.decoration.length = 0; // Clear the array

    this.player!.destroy();

    this.enemy!.destroy();
  }
}
