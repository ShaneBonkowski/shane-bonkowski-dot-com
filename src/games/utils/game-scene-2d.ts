import Phaser from "@/public/js/phaser.min.js";

export const genericGameEventNames = {
  uiMenuOpen: "uiMenuOpen",
  uiMenuClosed: "uiMenuClosed",
};

/**
 * Class representing a generic 2D game scene.
 */
export class Generic2DGameScene extends Phaser.Scene {
  public gameStarted: boolean;
  public uiMenuOpen: boolean;
  public paused: boolean;

  /**
   * Create a Generic2DGameScene.
   * @param {string} sceneName - The name of the scene.
   */
  constructor(sceneName: string = "Generic2DGameScene") {
    // Inherit all Phaser scene attrs
    super({ key: sceneName });

    this.gameStarted = false;
    this.uiMenuOpen = false;
    this.paused = false;

    // Bind "this" to refer to the scene for necessary functions
    this.preventDefault = this.preventDefault.bind(this);
  }

  /**
   * Disable scrolling on the page
   * @returns {void}
   */
  disableScroll(): void {
    document.addEventListener("touchmove", this.preventDefault, {
      passive: false,
    });

    document.addEventListener("mousewheel", this.preventDefault, {
      passive: false,
    });
  }

  /**
   * Enable scrolling on the page
   * @returns {void}
   */
  enableScroll(): void {
    document.removeEventListener("touchmove", this.preventDefault);
    document.removeEventListener("mousewheel", this.preventDefault);
  }

  /**
   * Prevent default behavior of events (used in this case for disabling scroll)
   * @param {Event} event - The event to prevent default behavior for
   * @returns {void}
   */
  preventDefault(event: Event): void {
    event.preventDefault();
  }

  /**
   * Cleanup event listeners for the scene
   * @returns {void}
   */
  private cleanupEventListeners(): void {
    this.enableScroll();
  }

  /**
   * Create the scene and add event listeners
   * @returns {void}
   */
  create(): void {
    this.events.once(
      Phaser.Scenes.Events.SHUTDOWN,
      this.cleanupEventListeners,
      this
    );
    this.events.once(
      Phaser.Scenes.Events.DESTROY,
      this.cleanupEventListeners,
      this
    );
  }
}
