let touchThroughBlocker: HTMLDivElement | null = null;

/**
 * Installs a transparent fullscreen overlay that intercepts pointer events
 * to prevent accidental touch-through after UI transitions (e.g. closing modals).
 *
 * Automatically removes itself on the next pointerup or after some delay
 * (whichever comes first).
 */
export function installTouchThroughBlocker(): void {
  if (typeof window === "undefined") {
    return;
  }

  if (touchThroughBlocker) {
    return;
  }

  // Create the "blocker" element
  touchThroughBlocker = document.createElement("div");

  Object.assign(touchThroughBlocker.style, {
    position: "fixed",
    inset: "0",
    zIndex: "2147483647", // Max z-index to be on top of everything
    background: "transparent",
    pointerEvents: "auto",
    touchAction: "none", // Prevent gesture recognition just in case
  });

  // Set up cleanup logic to remove the "blocker"
  let cleanupTimeout: NodeJS.Timeout | null = null;
  let cleanedUp = false;

  document.body.appendChild(touchThroughBlocker);

  const cleanup = () => {
    if (cleanedUp) {
      return;
    }

    cleanedUp = true;

    if (cleanupTimeout) {
      clearTimeout(cleanupTimeout);
    }

    /* eslint-disable no-restricted-syntax */
    window.removeEventListener("pointerup", handlePointerUp);
    window.removeEventListener("pointercancel", handlePointerUp);
    /* eslint-enable no-restricted-syntax */

    if (touchThroughBlocker) {
      touchThroughBlocker.remove();
      touchThroughBlocker = null;
    }
  };

  const setCleanupDelay = (ms: number) => {
    // Cleaup after a delay
    if (cleanupTimeout) clearTimeout(cleanupTimeout);
    cleanupTimeout = setTimeout(cleanup, ms);
  };

  // Long-running cleanup which serves as backup to ensure cleanup even if the
  // following pointerup event(s) never fire
  setCleanupDelay(1000);

  const handlePointerUp = (e: PointerEvent) => {
    e.stopPropagation();
    e.preventDefault();

    // Cleanup after a short delay to ensure that there is no touch-through.
    // This overrides the fallback timeout if a pointerup occurs first.
    setCleanupDelay(150);
  };

  /* eslint-disable no-restricted-syntax */
  window.addEventListener("pointerup", handlePointerUp);
  window.addEventListener("pointercancel", handlePointerUp);
  /* eslint-enable no-restricted-syntax */
}
