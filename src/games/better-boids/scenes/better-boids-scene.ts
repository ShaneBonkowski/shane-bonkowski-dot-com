import { Generic2DGameScene } from "@/src/games/utils/game-scene-2d";
import { Boid } from "@/src/games/better-boids/boid";
import { Physics } from "@/src/games/utils/physics";
import { Vec2 } from "@/src/utils/vector";

export class MainGameScene extends Generic2DGameScene {
  public boids: Boid[] = [];

  constructor() {
    // Call the parent Generic2DGameScene's constructor with
    // "MainGameScene" supplied as the name of the scene.
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

    this.lastKnownWindowSize = new Vec2(window.innerWidth, window.innerHeight);

    this.gameStarted = true;
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

        // Handle the boid physics
        for (const boid of this.boids) {
          boid.handlePhysics(delta);
        }
      }

      // Graphics update will occur every frame
      for (const boid of this.boids) {
        boid.updateGraphic();
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
    }
    window.removeEventListener("resize", this.handleWindowResize.bind(this));
    window.removeEventListener(
      "orientationchange",
      this.handleWindowResize.bind(this)
    );
  }

  setUpWindowResizeHandling() {
    // Observe window resizing so we can adjust the boid's position
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
    // Get the new screen dimensions
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;

    // If not instantiated yet, set lastKnownWindowSize to current screen dimensions
    if (this.lastKnownWindowSize != null) {
      if (
        this.lastKnownWindowSize.x === screenWidth &&
        this.lastKnownWindowSize.y === screenHeight
      ) {
        return;
      }

      // Update positions of all boids based on new screen dimensions. We want to
      // retain the general location of the boid, so we try to position it the
      // same screen % it was before on the new screen.
      for (const boid of this.boids) {
        // Calculate new position based on percentage of old position
        const new_x =
          (boid.physicsBody2D!.position.x / this.lastKnownWindowSize.x) *
          screenWidth;
        const new_y =
          (boid.physicsBody2D!.position.y / this.lastKnownWindowSize.y) *
          screenHeight;

        // handle re-sizing etc. of boid
        boid.handleWindowResize(new_x, new_y);
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
    for (const boid of this.boids) {
      boid.destroy();
    }
  }
}
