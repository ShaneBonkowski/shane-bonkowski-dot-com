import Phaser from "@/public/js/phaser.min.js";

export const genericGameEventNames = {
  uiMenuOpen: "uiMenuOpen",
  uiMenuClosed: "uiMenuClosed",
};

export class Generic2DGameScene extends Phaser.Scene {
  public gameStarted: boolean;
  public uiMenuOpen: boolean;
  public paused: boolean;

  constructor(sceneName: string = "Generic2DGameScene") {
    // Inherit all Phaser scene attrs
    super({ key: sceneName });

    this.gameStarted = false;
    this.uiMenuOpen = false;
    this.paused = false;

    // Bind "this" to refer to the scene for necessary functions
    this.preventDefault = this.preventDefault.bind(this);
  }

  // Disable scrolling
  disableScroll(): void {
    document.addEventListener("touchmove", this.preventDefault, {
      passive: false,
    });

    document.addEventListener("mousewheel", this.preventDefault, {
      passive: false,
    });
  }

  // Enable scrolling
  enableScroll(): void {
    document.removeEventListener("touchmove", this.preventDefault);
    document.removeEventListener("mousewheel", this.preventDefault);
  }

  // Prevent default behavior of events (used in this case for disabling scroll)
  preventDefault(event: Event): void {
    event.preventDefault();
  }

  // Cleanup event listeners when the scene is shutdown or destroyed
  private cleanupEventListeners(): void {
    this.enableScroll();
  }

  // Add event listeners for scene shutdown and destroy
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
