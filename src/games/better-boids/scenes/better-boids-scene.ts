import { Generic2DGameScene } from "@/src/games/utils/game-scene-2d";
import { Boid } from "@/src/games/better-boids/boid";
import { Physics } from "@/src/games/utils/physics";
import { Vec2 } from "@/src/utils/vector";
import {
  instantiateBoids,
  boidEventNames,
} from "@/src/games/better-boids/boid-utils";
import { rigidBody2DEventNames } from "@/src/games/utils/rigid-body-2d";
import { GameObject } from "@/src/games/utils/game-object";

// Used to determine if pointer is held down
const holdThreshold: number = 0.1; // seconds
let pointerDownTime: number = 0;
let holdTimer: NodeJS.Timeout | null = null;

export class BoidsGameScene extends Generic2DGameScene {
  public boids: Boid[] = [];

  constructor() {
    // Call the parent Generic2DGameScene's constructor with
    // "BoidsGameScene" supplied as the name of the scene.
    super("BoidsGameScene");

    // Constructor logic for this scene
    // ...
  }

  preload() {
    super.preload();

    this.load.image("Bad Boid", "/webps/games/bad-boid.webp");
    this.load.image("Good Boid", "/webps/games/good-boid.webp");
    this.load.image("Leader Boid", "/webps/games/leader-boid.webp");

    this.load.spritesheet(
      "Bad Boid Anim",
      "/webps/games/bad-boid-anim-spritesheet.webp",
      { frameWidth: 200, frameHeight: 200 }
    );
    this.load.spritesheet(
      "Good Boid Anim",
      "/webps/games/good-boid-anim-spritesheet.webp",
      { frameWidth: 200, frameHeight: 200 }
    );
    this.load.spritesheet(
      "Leader Boid Anim",
      "/webps/games/leader-boid-anim-spritesheet.webp",
      { frameWidth: 200, frameHeight: 200 }
    );
  }

  create() {
    super.create();

    this.lastKnownWindowSize = new Vec2(window.innerWidth, window.innerHeight);

    // Spawn in x random boids as a Promise (so that we can run this async), and then
    // when that promise is fufilled, we can move on to other init logic
    instantiateBoids(this, 40).then((boids) => {
      this.boids = boids;

      // After everything is loaded in, we can begin the game
      this.gameStarted = true;
    });
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
          boid.handlePhysics(this.boids);
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

    document.addEventListener(
      rigidBody2DEventNames.screenEdgeCollision,
      this.handleScreenEdgeCollision as EventListener
    );

    // Detect when the user interacts with the game
    document.addEventListener("pointerdown", this.handleIsInteracting, {
      capture: true,
    });
    document.addEventListener("pointerup", this.handleIsNotInteracting, {
      capture: true,
    });
    document.addEventListener("pointercancel", this.handleIsNotInteracting, {
      capture: true,
    });

    // Custom event that fires whenever pointer is held down longer than threshold during a click.
    // Pretty much for any "long" click tasks, like hold for this long to call this function.
    document.addEventListener("pointerdown", this.prolongedHoldCheck, {
      capture: true,
    });
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

    document.removeEventListener(
      rigidBody2DEventNames.screenEdgeCollision,
      this.handleScreenEdgeCollision as EventListener
    );

    document.removeEventListener("pointerdown", this.handleIsInteracting);
    document.removeEventListener("pointerup", this.handleIsNotInteracting);
    document.removeEventListener("pointercancel", this.handleIsNotInteracting);

    document.addEventListener("pointerdown", this.prolongedHoldCheck);
  }

  prolongedHoldCheck() {
    // Define holdTimer if it is not already (note that it gets cleared on pointerup below)
    pointerDownTime = Date.now();
    if (!holdTimer) {
      // Check holdThreshold seconds from now if we are still holding down pointer.
      // If we are still holding down, dispatch pointerholdclick to tell the event listeners that we are held down
      holdTimer = setTimeout(() => {
        const holdDuration = Date.now() - pointerDownTime;
        if (holdDuration >= holdThreshold) {
          document.dispatchEvent(new Event(boidEventNames.pointerholdclick));
        }

        // Reset holdTimer after it's triggered
        holdTimer = null;
      }, holdThreshold * 1000); // sec -> millisec
    }

    // When the pointer is released, clear the hold timer
    const pointerUpListener = () => {
      // Reset holdTimer when pointer is released
      if (holdTimer != null) {
        clearTimeout(holdTimer);
      }
      holdTimer = null;

      // Remove the event listener so that we only listen for pointerup once.
      // For reference, we re-listen for pointerup each time we hold down again.
      document.removeEventListener("pointerup", pointerUpListener);
      document.removeEventListener("pointercancel", pointerUpListener);
    };
    document.addEventListener("pointerup", pointerUpListener, {
      once: true,
    });
    document.addEventListener("pointercancel", pointerUpListener, {
      once: true,
    });
  }

  handleIsInteracting() {
    this.isInteracting = true;
  }

  handleIsNotInteracting() {
    this.isInteracting = false;
  }

  handleScreenEdgeCollision(event: CustomEvent) {
    const { gameObjectId, direction } = event.detail;

    // Find the GameObject by ID
    const collidedObject = GameObject.getById(gameObjectId);

    // If the object is found and its name is "Boid", call onCollideScreenEdge
    if (collidedObject instanceof Boid) {
      if (collidedObject && collidedObject.name === "Boid") {
        collidedObject.onCollideScreenEdge(direction);
      }
    }
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

    // Resize the canvas
    this.scale.resize(screenWidth, screenHeight);

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
        if (boid.mainBoid == false) {
          // Calculate new position based on percentage of old position
          const newX =
            (boid.physicsBody2D!.position.x / this.lastKnownWindowSize.x) *
            screenWidth;
          const newY =
            (boid.physicsBody2D!.position.y / this.lastKnownWindowSize.y) *
            screenHeight;

          // handle re-sizing etc. of boid
          boid.handleWindowResize(newX, newY);
        } else {
          // Leader boid position does not change, since it should be where
          // user's pointer is
          boid.handleWindowResize(
            boid.physicsBody2D!.position.x,
            boid.physicsBody2D!.position.y
          );
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
    for (const boid of this.boids) {
      boid.destroy();
    }
  }
}
