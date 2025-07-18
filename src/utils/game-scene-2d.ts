import Phaser from "@/public/js/phaser.min.js";
import { resizeCanvasToParent } from "@/src/utils/phaser-canvas";
import { Vec2 } from "@/src/utils/vector";
import { mobileVirtualKeyboardLikelyOpen } from "@/src/utils/heuristics";
import { screenWakeLock } from "@/src/utils/screen-wake-lock";

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

    // Request a screen wake lock to keep the screen on during gameplay
    screenWakeLock.requestWakeLock();

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
    document.addEventListener("visibilitychange", this.handleVisibilityChange);
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
    document.removeEventListener(
      "visibilitychange",
      this.handleVisibilityChange
    );
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
    // window appears/disappears quickly and causes a scroll that gets stuck. Only
    // reset the scroll if no mobile virtual keyboards are open since we actually
    // do want the keyboard to be able to scroll the page when those reveal for e.g.
    /* eslint-disable no-restricted-syntax */
    if (
      (window.scrollX !== 0 || window.scrollY !== 0) &&
      !mobileVirtualKeyboardLikelyOpen()
    ) {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "instant", // do NOT smoothly scroll here
      });
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

  handleVisibilityChange = async () => {
    // If the document becomes visible again, re-request the wake lock if needed
    if (document.visibilityState === "visible" && !screenWakeLock.isActive) {
      await screenWakeLock.requestWakeLock();
    }
  };

  shutdown(): void {
    this.unsubscribeFromEvents();

    // Release wake lock gracefully, but don't force this to be async. This allows
    // the shutdown to complete even if the wake lock release has issues, and allows
    // shutdown to remain synchronous as Phaser expects.
    screenWakeLock.releaseWakeLock().catch(console.error);
  }
}
