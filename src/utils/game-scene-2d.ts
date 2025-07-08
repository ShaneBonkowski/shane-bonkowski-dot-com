import Phaser from "@/public/js/phaser.min.js";
import { resizeCanvasToParent } from "@/src/utils/phaser-canvas";
import { Vec2 } from "@/src/utils/vector";
import { virtualKeyboardLikelyOpen } from "@/src/utils/heuristics";

/**
 * Class representing a generic 2D game scene, which can be extended.
 */
export class Generic2DGameScene extends Phaser.Scene {
  // Scene state
  public gameStarted: boolean = false;
  public isInitialized: boolean = false;
  public uiMenuOpen: boolean = false;

  // Window/screen info
  public screenInfo = {
    width: 0,
    height: 0,
    isPortrait: false,
  };
  private resizeObserver: ResizeObserver | null = null;
  private lastManualWindowResizeTime: number = 0;
  private windowResizeInterval: number = 2000;
  public lastKnownWindowSize = new Vec2(0, 0);

  /**
   * Create a Generic2DGameScene.
   * @param {string} sceneName - The name of the scene.
   */
  // eslint-disable-next-line no-restricted-syntax
  constructor(sceneName: string = "Generic2DGameScene") {
    // Inherit all Phaser scene attrs
    super({ key: sceneName });

    // Return early during SSR/static generation (need to call super first)
    if (typeof window === "undefined") return;

    this.gameStarted = false;
    this.isInitialized = true;

    // Initial screen info
    this.updateScreenInfo();

    // Initial last known window size
    this.lastKnownWindowSize = new Vec2(
      this.screenInfo.width,
      this.screenInfo.height
    );
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

    // Make sure canvas is the right size at the start
    this.handleWindowResize();
  }

  update(time: number, delta: number): void {
    // No-op to use the variables and avoid warnings...
    // Remove these lines if delta ever gets used.
    void delta;

    // In order to handle edge cases where the resize observer does not catch
    // a resize (such as when iPhone toolbar changes), we also check for resize
    // every windowResizeInterval milliseconds.
    if (time - this.lastManualWindowResizeTime >= this.windowResizeInterval) {
      this.handleWindowResize();
      this.lastManualWindowResizeTime = time;
    }
  }

  subscribeToEvents() {
    // Add event listeners for the scene
    // ...
    this.setUpWindowResizeHandling();
    document.addEventListener("uiMenuOpen", this.handleUiMenuOpen);
    document.addEventListener("uiMenuClose", this.handleUiMenuClose);
  }

  setUpWindowResizeHandling() {
    // Observe window resizing so we can adjust the position and size accordingly!

    // Use ResizeObserver since it is good for snappy changes
    this.resizeObserver = new ResizeObserver(() => {
      this.handleWindowResize();
    });
    this.resizeObserver.observe(document.documentElement);

    // Also checking for resize or orientation change events to try to handle
    // edge cases that ResizeObserver misses!
    /* eslint-disable no-restricted-syntax */
    window.addEventListener("resize", this.handleWindowResize);
    window.addEventListener("orientationchange", this.handleWindowResize);
    /* eslint-enable no-restricted-syntax */
  }

  unsubscribeFromEvents() {
    // Remove event listeners for the scene
    // ...
    this.tearDownWindowResizeHandling();
    document.removeEventListener("uiMenuOpen", this.handleUiMenuOpen);
    document.removeEventListener("uiMenuClose", this.handleUiMenuClose);
  }

  tearDownWindowResizeHandling() {
    if (this.resizeObserver != null) {
      this.resizeObserver.disconnect();
      this.resizeObserver = null;
    }
    /* eslint-disable no-restricted-syntax */
    window.removeEventListener("resize", this.handleWindowResize);
    window.removeEventListener("orientationchange", this.handleWindowResize);
    /* eslint-enable no-restricted-syntax */
  }

  // Using Arrow Function to bind the context of "this" to the class instance.
  // This is necc. for event handlers.
  handleWindowResize = () => {
    // Ensure the scene is fully initialized before handling resize
    if (!this.isInitialized) {
      console.warn("handleWindowResize called before scene initialization.");
      return;
    }

    // Get up to date screen info
    this.updateScreenInfo();

    // Update canvas size to match the parent.
    // This is needed to be done manually since Phaser.AUTO does not
    // take into account some nuances of screen size on safari/iOS.
    resizeCanvasToParent(this.game);

    // This is a workaround for the iOS bug where address bar or "enable diction"
    // window appears/disappears quickly and causes a scroll that gets stuck.
    // Only reset the scroll if the windows are likely closed (helps prevent e.g.
    // a visual bug where e.g. keyboard being open causes a scroll flicker).
    /* eslint-disable no-restricted-syntax */
    if (
      (window.scrollX !== 0 || window.scrollY !== 0) &&
      !virtualKeyboardLikelyOpen()
    ) {
      window.scrollTo(0, 0);
    }
    /* eslint-enable no-restricted-syntax */

    // Call the hook for subclasses to override for custom behavior
    this.handleWindowResizeHook();

    // Last thing we do is set the lastKnownWindowSize to the current screen size.
    // This is after the hook so that subclasses can compare against the previous
    // size if needed.
    this.lastKnownWindowSize = new Vec2(
      this.screenInfo.width,
      this.screenInfo.height
    );
  };

  updateScreenInfo() {
    this.screenInfo = {
      /* eslint-disable no-restricted-syntax */
      width:
        window.visualViewport?.width ||
        window.innerWidth ||
        document.documentElement.clientWidth,
      height:
        window.visualViewport?.height ||
        window.innerHeight ||
        document.documentElement.clientHeight,

      isPortrait: window.matchMedia("(orientation: portrait)").matches,
      /* eslint-enable no-restricted-syntax */
    };
  }

  handleWindowResizeHook() {
    // Override this method in subclasses to add custom resize handling logic
    // ...
  }

  // Using Arrow Function to bind the context of "this" to the class instance.
  // This is necc. for event handlers.
  handleUiMenuOpen = () => {
    this.uiMenuOpen = true;
    this.handleUiMenuOpenHook();
  };

  handleUiMenuOpenHook() {
    // Override this method in subclasses to add custom logic when the UI menu opens
    // For example, pause the game or show a specific UI element
    // ...
  }

  // Using Arrow Function to bind the context of "this" to the class instance.
  // This is necc. for event handlers.
  handleUiMenuClose = () => {
    this.uiMenuOpen = false;
    this.handleUiMenuCloseHook();
  };

  handleUiMenuCloseHook() {
    // Override this method in subclasses to add custom logic when the UI menu closes
    // For example, resume the game or hide a specific UI element
    // ...
  }

  shutdown(): void {
    this.unsubscribeFromEvents();

    // Add shutdown logic, such as cleaning up event listeners for the scene
    // ...
  }
}
