import Phaser from "@/public/js/phaser.min.js";

/**
 * Class representing a generic 2D game scene, which can be extended.
 */
export class Generic2DGameScene extends Phaser.Scene {
  public gameStarted: boolean;
  public isInitialized: boolean;

  /**
   * Create a Generic2DGameScene.
   * @param {string} sceneName - The name of the scene.
   */
  constructor(sceneName: string = "Generic2DGameScene") {
    // Inherit all Phaser scene attrs
    super({ key: sceneName });

    this.gameStarted = false;
    this.isInitialized = true;
  }

  preload(): void {
    // Add preload logic
    // ...
  }

  create(): void {
    // Set it up to run shutdown() when the scene is shut down or destroyed
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, this.shutdown, this);
    this.events.once(Phaser.Scenes.Events.DESTROY, this.shutdown, this);

    this.subscribeToEvents();
  }

  subscribeToEvents() {
    // Add event listeners for the scene
    // ...
  }

  unsubscribeFromEvents() {
    // Remove event listeners for the scene
    // ...
  }

  update(time: number, delta: number): void {
    // No-op to use the variables and avoid warnings...
    // Remove these lines if time and delta ever get used.
    void time;
    void delta;

    // Add update logic
    // ...
  }

  shutdown(): void {
    this.unsubscribeFromEvents();

    // Add shutdown logic, such as cleaning up event listeners for the scene
    // ...
  }
}
