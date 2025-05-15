import { Generic2DGameScene } from "@/src/utils/game-scene-2d";
import { Ball } from "@/src/games/game-template/ball";
import { Physics } from "@/src/utils/physics";
import { Vec2 } from "@/src/utils/vector";
import { dispatchGameStartedEvent } from "@/src/events/game-events";

export class TemplateGameScene extends Generic2DGameScene {
  private balls: Ball[] = [];

  constructor() {
    // Call the parent Generic2DGameScene's constructor with
    // "TemplateGameScene" supplied as the name of the scene.
    super("TemplateGameScene");

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

    this.maxBalls = 10;
    for (let i = 0; i < 5; i++) {
      this.createBall(width / 2, height / 2);
    }

    const screenWidth = window.visualViewport?.width || window.innerWidth;
    const screenHeight = window.visualViewport?.height || window.innerHeight;
    this.lastKnownWindowSize = new Vec2(screenWidth, screenHeight);

    this.gameStarted = true;
    dispatchGameStartedEvent("<TYPE GAME NAME HERE>"); // FIXME: Add game name here
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

        // Handle the ball physics
        for (const ball of this.balls) {
          ball.handlePhysics(delta);
        }
      }

      // Graphics update will occur every frame
      for (const ball of this.balls) {
        ball.updateGraphic();
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
    this.setUpWindowResizeHandling();

    this.input.on("pointerdown", this.handlePointerDown, this);
  }

  /*
   * Note that this function is called in the shutdown() method for GameScene2D,
   * so no need to call it! That is handled automatically.
   */
  unsubscribeFromEvents() {
    super.unsubscribeFromEvents();

    // Unsubscribe from events for this scene
    if (this.resizeObserver != null) {
      this.resizeObserver.disconnect();
      this.resizeObserver = null;
    }
    window.removeEventListener("resize", this.handleWindowResize.bind(this));
    window.removeEventListener(
      "orientationchange",
      this.handleWindowResize.bind(this)
    );

    this.input.off("pointerdown", this.handlePointerDown, this);
  }

  setUpWindowResizeHandling() {
    // Observe window resizing so we can adjust the ball's position
    // and size accordingly!

    // Observe window resizing with ResizeObserver since it is good for snappy changes
    const resizeObserver = new ResizeObserver(() => {
      this.handleWindowResize();
    });
    resizeObserver.observe(document.documentElement);

    // Also checking for resize or orientation change to try to handle edge cases
    // that ResizeObserver misses!
    window.addEventListener("resize", this.handleWindowResize.bind(this));
    window.addEventListener(
      "orientationchange",
      this.handleWindowResize.bind(this)
    );
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

    // Resize the canvas
    try {
      this.scale.resize(screenWidth, screenHeight);
    } catch (error) {
      console.error(
        "Error during scale.resize (likely was called before phaser could initialize):",
        error,
        {
          screenWidth,
          screenHeight,
          scale: this.scale,
        }
      );
      return;
    }

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

      // Update positions of all balls based on new screen dimensions. We want to
      // retain the general location of the ball, so we try to position it the
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
  }

  handlePointerDown(pointer: Phaser.Input.Pointer) {
    // Create a new ball at the pointer's position
    this.createBall(pointer.x, pointer.y);
  }

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
