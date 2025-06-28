import { Generic2DGameScene } from "@/src/utils/game-scene-2d";
import { Boid } from "@/src/games/better-boids/boid";
import { Physics } from "@/src/utils/physics";
import { instantiateBoids } from "@/src/games/better-boids/boid-utils";
import { GameObject } from "@/src/utils/game-object";
import {
  dispatchCloseLoadingScreenEvent,
  dispatchGameStartedEvent,
} from "@/src/events/game-events";
import { settingsStore } from "@/src/games/better-boids/settings-store";

// Used to determine if pointer is held down
const holdThreshold: number = 0.1; // seconds
let pointerDownTime: number = 0;
let holdTimeout: NodeJS.Timeout | null = null;

export class MainGameScene extends Generic2DGameScene {
  public boids: Boid[] = [];

  // eslint-disable-next-line no-restricted-syntax
  constructor() {
    // Call the parent Generic2DGameScene's constructor with
    // "MainGameScene" supplied as the name of the scene.
    super("MainGameScene");

    // Return early during SSR/static generation (need to call super first)
    if (typeof window === "undefined") return;
  }

  preload() {
    super.preload();

    this.load.image("Bad Boid", "/webps/games/better-boids-bad-boid.webp");
    this.load.image("Good Boid", "/webps/games/better-boids-good-boid.webp");
    this.load.image(
      "Leader Boid",
      "/webps/games/better-boids-leader-boid.webp"
    );

    this.load.spritesheet(
      "Bad Boid Anim",
      "/webps/games/better-boids-bad-boid-anim-spritesheet.webp",
      { frameWidth: 200, frameHeight: 200 }
    );
    this.load.spritesheet(
      "Good Boid Anim",
      "/webps/games/better-boids-good-boid-anim-spritesheet.webp",
      { frameWidth: 200, frameHeight: 200 }
    );
    this.load.spritesheet(
      "Leader Boid Anim",
      "/webps/games/better-boids-leader-boid-anim-spritesheet.webp",
      { frameWidth: 200, frameHeight: 200 }
    );
  }

  create() {
    super.create();

    this.boids = instantiateBoids(this, 40);

    this.gameStarted = true;
    dispatchCloseLoadingScreenEvent("Better Boids");
    dispatchGameStartedEvent("Better Boids");
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
    document.addEventListener(
      "screenEdgeCollision",
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
    document.addEventListener("pointerdown", this.handleProlongedHoldCheck, {
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
    document.removeEventListener(
      "screenEdgeCollision",
      this.handleScreenEdgeCollision as EventListener
    );
    document.removeEventListener("pointerdown", this.handleIsInteracting);
    document.removeEventListener("pointerup", this.handleIsNotInteracting);
    document.removeEventListener("pointercancel", this.handleIsNotInteracting);
    document.removeEventListener("pointerdown", this.handleProlongedHoldCheck);
  }

  handleProlongedHoldCheck = () => {
    // Define holdTimeout if it is not already (note that it gets cleared on pointerup below)
    pointerDownTime = Date.now();
    if (!holdTimeout) {
      // Check holdThreshold seconds from now if we are still holding down pointer.
      // If we are still holding down, dispatch pointerholdclick to tell the event listeners that we are held down
      holdTimeout = setTimeout(() => {
        const holdDuration = Date.now() - pointerDownTime;
        if (holdDuration >= holdThreshold) {
          document.dispatchEvent(new CustomEvent("pointerholdclick"));
        }

        // Reset holdTimeout after it's triggered
        holdTimeout = null;
      }, holdThreshold * 1000); // sec -> millisec
    }

    // When the pointer is released, clear the hold timer
    const handlePointerUp = () => {
      // Reset holdTimeout when pointer is released
      if (holdTimeout != null) {
        clearTimeout(holdTimeout);
      }
      holdTimeout = null;

      // Remove the event listener so that we only listen for pointerup once.
      // For reference, we re-listen for pointerup each time we hold down again.
      document.removeEventListener("pointerup", handlePointerUp);
      document.removeEventListener("pointercancel", handlePointerUp);
    };
    document.addEventListener("pointerup", handlePointerUp, {
      once: true,
    });
    document.addEventListener("pointercancel", handlePointerUp, {
      once: true,
    });
  };

  handleIsInteracting = () => {
    this.isInteracting = true;
  };

  handleIsNotInteracting = () => {
    this.isInteracting = false;
  };

  handleScreenEdgeCollision = (event: CustomEvent) => {
    const { gameObjectId, direction } = event.detail;

    // Find the GameObject by ID
    const collidedObject = GameObject.getById(gameObjectId);

    // If the object is found and its name is "Boid", call onCollideScreenEdge
    if (collidedObject && collidedObject.name === "Boid") {
      (collidedObject as Boid).onCollideScreenEdge(direction);
    }
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

      // Update positions of all boids based on new screen dimensions. We want to
      // retain the general location of the boid, so we try to position it the
      // same screen % it was before on the new screen.
      for (const boid of this.boids) {
        if (boid.mainBoid == false) {
          // Calculate new position based on percentage of old position
          const newX =
            (boid.physicsBody2D!.position.x / this.lastKnownWindowSize.x) *
            this.screenInfo.width;
          const newY =
            (boid.physicsBody2D!.position.y / this.lastKnownWindowSize.y) *
            this.screenInfo.height;

          // handle re-sizing etc. of boid
          boid.handleWindowResize(newX, newY);
        } else {
          // Leader boid position does not change, since it should be where
          // user's pointer is (still needs to update scale though)
          boid.handleWindowResize(
            boid.physicsBody2D!.position.x,
            boid.physicsBody2D!.position.y
          );
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

    // Shutdown logic for this scene
    settingsStore.resetData();

    for (const boid of this.boids) {
      boid.destroy();
    }
    this.boids.length = 0; // Clear the boids array
  }
}
