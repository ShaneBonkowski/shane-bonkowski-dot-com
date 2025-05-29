import { Generic2DGameScene } from "@/src/utils/game-scene-2d";
import { Ball } from "@/src/games/game-template/ball";
import { Physics } from "@/src/utils/physics";
import { Vec2 } from "@/src/utils/vector";
import { dispatchGameStartedEvent } from "@/src/events/game-events";
import { resizeCanvasToParent } from "@/src/utils/phaser-canvas";

export class MainGameScene extends Generic2DGameScene {
  private balls: Ball[] = [];
  private resizeObserver: ResizeObserver | null = null;
  public maxBalls: number = 10;
  public lastKnownWindowSize: Vec2 | null = null;
  private lastManualWindowResizeTime: number = 0;
  private windowResizeInterval: number = 250;
  public uiMenuOpen: boolean = false;

  constructor() {
    // Call the parent Generic2DGameScene's constructor with
    // this scene name supplied as the name of the scene.
    super("MainGameScene");

    // Constructor logic for this scene
    // ...
  }

  preload() {
    super.preload();

    // Preload logic for this scene
    // ...
  }

  create() {
    super.create();

    // Create a ball and make it bounce around the
    // screen using physics
    const { width, height } = this.scale.gameSize;

    for (let i = 0; i < 5; i++) {
      this.createBall(width / 2, height / 2);
    }

    const screenWidth = window.visualViewport?.width || window.innerWidth;
    const screenHeight = window.visualViewport?.height || window.innerHeight;
    this.lastKnownWindowSize = new Vec2(screenWidth, screenHeight);

    this.gameStarted = true;
    dispatchGameStartedEvent("<TYPE GAME NAME HERE>"); // FIXME: GAME NAME HERE
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

        for (const ball of this.balls) {
          ball.handlePhysics(delta);
        }
      }

      // Graphics update will occur every frame
      for (const ball of this.balls) {
        ball.updateGraphic();
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

  /*
   * Note that this function is called in the create() method for GameScene2D,
   * so no need to call it! That is handled automatically.
   */
  subscribeToEvents() {
    super.subscribeToEvents();

    // Subscribe to events for this scene
    this.setUpWindowResizeHandling();

    this.input.on("pointerdown", this.handlePointerDown, this);
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

    this.input.off("pointerdown", this.handlePointerDown, this);
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

      // Update positions of all objs based on new screen dimensions. We want to
      // retain the general location of the obj, so we try to position it the
      // same screen % it was before on the new screen.
      for (const ball of this.balls) {
        // Calculate new position based on percentage of old position
        const newX =
          (ball.physicsBody2D!.position.x / this.lastKnownWindowSize.x) *
          screenWidth;
        const newY =
          (ball.physicsBody2D!.position.y / this.lastKnownWindowSize.y) *
          screenHeight;

        // handle re-sizing etc. of ball
        ball.handleWindowResize(newX, newY);
      }
    }

    // Update lastKnownWindowSize to current screen dimensions
    this.lastKnownWindowSize = new Vec2(screenWidth, screenHeight);
  };

  // Using Arrow Function to bind the context of "this" to the class instance.
  // This is necc. for event handlers.
  handlePointerDown = (pointer: Phaser.Input.Pointer) => {
    // Create a new ball at the pointer's position
    this.createBall(pointer.x, pointer.y);
  };

  createBall(x: number, y: number) {
    // Add new ball when click somewhere if we dont exceed max
    if (this.balls.length >= this.maxBalls) {
      return;
    }

    const ball = new Ball(this, x, y);
    this.balls.push(ball);
  }

  /*
   * Note that this function is called by GameScene2D during shutdown,
   * so no need to call it! That is handled automatically.
   */
  shutdown() {
    super.shutdown();

    // Shutdown logic for this scene
    for (const ball of this.balls) {
      ball.destroy();
    }
  }
}
