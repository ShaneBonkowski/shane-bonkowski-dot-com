import { Generic2DGameScene } from "@/src/utils/game-scene-2d";
import { Ball } from "@/src/games/game-template/ball"; // FIXME: Update this for your actual game name
import { Physics } from "@/src/utils/physics";
import {
  dispatchCloseLoadingScreenEvent,
  dispatchGameStartedEvent,
} from "@/src/events/game-events";
import {
  gameDataStore,
  GameData,
} from "@/src/games/game-template/game-data-store"; // FIXME: Update this for your actual game name

export class MainGameScene extends Generic2DGameScene {
  private balls: Ball[] = [];
  public maxBalls: number = 10;
  private score: number = 0;

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
    // ...
  }

  create() {
    super.create();

    this.setupSyncedGameData();

    // Create a ball and make it bounce around the
    // screen using physics
    const { width, height } = this.scale.gameSize;

    for (let i = 0; i < 5; i++) {
      this.createBall(width / 2, height / 2);
    }

    this.gameStarted = true;
    dispatchCloseLoadingScreenEvent("<TYPE GAME NAME HERE>"); // FIXME: GAME NAME HERE
    dispatchGameStartedEvent("<TYPE GAME NAME HERE>"); // FIXME: GAME NAME HERE
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
    this.score = gameData.score;
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
  }

  /*
   * Note that this function is called in the create() method for GameScene2D,
   * so no need to call it! That is handled automatically.
   */
  subscribeToEvents() {
    super.subscribeToEvents();

    // Subscribe to events for this scene
    this.input.on("pointerdown", this.handlePointerDown, this);
  }

  /*
   * Note that this function is called in the shutdown() method for GameScene2D,
   * so no need to call it! That is handled automatically.
   */
  unsubscribeFromEvents() {
    super.unsubscribeFromEvents();

    // Unsubscribe from events for this scene
    this.input.off("pointerdown", this.handlePointerDown, this);
  }

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

      // Update positions of all objs based on new screen dimensions. We want to
      // retain the general location of the obj, so we try to position it the
      // same screen % it was before on the new screen.
      for (const ball of this.balls) {
        const newX =
          (ball.physicsBody2D!.position.x / this.lastKnownWindowSize.x) *
          this.screenInfo.width;
        const newY =
          (ball.physicsBody2D!.position.y / this.lastKnownWindowSize.y) *
          this.screenInfo.height;

        // handle re-sizing etc. of ball
        ball.handleWindowResize(newX, newY);
      }
    }
  }

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

    // Update the game data store with the new "score", which is the number of balls
    gameDataStore.setScore(this.balls.length);
    document.dispatchEvent(new CustomEvent("scoreChange"));
  }

  /*
   * Note that this function is called by GameScene2D during shutdown,
   * so no need to call it! That is handled automatically.
   */
  shutdown() {
    super.shutdown();

    // reset the store
    gameDataStore.resetData();

    // Shutdown logic for this scene
    for (const ball of this.balls) {
      ball.destroy();
    }
    this.balls.length = 0; // Clear the array
  }
}
